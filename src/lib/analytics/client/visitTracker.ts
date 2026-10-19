import {
  CONVERSION_EVENTS,
  resolveRoute,
  type EventKey,
  type SectionKey,
  type TrailKey,
} from "../catalog";
import { MAX_ENGAGED_MS, MAX_PAGEVIEWS, MAX_TRAIL, UTM_PATTERN, type Utm, type VisitPayload } from "../payload";

/**
 * Visit Tracker Core:
 * Framework-free session state machine. The React layer feeds it route changes,
 * section views, clicks and visibility changes; it decides what is new, keeps the
 * session in sessionStorage and emits one cumulative beacon whenever the tab is
 * hidden (or a conversion happens). No cookies, no persistent identifiers.
 */

/** A session ends after 30 minutes without activity, like most analytics tools. */
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
export const STORAGE_KEY = "fa-visit";

interface StoredState {
  payload: VisitPayload;
  lastActivityAt: number;
  lastPath: string | null;
  sentVersion: number;
  version: number;
}

export interface TrackerDeps {
  storage: Pick<Storage, "getItem" | "setItem">;
  now: () => number;
  randomId: () => string;
  send: (payload: VisitPayload) => void;
  /** Mirrors recorded events to the existing GA4 tag, when present. */
  onRecord?: (kind: "section" | "event", key: string) => void;
}

export interface StartContext {
  pathname: string;
  search: string;
  referrer: string;
  host: string;
  touch: boolean;
}

export function referrerHost(referrer: string, currentHost: string): string | null {
  if (!referrer) return null;
  try {
    const url = new URL(referrer);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    const host = url.hostname.toLowerCase();
    const strip = (value: string) => value.replace(/^www\./, "");
    return strip(host) === strip(currentHost.split(":")[0].toLowerCase()) ? null : host;
  } catch {
    return null;
  }
}

export function parseUtm(search: string): Utm | null {
  const params = new URLSearchParams(search);
  const utm: Utm = {};
  for (const key of ["source", "medium", "campaign"] as const) {
    const value = params
      .get(`utm_${key}`)
      ?.trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9._+-]/g, "")
      .slice(0, 64);
    if (value && UTM_PATTERN.test(value)) utm[key] = value;
  }
  return Object.keys(utm).length > 0 ? utm : null;
}

export class VisitTracker {
  private state: StoredState | null = null;
  private visibleSince: number | null = null;

  constructor(
    private readonly deps: TrackerDeps,
    private readonly context: StartContext,
  ) {}

  /** Resumes the tab's session or starts a new one. */
  start(visible: boolean): void {
    const now = this.deps.now();
    const stored = this.read();
    this.state =
      stored && now - stored.lastActivityAt < SESSION_TIMEOUT_MS
        ? stored
        : this.createState(this.context.pathname, now, true);
    this.visibleSince = visible ? now : null;
    this.persist();
  }

  get payload(): VisitPayload | null {
    return this.state?.payload ?? null;
  }

  /** Records a route view. Repeated calls for the same path (re-renders, Strict Mode) are ignored. */
  pageView(pathname: string): boolean {
    const state = this.ensureState();
    if (state.lastPath === pathname) return false;

    const isLanding = state.lastPath === null;
    state.lastPath = pathname;
    // The landing view is already counted when the session is created.
    if (!isLanding) {
      state.payload.pageviews = Math.min(state.payload.pageviews + 1, MAX_PAGEVIEWS);
      this.appendTrail(resolveRoute(pathname).route);
    }
    this.touch();
    return true;
  }

  /** Records a section once per session. */
  sectionView(section: SectionKey): boolean {
    const state = this.ensureState();
    if (state.payload.sections.includes(section)) return false;
    state.payload.sections.push(section);
    this.appendTrail(section);
    this.touch();
    this.deps.onRecord?.("section", section);
    return true;
  }

  /** Records an interaction once per session. Conversions are flushed immediately. */
  event(event: EventKey): boolean {
    const state = this.ensureState();
    if (state.payload.events.includes(event)) return false;
    state.payload.events.push(event);
    this.touch();
    this.deps.onRecord?.("event", event);
    if (CONVERSION_EVENTS.includes(event)) this.flush();
    return true;
  }

  setVisible(visible: boolean): void {
    const now = this.deps.now();
    if (visible) {
      if (this.visibleSince !== null) return;
      // Returning to a tab after the timeout is a new session with unknown origin.
      if (this.state && now - this.state.lastActivityAt >= SESSION_TIMEOUT_MS) {
        const lastPath = this.state.lastPath ?? this.context.pathname;
        this.state = this.createState(lastPath, now, false);
        this.state.lastPath = lastPath;
        this.persist();
      }
      this.visibleSince = now;
      return;
    }
    this.commitEngagement(now);
    this.visibleSince = null;
    this.flush();
  }

  /** Sends the cumulative state if anything changed since the last beacon. */
  flush(): void {
    const state = this.state;
    if (!state) return;
    if (this.visibleSince !== null) {
      const now = this.deps.now();
      this.commitEngagement(now);
      this.visibleSince = now;
    }
    if (state.version === state.sentVersion) return;
    state.sentVersion = state.version;
    this.persist();
    this.deps.send(structuredCloneSafe(state.payload));
  }

  private commitEngagement(now: number): void {
    if (!this.state || this.visibleSince === null) return;
    const delta = Math.max(0, Math.min(now - this.visibleSince, SESSION_TIMEOUT_MS));
    if (delta < 1000) return;
    this.state.payload.engagedMs = Math.min(
      this.state.payload.engagedMs + Math.round(delta),
      MAX_ENGAGED_MS,
    );
    this.touch(now);
  }

  private createState(pathname: string, now: number, fromNavigation: boolean): StoredState {
    const { route, locale } = resolveRoute(pathname);
    return {
      payload: {
        v: 1,
        id: this.deps.randomId(),
        landing: route,
        locale,
        referrer: fromNavigation ? referrerHost(this.context.referrer, this.context.host) : null,
        utm: fromNavigation ? parseUtm(this.context.search) : null,
        trail: [route],
        pageviews: 1,
        sections: [],
        events: [],
        engagedMs: 0,
        touch: this.context.touch,
        resumed: !fromNavigation,
      },
      lastActivityAt: now,
      lastPath: null,
      sentVersion: 0,
      version: 1,
    };
  }

  private appendTrail(key: TrailKey): void {
    const trail = this.ensureState().payload.trail;
    if (trail[trail.length - 1] === key || trail.length >= MAX_TRAIL) return;
    trail.push(key);
  }

  private touch(now = this.deps.now()): void {
    const state = this.ensureState();
    state.version += 1;
    state.lastActivityAt = now;
    this.persist();
  }

  private ensureState(): StoredState {
    if (!this.state) this.start(true);
    return this.state as StoredState;
  }

  private read(): StoredState | null {
    try {
      const raw = this.deps.storage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as StoredState;
      return parsed?.payload?.v === 1 ? parsed : null;
    } catch {
      return null;
    }
  }

  private persist(): void {
    try {
      if (this.state) this.deps.storage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Storage may be full or blocked; tracking degrades to the in-memory state.
    }
  }
}

function structuredCloneSafe<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
