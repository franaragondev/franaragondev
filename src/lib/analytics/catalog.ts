/**
 * Analytics Catalog:
 * The single allowlist of everything the visit tracker may report. Shared by the
 * browser tracker (to decide what to record) and the server (to validate payloads).
 * Because every label that can reach Telegram comes from this file, a forged
 * payload can never inject arbitrary text into a notification.
 */

export const LOCALES = ["en", "es", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

/** Routes, keyed by their locale-independent path. */
export const ROUTES = {
  home: "Home",
  baguira: "Baguira case study",
  privacy: "Privacy policy",
  cookies: "Cookie policy",
  other: "Other page",
} as const;
export type RouteKey = keyof typeof ROUTES;

/**
 * Sections worth reporting. Home sections are matched by their existing `id`;
 * case-study sections by a `data-analytics-section` attribute. The hero is left
 * out on purpose: landing on Home already implies it was seen.
 */
export const SECTIONS = {
  expertise: "Expertise",
  about: "About",
  projects: "Selected projects",
  partnerships: "Partnerships",
  experience: "Experience",
  contact: "Contact",
  "baguira-overview": "Baguira · Overview",
  "baguira-challenge": "Baguira · Challenge",
  "baguira-architecture": "Baguira · Architecture",
  "baguira-results": "Baguira · Results",
  "baguira-philosophy": "Baguira · Philosophy",
} as const;
export type SectionKey = keyof typeof SECTIONS;

/** Interactions the site can observe reliably. */
export const EVENTS = {
  contact_submit: "Contact form submitted",
  cv_open: "CV opened",
  whatsapp_click: "WhatsApp click",
  linkedin_click: "LinkedIn click",
  github_click: "GitHub click",
  twitter_click: "X/Twitter click",
  instagram_click: "Instagram click",
  email_click: "Email link click",
  phone_click: "Phone link click",
  project_homestocker: "Opened HomeStocker",
  project_cdestepona: "Opened CD Estepona Platform",
  project_baguira: "Opened Baguira Suites site",
  outbound_other: "Other outbound link",
} as const;
export type EventKey = keyof typeof EVENTS;

/** Events that signal intent to get in touch or evaluate the profile. */
export const CONVERSION_EVENTS: readonly EventKey[] = [
  "contact_submit",
  "cv_open",
  "whatsapp_click",
  "linkedin_click",
  "email_click",
  "phone_click",
];

export type TrailKey = RouteKey | SectionKey;

const has = (object: object, key: string) =>
  Object.prototype.hasOwnProperty.call(object, key);

export function isRouteKey(value: unknown): value is RouteKey {
  return typeof value === "string" && has(ROUTES, value);
}

export function isSectionKey(value: unknown): value is SectionKey {
  return typeof value === "string" && has(SECTIONS, value);
}

export function isEventKey(value: unknown): value is EventKey {
  return typeof value === "string" && has(EVENTS, value);
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function trailLabel(key: TrailKey): string {
  return isRouteKey(key) ? ROUTES[key] : SECTIONS[key];
}

/**
 * Maps a pathname to its route and locale, following the "as-needed" prefix
 * policy (English has no prefix).
 */
export function resolveRoute(pathname: string): { route: RouteKey; locale: Locale } {
  const segments = pathname.split("/").filter(Boolean);
  let locale: Locale = "en";

  if (isLocale(segments[0])) {
    locale = segments[0];
    segments.shift();
  }

  const path = segments.join("/");
  const route: RouteKey =
    path === ""
      ? "home"
      : path === "partnerships/baguira-suites"
        ? "baguira"
        : path === "privacidad"
          ? "privacy"
          : path === "cookies"
            ? "cookies"
            : "other";

  return { route, locale };
}

const OUTBOUND_HOSTS: Array<[RegExp, EventKey]> = [
  [/(^|\.)wa\.me$|(^|\.)whatsapp\.com$/, "whatsapp_click"],
  [/(^|\.)linkedin\.com$/, "linkedin_click"],
  [/(^|\.)github\.com$/, "github_click"],
  [/(^|\.)(twitter|x)\.com$/, "twitter_click"],
  [/(^|\.)instagram\.com$/, "instagram_click"],
  [/(^|\.)homestocker\.app$/, "project_homestocker"],
  [/(^|\.)cdesteponafans\.com$/, "project_cdestepona"],
  [/(^|\.)baguirasuites\.fr$/, "project_baguira"],
];

/**
 * Classifies a clicked link. Returns null for internal navigation, which the
 * route and section tracking already covers.
 */
export function eventForLink(href: string, currentHost: string): EventKey | null {
  let url: URL;
  try {
    url = new URL(href, `https://${currentHost}`);
  } catch {
    return null;
  }

  if (url.protocol === "mailto:") return "email_click";
  if (url.protocol === "tel:") return "phone_click";
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  if (url.host === currentHost) {
    return url.pathname.endsWith(".pdf") && url.pathname.includes("cv") ? "cv_open" : null;
  }

  const host = url.hostname.toLowerCase();
  for (const [pattern, event] of OUTBOUND_HOSTS) {
    if (pattern.test(host)) return event;
  }
  return "outbound_other";
}
