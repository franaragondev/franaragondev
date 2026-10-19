import {
  isEventKey,
  isLocale,
  isRouteKey,
  isSectionKey,
  type EventKey,
  type Locale,
  type RouteKey,
  type SectionKey,
  type TrailKey,
} from "./catalog";

/**
 * Visit Payload Contract:
 * The cumulative state of one browsing session, sent by the browser as a beacon.
 * It never contains URLs with query strings, IP addresses, user agents or any
 * cross-session identifier: `id` is random, lives in sessionStorage and dies
 * with the tab.
 */
export interface VisitPayload {
  v: 1;
  id: string;
  landing: RouteKey;
  locale: Locale;
  /** Hostname of an external referrer only; null when absent or internal. */
  referrer: string | null;
  utm: Utm | null;
  /** Ordered routes and sections, first view of each. */
  trail: TrailKey[];
  pageviews: number;
  sections: SectionKey[];
  events: EventKey[];
  /** Time the tab was visible during the session. */
  engagedMs: number;
  /** Touch-capable device; disambiguates iPadOS, which reports a Mac user agent. */
  touch: boolean;
  /** Session restarted in a tab left idle past the timeout: its origin is unknown. */
  resumed: boolean;
}

export interface Utm {
  source?: string;
  medium?: string;
  campaign?: string;
}

export const MAX_PAYLOAD_BYTES = 4096;
export const MAX_TRAIL = 40;
export const MAX_PAGEVIEWS = 500;
export const MAX_ENGAGED_MS = 6 * 60 * 60 * 1000;

const ID_PATTERN = /^[a-f0-9]{32}$/;
const HOST_PATTERN = /^(?=.{1,253}$)[a-z0-9-]+(\.[a-z0-9-]+)+$/;
export const UTM_PATTERN = /^[a-z0-9._+-]{1,64}$/;

export type ValidationResult =
  | { ok: true; payload: VisitPayload }
  | { ok: false; error: string };

function isIntInRange(value: unknown, min: number, max: number): value is number {
  return Number.isInteger(value) && (value as number) >= min && (value as number) <= max;
}

function uniqueList<T>(
  value: unknown,
  guard: (item: unknown) => item is T,
  max: number,
): T[] | null {
  if (!Array.isArray(value) || value.length > max || !value.every(guard)) return null;
  return value.length === new Set(value).size ? (value as T[]) : null;
}

function parseUtm(value: unknown): Utm | null | undefined {
  if (value === null) return null;
  if (typeof value !== "object" || Array.isArray(value)) return undefined;

  const utm: Utm = {};
  for (const key of ["source", "medium", "campaign"] as const) {
    const field = (value as Record<string, unknown>)[key];
    if (field === undefined) continue;
    if (typeof field !== "string" || !UTM_PATTERN.test(field)) return undefined;
    utm[key] = field;
  }
  return Object.keys(utm).length > 0 ? utm : null;
}

/** Strict validation: anything outside the catalog or the size limits is rejected. */
export function validateVisitPayload(input: unknown): ValidationResult {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { ok: false, error: "payload must be an object" };
  }
  const raw = input as Record<string, unknown>;

  if (raw.v !== 1) return { ok: false, error: "unsupported version" };
  if (typeof raw.id !== "string" || !ID_PATTERN.test(raw.id)) {
    return { ok: false, error: "invalid id" };
  }
  if (!isRouteKey(raw.landing)) return { ok: false, error: "invalid landing" };
  if (!isLocale(raw.locale)) return { ok: false, error: "invalid locale" };
  if (
    raw.referrer !== null &&
    (typeof raw.referrer !== "string" || !HOST_PATTERN.test(raw.referrer))
  ) {
    return { ok: false, error: "invalid referrer" };
  }

  const utm = parseUtm(raw.utm);
  if (utm === undefined) return { ok: false, error: "invalid utm" };

  if (
    !Array.isArray(raw.trail) ||
    raw.trail.length === 0 ||
    raw.trail.length > MAX_TRAIL ||
    !raw.trail.every((key) => isRouteKey(key) || isSectionKey(key))
  ) {
    return { ok: false, error: "invalid trail" };
  }

  const sections = uniqueList(raw.sections, isSectionKey, 20);
  if (!sections) return { ok: false, error: "invalid sections" };
  const events = uniqueList(raw.events, isEventKey, 20);
  if (!events) return { ok: false, error: "invalid events" };

  if (!isIntInRange(raw.pageviews, 1, MAX_PAGEVIEWS)) {
    return { ok: false, error: "invalid pageviews" };
  }
  if (!isIntInRange(raw.engagedMs, 0, MAX_ENGAGED_MS)) {
    return { ok: false, error: "invalid engagedMs" };
  }
  if (typeof raw.touch !== "boolean") return { ok: false, error: "invalid touch" };
  if (typeof raw.resumed !== "boolean") return { ok: false, error: "invalid resumed" };

  return {
    ok: true,
    payload: {
      v: 1,
      id: raw.id,
      landing: raw.landing,
      locale: raw.locale,
      referrer: raw.referrer as string | null,
      utm,
      trail: raw.trail as TrailKey[],
      pageviews: raw.pageviews,
      sections,
      events,
      engagedMs: raw.engagedMs,
      touch: raw.touch,
      resumed: raw.resumed,
    },
  };
}
