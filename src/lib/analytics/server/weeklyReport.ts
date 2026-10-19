import { timingSafeEqual } from "node:crypto";
import { KEYS } from "./collect";
import { buildDigest, loadWeekStats } from "./digest";
import type { Redis } from "./redis";
import type { TelegramSender } from "./telegram";
import { addDays, isCompleteWeek, isValidWeekKey, previousCompleteWeek } from "./time";

/**
 * Weekly Report Job:
 * Sends the digest for the previous complete week exactly once. A short lock
 * stops overlapping runs; a persisted progress record lets a retry resume after
 * the last delivered message instead of re-sending the ones that went out.
 */

const DIGEST_RECORD_TTL_SECONDS = 90 * 24 * 60 * 60;
const LOCK_TTL_SECONDS = 300;

interface DigestRecord {
  status: "partial" | "sent";
  sentParts: number;
  updatedAt: string;
}

export type ReportResult =
  | { status: "sent"; week: string; parts: number }
  | { status: "already_sent"; week: string }
  | { status: "in_progress"; week: string }
  | { status: "dry_run"; week: string; messages: string[] }
  | { status: "failed"; week: string; sentParts: number; error: string };

/** Constant-time `Authorization: Bearer <CRON_SECRET>` check, as Vercel Cron sends it. */
export function isAuthorizedCronRequest(request: Request, secret: string | undefined): boolean {
  if (!secret) return false;
  const provided = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

/** Resolves the requested week, defaulting to the previous complete one. */
export function resolveReportWeek(
  requested: string | null,
  now: Date,
  timeZone: string,
): { week: string; comparison: string } | { error: string } {
  if (!requested) return previousCompleteWeek(now, timeZone);
  if (!isValidWeekKey(requested)) return { error: "week must be a Monday in YYYY-MM-DD format" };
  if (!isCompleteWeek(requested, now, timeZone)) return { error: "week is not complete yet" };
  return { week: requested, comparison: addDays(requested, -7) };
}

export async function runWeeklyReport(options: {
  redis: Redis;
  telegram: TelegramSender | null;
  week: string;
  comparison: string;
  timeZone: string;
  dryRun: boolean;
  now: () => Date;
}): Promise<ReportResult> {
  const { redis, week } = options;

  const [current, previous] = await Promise.all([
    loadWeekStats(redis, week),
    loadWeekStats(redis, options.comparison),
  ]);
  const messages = buildDigest({
    week,
    comparisonWeek: options.comparison,
    current,
    previous,
    timeZone: options.timeZone,
  });

  if (options.dryRun) return { status: "dry_run", week, messages };
  if (!options.telegram) {
    return { status: "failed", week, sentParts: 0, error: "Telegram is not configured" };
  }

  const recordRaw = await redis.command<string | null>(["GET", KEYS.digest(week)]);
  const record = recordRaw ? (JSON.parse(recordRaw) as DigestRecord) : null;
  if (record?.status === "sent") return { status: "already_sent", week };

  const locked = await redis.command(["SET", KEYS.digestLock(week), "1", "EX", LOCK_TTL_SECONDS, "NX"]);
  if (locked !== "OK") return { status: "in_progress", week };

  let sentParts = Math.min(record?.sentParts ?? 0, messages.length);
  const save = (status: DigestRecord["status"]) =>
    redis.command([
      "SET",
      KEYS.digest(week),
      JSON.stringify({ status, sentParts, updatedAt: options.now().toISOString() }),
      "EX",
      DIGEST_RECORD_TTL_SECONDS,
    ]);

  try {
    for (let part = sentParts; part < messages.length; part += 1) {
      const label = messages.length > 1 ? `\n\n(${part + 1}/${messages.length})` : "";
      await options.telegram(`${messages[part]}${label}`);
      sentParts = part + 1;
      await save(sentParts === messages.length ? "sent" : "partial");
    }
    if (messages.length === 0) await save("sent");
    return { status: "sent", week, parts: messages.length };
  } catch (error) {
    return {
      status: "failed",
      week,
      sentParts,
      error: error instanceof Error ? error.message : "unknown error",
    };
  } finally {
    await redis.command(["DEL", KEYS.digestLock(week)]).catch(() => undefined);
  }
}
