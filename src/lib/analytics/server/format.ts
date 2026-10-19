import {
  CONVERSION_EVENTS,
  EVENTS,
  ROUTES,
  trailLabel,
  type EventKey,
  type TrailKey,
} from "../catalog";
import type { StoredVisit } from "./sessionize";
import { formatDuration, formatTimestamp } from "./time";

/**
 * Visit Notification Formatting:
 * Builds the Telegram text from stored, already-sanitised session data only.
 * Every line is omitted or marked unknown when its data was not observed.
 */

const DEVICE_LABELS = { mobile: "Mobile", tablet: "Tablet", desktop: "Desktop" } as const;
const MAX_TRAIL_STEPS = 8;

export function countryName(code: string | null): string {
  if (!code) return "Unknown";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

export function formatTrail(trail: TrailKey[]): string {
  const steps = trail.length > MAX_TRAIL_STEPS ? trail.slice(-MAX_TRAIL_STEPS) : trail;
  const text = steps.map(trailLabel).join(" → ");
  return trail.length > MAX_TRAIL_STEPS ? `… → ${text}` : text;
}

function eventList(events: EventKey[]): string {
  return events.map((event) => EVENTS[event]).join(" · ");
}

/** One-line, rule-based reading of the session. Only describes recorded behaviour. */
export function describeInterest(visit: StoredVisit): string | null {
  const notes: string[] = [];
  const conversions = visit.events.filter((event) => CONVERSION_EVENTS.includes(event));
  const caseStudySections = visit.sections.filter((section) => section.startsWith("baguira-"));
  const portfolioSteps = visit.trail.filter(
    (step) => step === "projects" || step === "partnerships" || step === "baguira",
  );

  if (visit.events.includes("contact_submit")) notes.push("Submitted the contact form.");
  else if (conversions.length > 0) notes.push(`Took a contact step (${eventList(conversions)}).`);

  if (visit.sections.includes("contact") && !visit.events.includes("contact_submit")) {
    notes.push(
      portfolioSteps.length > 0
        ? "Reached the contact section after viewing the portfolio."
        : "Reached the contact section.",
    );
  }

  if (visit.landing === "baguira") notes.push("Landed directly on the Baguira case study.");
  else if (caseStudySections.length >= 3) {
    notes.push(`Read the Baguira case study in depth (${caseStudySections.length} sections).`);
  }

  const projects = visit.events.filter((event) => event.startsWith("project_"));
  if (projects.length > 0) notes.push(`${eventList(projects)}.`);

  const homeSections = visit.sections.length - caseStudySections.length;
  if (notes.length === 0 && homeSections >= 4) {
    notes.push(`Scrolled through most of the home page (${homeSections} sections).`);
  }

  return notes.length > 0 ? notes.slice(0, 2).join(" ") : null;
}

export function formatVisitMessage(visit: StoredVisit, timeZone: string): string {
  const location = visit.country
    ? `${countryName(visit.country)}${visit.region ? ` · region ${visit.region}` : ""}`
    : "Unknown";
  const engagement = [
    `${formatDuration(visit.engagedMs)} active`,
    `${visit.pageviews} page view${visit.pageviews === 1 ? "" : "s"}`,
    visit.sections.length > 0 ? `${visit.sections.length} sections` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const lines = [
    "🌐 New website visit",
    "",
    `🕒 ${formatTimestamp(new Date(visit.firstSeenAt), timeZone)}`,
    `📍 Location: ${location}`,
    `📱 Device: ${DEVICE_LABELS[visit.device]} · ${visit.os} / ${visit.browser}`,
    `🔎 Source: ${visit.source}`,
    `🔗 Landing: ${ROUTES[visit.landing]} (${visit.locale.toUpperCase()})`,
    `👀 Viewed: ${formatTrail(visit.trail)}`,
  ];
  if (visit.events.length > 0) lines.push(`🎯 Actions: ${eventList(visit.events)}`);
  lines.push(`⏱️ Engagement: ${engagement}`);

  const interest = describeInterest(visit);
  if (interest) lines.push("", `⭐ Interest: ${interest}`);

  return lines.join("\n");
}

export function formatFollowUpMessage(
  visit: StoredVisit,
  events: EventKey[],
  timeZone: string,
): string {
  return [
    `🎯 Same visit (${formatTimestamp(new Date(visit.firstSeenAt), timeZone)}) · ${countryName(visit.country)}`,
    `New: ${eventList(events)}`,
    `👀 Path so far: ${formatTrail(visit.trail)}`,
  ].join("\n");
}
