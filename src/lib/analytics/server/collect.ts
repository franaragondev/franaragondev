import { createHash } from "node:crypto";
import { MAX_PAYLOAD_BYTES, validateVisitPayload } from "../payload";
import { formatFollowUpMessage, formatVisitMessage } from "./format";
import type { Redis, RedisCommand } from "./redis";
import { mergeVisit, type StoredVisit } from "./sessionize";
import type { TelegramSender } from "./telegram";
import { weekKeyFor } from "./time";
import { isLikelyBot, summarizeUserAgent } from "./userAgent";

/**
 * Visit Collection Endpoint Logic:
 * Validates a beacon, sessionizes it against stored state, updates the weekly
 * aggregates and schedules at most one Telegram notification per session (plus
 * capped follow-ups for later conversions). Telegram runs after the response,
 * so delivery problems never affect the visitor.
 */

export const KEYS = {
  visit: (id: string) => `fa:visit:${id}`,
  lock: (id: string) => `fa:lock:${id}`,
  rate: (hash: string) => `fa:rate:${hash}`,
  notifyCap: (hour: string) => `fa:notify:${hour}`,
  week: (week: string, dimension: string) => `fa:week:${week}:${dimension}`,
  digest: (week: string) => `fa:digest:${week}`,
  digestLock: (week: string) => `fa:digest-lock:${week}`,
};

/** Session state is kept just long enough to merge a session's beacons. */
export const VISIT_TTL_SECONDS = 6 * 60 * 60;
/** Weekly aggregates power the digest and its week-over-week comparison. */
export const AGGREGATE_TTL_SECONDS = 120 * 24 * 60 * 60;
export const RATE_LIMIT = { windowSeconds: 600, maxBeacons: 120 };
export const NOTIFICATIONS_PER_HOUR = 30;

export interface CollectDeps {
  redis: Redis | null;
  telegram: TelegramSender | null;
  /** Runs work after the response is sent (next/server `after` in production). */
  schedule: (task: () => Promise<void>) => void;
  now: () => Date;
  timeZone: string;
  /** Server-side secret mixed into the rate-limit hash. */
  hashSecret: string;
  log?: (message: string) => void;
}

const empty = (status: number) => new Response(null, { status });

function clientIp(request: Request): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

function header(request: Request, name: string, pattern: RegExp): string | null {
  const value = request.headers.get(name);
  if (!value) return null;
  try {
    const decoded = decodeURIComponent(value).toUpperCase();
    return pattern.test(decoded) ? decoded : null;
  } catch {
    return null;
  }
}

/** Same-origin only. Browsers always send these headers on beacons; scripts may not. */
function isCrossSite(request: Request): boolean {
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return true;
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host !== request.headers.get("host");
  } catch {
    return true;
  }
}

async function acquireLock(redis: Redis, id: string): Promise<boolean> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const result = await redis.command(["SET", KEYS.lock(id), "1", "PX", 5000, "NX"]);
    if (result === "OK") return true;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return false;
}

export async function handleCollect(request: Request, deps: CollectDeps): Promise<Response> {
  const log = deps.log ?? ((message: string) => console.warn(`[analytics] ${message}`));

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_PAYLOAD_BYTES) return empty(413);
  if (isCrossSite(request)) return empty(403);

  const body = await request.text();
  if (Buffer.byteLength(body) > MAX_PAYLOAD_BYTES) return empty(413);

  let json: unknown;
  try {
    json = JSON.parse(body);
  } catch {
    return empty(400);
  }
  const validation = validateVisitPayload(json);
  if (!validation.ok) return empty(400);
  const payload = validation.payload;

  const userAgent = request.headers.get("user-agent");
  if (isLikelyBot(userAgent)) return empty(204);

  // Not configured yet: accept silently so the site keeps working.
  const { redis } = deps;
  if (!redis) return empty(204);

  const now = deps.now();
  const day = now.toISOString().slice(0, 10);
  // Keyed, daily-rotating hash: the raw IP is never stored, only used transiently here.
  const rateKey = createHash("sha256")
    .update(`${clientIp(request)}|${day}|${deps.hashSecret}`)
    .digest("hex")
    .slice(0, 24);

  try {
    const [, count] = await redis.pipeline([
      ["SET", KEYS.rate(rateKey), 0, "EX", RATE_LIMIT.windowSeconds, "NX"],
      ["INCR", KEYS.rate(rateKey)],
    ]);
    if (Number(count) > RATE_LIMIT.maxBeacons) return empty(429);

    if (!(await acquireLock(redis, payload.id))) return empty(202);

    let notify: (() => Promise<void>) | null = null;
    try {
      const raw = await redis.command<string | null>(["GET", KEYS.visit(payload.id)]);
      const previous = raw ? (JSON.parse(raw) as StoredVisit) : null;

      const { visit, increments, notification } = mergeVisit(previous, payload, {
        now: now.getTime(),
        week: previous?.week ?? weekKeyFor(now, deps.timeZone),
        country: header(request, "x-vercel-ip-country", /^[A-Z]{2}$/),
        region: header(request, "x-vercel-ip-country-region", /^[A-Z0-9]{1,3}$/),
        device: summarizeUserAgent(userAgent ?? "", payload.touch),
      });

      const commands: RedisCommand[] = [
        ["SET", KEYS.visit(visit.id), JSON.stringify(visit), "EX", VISIT_TTL_SECONDS],
      ];
      const touched = new Set<string>();
      for (const { dimension, field, by } of increments) {
        const key = KEYS.week(visit.week, dimension);
        commands.push(["HINCRBY", key, field, by]);
        touched.add(key);
      }
      touched.forEach((key) => commands.push(["EXPIRE", key, AGGREGATE_TTL_SECONDS]));
      await redis.pipeline(commands);

      if (notification && deps.telegram) {
        const text =
          notification.kind === "visit"
            ? formatVisitMessage(visit, deps.timeZone)
            : formatFollowUpMessage(visit, notification.events, deps.timeZone);
        const send = deps.telegram;
        notify = async () => {
          const hour = now.toISOString().slice(0, 13);
          const [, sent] = await redis.pipeline([
            ["SET", KEYS.notifyCap(hour), 0, "EX", 7200, "NX"],
            ["INCR", KEYS.notifyCap(hour)],
          ]);
          if (Number(sent) > NOTIFICATIONS_PER_HOUR) {
            log("hourly notification cap reached; visit still recorded");
            return;
          }
          await send(text);
        };
      }
    } finally {
      await redis.command(["DEL", KEYS.lock(payload.id)]).catch(() => undefined);
    }

    if (notify) {
      const task = notify;
      deps.schedule(async () => {
        try {
          await task();
        } catch (error) {
          log(`notification failed: ${error instanceof Error ? error.message : "unknown error"}`);
        }
      });
    }
    return empty(204);
  } catch (error) {
    log(`collect failed: ${error instanceof Error ? error.name : "unknown error"}`);
    return empty(204);
  }
}
