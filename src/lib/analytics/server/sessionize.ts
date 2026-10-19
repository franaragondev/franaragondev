import { CONVERSION_EVENTS, isRouteKey, type EventKey, type TrailKey } from "../catalog";
import type { VisitPayload } from "../payload";
import { classifyAcquisition, type Channel } from "./acquisition";
import type { DeviceSummary } from "./userAgent";

/**
 * Server-side Sessionization:
 * The browser sends the cumulative state of its session on every beacon. This
 * module compares it with what the server already stored for that session and
 * emits only the deltas as weekly counter increments, so retries, duplicate
 * beacons and out-of-order delivery never double count.
 */

export const ENGAGED_MS = 10_000;
export const MAX_FOLLOW_UPS = 3;

export interface StoredVisit {
  id: string;
  week: string;
  firstSeenAt: number;
  country: string | null;
  region: string | null;
  device: DeviceSummary["device"];
  browser: string;
  os: string;
  channel: Channel;
  source: string;
  domain: string | null;
  campaign: string | null;
  landing: VisitPayload["landing"];
  locale: VisitPayload["locale"];
  trail: TrailKey[];
  pageviews: number;
  sections: VisitPayload["sections"];
  events: EventKey[];
  engagedMs: number;
  engaged: boolean;
  notifiedAt: number | null;
  reportedEvents: EventKey[];
  followUps: number;
}

export interface Increment {
  dimension: string;
  field: string;
  by: number;
}

export type Notification =
  | { kind: "visit" }
  | { kind: "follow-up"; events: EventKey[] }
  | null;

export interface MergeContext {
  now: number;
  week: string;
  country: string | null;
  region: string | null;
  device: DeviceSummary;
}

export function isEngaged(visit: Pick<StoredVisit, "engagedMs" | "pageviews" | "events">): boolean {
  return (
    visit.engagedMs >= ENGAGED_MS ||
    visit.pageviews >= 2 ||
    visit.events.some((event) => CONVERSION_EVENTS.includes(event))
  );
}

/** Steps before `index`, without the implicit leading Home, last `limit` steps. */
function pathBefore(trail: TrailKey[], index: number, limit: number): string {
  const steps = trail.slice(0, index).filter((step, i) => !(i === 0 && step === "home"));
  return steps.length === 0 ? "(direct)" : steps.slice(-limit).join(">");
}

export function mergeVisit(
  previous: StoredVisit | null,
  payload: VisitPayload,
  context: MergeContext,
): { visit: StoredVisit; increments: Increment[]; notification: Notification } {
  const increments: Increment[] = [];
  const add = (dimension: string, field: string, by = 1) => {
    if (by > 0) increments.push({ dimension, field, by });
  };

  let visit: StoredVisit;
  if (!previous) {
    const acquisition = classifyAcquisition({
      referrer: payload.referrer,
      utm: payload.utm,
      inApp: context.device.inApp,
      resumed: payload.resumed,
    });
    visit = {
      id: payload.id,
      week: context.week,
      firstSeenAt: context.now,
      country: context.country,
      region: context.region,
      device: context.device.device,
      browser: context.device.browser,
      os: context.device.os,
      channel: acquisition.channel,
      source: acquisition.label,
      domain: acquisition.domain,
      campaign: acquisition.campaign,
      landing: payload.landing,
      locale: payload.locale,
      trail: [],
      pageviews: 0,
      sections: [],
      events: [],
      engagedMs: 0,
      engaged: false,
      notifiedAt: null,
      reportedEvents: [],
      followUps: 0,
    };
    add("totals", "sessions");
    add("country", visit.country ?? "unknown");
    add("device", visit.device);
    add("browser", visit.browser);
    add("os", visit.os);
    add("channel", visit.channel);
    add("landing", visit.landing);
    add("locale", visit.locale);
    if (visit.domain) add("referrer", visit.domain);
    if (visit.campaign) add("campaign", visit.campaign);
  } else {
    visit = { ...previous };
  }

  // Trail: only an extension of what is already stored is trusted.
  const trailExtends =
    payload.trail.length >= visit.trail.length &&
    visit.trail.every((step, i) => payload.trail[i] === step);
  const newSteps = trailExtends ? payload.trail.slice(visit.trail.length) : [];
  if (trailExtends) visit.trail = [...payload.trail];
  for (const step of newSteps) if (isRouteKey(step)) add("page", step);

  const pageviews = Math.max(visit.pageviews, payload.pageviews);
  add("totals", "pageviews", pageviews - visit.pageviews);
  visit.pageviews = pageviews;

  const engagedMs = Math.max(visit.engagedMs, payload.engagedMs);
  add("totals", "engaged_ms", engagedMs - visit.engagedMs);
  visit.engagedMs = engagedMs;

  const hadContact = visit.sections.includes("contact");
  const newSections = payload.sections.filter((section) => !visit.sections.includes(section));
  visit.sections = [...visit.sections, ...newSections];
  for (const section of newSections) add("section", section);
  if (!hadContact && visit.sections.includes("contact")) {
    add("totals", "contact_reached");
    const index = visit.trail.indexOf("contact");
    add("precontact", pathBefore(visit.trail, index === -1 ? visit.trail.length : index, 3));
  }

  const hadConversion = visit.events.some((event) => CONVERSION_EVENTS.includes(event));
  const newEvents = payload.events.filter((event) => !visit.events.includes(event));
  visit.events = [...visit.events, ...newEvents];
  for (const event of newEvents) add("event", event);
  if (!hadConversion && visit.events.some((event) => CONVERSION_EVENTS.includes(event))) {
    add("totals", "conversion_sessions");
  }
  if (newEvents.includes("contact_submit")) {
    add("conversion_path", pathBefore(visit.trail, visit.trail.length, 4));
  }

  if (!visit.engaged && isEngaged(visit)) {
    visit.engaged = true;
    add("totals", "engaged");
    add("country_engaged", visit.country ?? "unknown");
    add("channel_engaged", visit.channel);
  }

  let notification: Notification = null;
  if (visit.engaged && visit.notifiedAt === null) {
    visit.notifiedAt = context.now;
    visit.reportedEvents = [...visit.events];
    notification = { kind: "visit" };
  } else if (visit.notifiedAt !== null) {
    const unreported = visit.events.filter(
      (event) => CONVERSION_EVENTS.includes(event) && !visit.reportedEvents.includes(event),
    );
    if (unreported.length > 0 && visit.followUps < MAX_FOLLOW_UPS) {
      visit.reportedEvents = [...visit.reportedEvents, ...unreported];
      visit.followUps += 1;
      notification = { kind: "follow-up", events: unreported };
    }
  }

  return { visit, increments, notification };
}
