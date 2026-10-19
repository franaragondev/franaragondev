import type { EventKey } from "../catalog";
import type { VisitPayload } from "../payload";
import { VisitTracker } from "./visitTracker";

/**
 * Browser Tracker Singleton:
 * Only created by <AnalyticsTracker /> after analytics consent has been granted.
 * Until then every call here is a no-op, so components can report events without
 * knowing about consent.
 */

export const COLLECT_ENDPOINT = "/api/analytics/visit";
export const CONSENT_KEY = "cookie-consent";

let tracker: VisitTracker | null = null;

type Gtag = (command: "event", name: string, params?: Record<string, string>) => void;

export function hasAnalyticsConsent(): boolean {
  try {
    return window.localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

function sendBeacon(payload: VisitPayload): void {
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon?.(COLLECT_ENDPOINT, new Blob([body], { type: "application/json" }))) {
      return;
    }
  } catch {
    // Fall through to fetch.
  }
  fetch(COLLECT_ENDPOINT, {
    method: "POST",
    body,
    keepalive: true,
    headers: { "Content-Type": "application/json" },
  }).catch(() => {
    // Analytics must never surface errors to the visitor.
  });
}

function randomId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID().replace(/-/g, "");
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function initTracker(): VisitTracker | null {
  if (tracker) return tracker;
  if (!hasAnalyticsConsent() || navigator.webdriver) return null;

  tracker = new VisitTracker(
    {
      storage: window.sessionStorage,
      now: () => Date.now(),
      randomId,
      send: sendBeacon,
      onRecord: (kind, key) => {
        const gtag = (window as unknown as { gtag?: Gtag }).gtag;
        if (kind === "section") gtag?.("event", "section_view", { section: key });
        else gtag?.("event", key);
      },
    },
    {
      pathname: window.location.pathname,
      search: window.location.search,
      referrer: document.referrer,
      host: window.location.host,
      touch: navigator.maxTouchPoints > 1,
    },
  );
  tracker.start(document.visibilityState === "visible");
  return tracker;
}

export function getTracker(): VisitTracker | null {
  return tracker;
}

/** Reports an interaction. Safe to call anywhere; ignored without consent. */
export function trackEvent(event: EventKey): void {
  tracker?.event(event);
}
