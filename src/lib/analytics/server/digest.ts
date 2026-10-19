import { EVENTS, ROUTES, SECTIONS, trailLabel, type TrailKey } from "../catalog";
import { CHANNEL_LABELS, type Channel } from "./acquisition";
import { countryName } from "./format";
import { hashToCounts, type Redis } from "./redis";
import { KEYS } from "./collect";
import { formatDuration, formatWeekRange } from "./time";

/**
 * Weekly Digest:
 * Turns one week of aggregate counters (plus the previous week, for comparison)
 * into a few Telegram messages. Every figure and insight is computed from the
 * counters; when the data is too thin, the digest says so instead of guessing.
 */

export const DIMENSIONS = [
  "totals",
  "country",
  "country_engaged",
  "device",
  "browser",
  "os",
  "channel",
  "channel_engaged",
  "landing",
  "locale",
  "referrer",
  "campaign",
  "page",
  "section",
  "event",
  "precontact",
  "conversion_path",
] as const;
export type Dimension = (typeof DIMENSIONS)[number];
export type WeekStats = Record<Dimension, Record<string, number>>;

/** Week-over-week changes are only shown when the previous week had at least this many sessions. */
export const MIN_COMPARABLE_SESSIONS = 10;
/** Below this, patterns are not reported as insights. */
export const MIN_INSIGHT_SESSIONS = 10;
export const MESSAGE_BUDGET = 3800;

export async function loadWeekStats(redis: Redis, week: string): Promise<WeekStats> {
  const results = await redis.pipeline(
    DIMENSIONS.map((dimension) => ["HGETALL", KEYS.week(week, dimension)]),
  );
  return Object.fromEntries(
    DIMENSIONS.map((dimension, i) => [dimension, hashToCounts(results[i])]),
  ) as WeekStats;
}

type Entry = [string, number];

function top(counts: Record<string, number>, limit: number): Entry[] {
  return Object.entries(counts)
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit);
}

const pct = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 100) : 0);

function change(current: number, previous: number | undefined): string {
  if (previous === undefined) return "";
  if (previous === 0) return current > 0 ? " (new)" : "";
  const delta = Math.round(((current - previous) / previous) * 100);
  return ` (${delta > 0 ? "+" : delta < 0 ? "−" : "±"}${Math.abs(delta)}%)`;
}

function delta(current: number, previous: number | undefined): string {
  if (previous === undefined) return "";
  const diff = current - previous;
  return diff === 0 ? " ·=" : diff > 0 ? ` ▲${diff}` : ` ▼${Math.abs(diff)}`;
}

const DEVICE_LABELS: Record<string, string> = { mobile: "Mobile", tablet: "Tablet", desktop: "Desktop" };

function pathLabel(path: string): string {
  if (path === "(direct)") return "Straight to it";
  return path
    .split(">")
    .map((step) => (step in ROUTES || step in SECTIONS ? trailLabel(step as TrailKey) : step))
    .join(" → ");
}

const label = {
  route: (key: string) => ROUTES[key as keyof typeof ROUTES] ?? key,
  section: (key: string) => SECTIONS[key as keyof typeof SECTIONS] ?? key,
  event: (key: string) => EVENTS[key as keyof typeof EVENTS] ?? key,
  channel: (key: string) => CHANNEL_LABELS[key as Channel] ?? key,
  country: (key: string) => (key === "unknown" ? "Unknown" : countryName(key)),
};

function shareLine(counts: Record<string, number>, total: number, name: (key: string) => string, limit = 4) {
  return top(counts, limit)
    .map(([key, value]) => `${name(key)} ${pct(value, total)}%`)
    .join(" · ");
}

export interface DigestInput {
  week: string;
  comparisonWeek: string;
  current: WeekStats;
  previous: WeekStats | null;
  timeZone: string;
}

export function buildInsights(input: DigestInput): string[] {
  const { current } = input;
  const sessions = current.totals.sessions ?? 0;
  const comparable = (input.previous?.totals.sessions ?? 0) >= MIN_COMPARABLE_SESSIONS;
  const previous = comparable ? input.previous : null;
  const insights: string[] = [];

  const submits = current.event.contact_submit ?? 0;
  if (submits > 0) insights.push(`Contact form submitted ${submits}×.`);

  if (sessions < MIN_INSIGHT_SESSIONS) {
    insights.unshift(
      `Only ${sessions} session${sessions === 1 ? "" : "s"} this week — too few to draw reliable patterns.`,
    );
    return insights;
  }

  const [topChannel] = top(current.channel, 1);
  if (topChannel) {
    insights.push(
      `${label.channel(topChannel[0])} brought the most sessions (${pct(topChannel[1], sessions)}%).`,
    );
  }

  const reached = current.totals.contact_reached ?? 0;
  if (reached > 0) {
    const [route] = top(current.precontact, 1);
    insights.push(
      `${reached} session${reached === 1 ? "" : "s"} reached Contact` +
        (route && route[1] >= 2 ? `; most often via ${pathLabel(route[0])} (${route[1]}).` : "."),
    );
  }

  const engagedCountries = Object.entries(current.country)
    .filter(([code, count]) => code !== "unknown" && count >= 5)
    .map(([code, count]) => ({ code, count, rate: (current.country_engaged[code] ?? 0) / count }))
    .sort((a, b) => b.rate - a.rate || b.count - a.count);
  if (engagedCountries.length >= 2 && engagedCountries[0].rate > engagedCountries[1].rate) {
    const best = engagedCountries[0];
    insights.push(
      `Visitors from ${label.country(best.code)} were the most engaged: ${current.country_engaged[best.code] ?? 0} of ${best.count} sessions.`,
    );
  }

  if (previous) {
    const landingShift = Array.from(
      new Set([...Object.keys(current.landing), ...Object.keys(previous.landing)]),
    )
      .map((key) => ({ key, now: current.landing[key] ?? 0, before: previous.landing[key] ?? 0 }))
      .sort((a, b) => Math.abs(b.now - b.before) - Math.abs(a.now - a.before))[0];
    if (landingShift && Math.abs(landingShift.now - landingShift.before) >= 3) {
      insights.push(
        `Landings on ${label.route(landingShift.key)} ${landingShift.now > landingShift.before ? "rose" : "fell"} from ${landingShift.before} to ${landingShift.now}.`,
      );
    }
    const conversions = current.totals.conversion_sessions ?? 0;
    const before = previous.totals.conversion_sessions ?? 0;
    if (conversions !== before) {
      insights.push(`Sessions with a contact step: ${conversions} (previous week ${before}).`);
    }
  }

  const [topSection] = top(current.section, 1);
  if (topSection) {
    insights.push(
      `${label.section(topSection[0])} was the most-viewed section (${topSection[1]} sessions, ${pct(topSection[1], sessions)}%).`,
    );
  }

  return insights.slice(0, 5);
}

export function buildDigest(input: DigestInput): string[] {
  const { current } = input;
  const totals = current.totals;
  const sessions = totals.sessions ?? 0;
  const header = `📊 Weekly digest · ${formatWeekRange(input.week)}`;

  if (sessions === 0) {
    return [
      [
        header,
        "",
        "No sessions were recorded this week.",
        "Only visitors who accept analytics cookies are counted. If this is unexpected, check the tracker and Redis configuration.",
      ].join("\n"),
    ];
  }

  const previousSessions = input.previous?.totals.sessions ?? 0;
  const comparable = previousSessions >= MIN_COMPARABLE_SESSIONS;
  const prev = comparable ? input.previous : null;
  const p = (dimension: Dimension, key: string) => (prev ? (prev[dimension][key] ?? 0) : undefined);

  const engaged = totals.engaged ?? 0;
  const conversionSessions = totals.conversion_sessions ?? 0;
  const blocks: string[] = [];

  blocks.push(
    [
      header,
      `Mon–Sun, ${input.timeZone} · ` +
        (comparable
          ? `vs ${formatWeekRange(input.comparisonWeek)}`
          : `no comparison (previous week: ${previousSessions} sessions)`),
      "",
      "OVERVIEW",
      `• Sessions: ${sessions}${change(sessions, p("totals", "sessions"))}`,
      `• Engaged sessions: ${engaged} · ${pct(engaged, sessions)}%${change(engaged, p("totals", "engaged"))}`,
      `• Page views: ${totals.pageviews ?? 0}${change(totals.pageviews ?? 0, p("totals", "pageviews"))}`,
      `• Avg. active time: ${formatDuration((totals.engaged_ms ?? 0) / sessions)} per session`,
      `• Sessions with a contact step: ${conversionSessions}${delta(conversionSessions, p("totals", "conversion_sessions"))}`,
      `• Reached contact section: ${totals.contact_reached ?? 0}`,
      `• Site language: ${shareLine(current.locale, sessions, (key) => key.toUpperCase())}`,
      "• Unique visitors: not measured (no persistent identifiers, by design)",
    ].join("\n"),
  );

  blocks.push(
    [
      "🌍 GEOGRAPHY",
      ...top(current.country, 5).map(
        ([code, count], i) =>
          `${i + 1}. ${label.country(code)} — ${count} (${pct(count, sessions)}%) · ${current.country_engaged[code] ?? 0} engaged${delta(count, p("country", code))}`,
      ),
    ].join("\n"),
  );

  blocks.push(
    [
      "📱 DEVICES",
      `• ${shareLine(current.device, sessions, (key) => DEVICE_LABELS[key] ?? key, 3)}`,
      `• Browsers: ${shareLine(current.browser, sessions, (key) => key)}`,
      `• OS: ${shareLine(current.os, sessions, (key) => key)}`,
    ].join("\n"),
  );

  const acquisition = [
    "🔎 ACQUISITION",
    ...top(current.channel, 7).map(
      ([channel, count]) =>
        `• ${label.channel(channel)}: ${count} (${pct(count, sessions)}%) · ${current.channel_engaged[channel] ?? 0} engaged${delta(count, p("channel", channel))}`,
    ),
  ];
  const referrers = top(current.referrer, 5);
  if (referrers.length > 0) {
    acquisition.push(`Referring domains: ${referrers.map(([d, c]) => `${d} ${c}`).join(" · ")}`);
  }
  const campaigns = top(current.campaign, 5);
  if (campaigns.length > 0) {
    acquisition.push(`Campaigns: ${campaigns.map(([name, c]) => `${name} (${c})`).join(" · ")}`);
  }
  blocks.push(acquisition.join("\n"));

  const content = [
    "👀 CONTENT",
    `• Page views: ${top(current.page, 5).map(([key, c]) => `${label.route(key)} ${c}`).join(" · ")}`,
    `• Landing pages: ${top(current.landing, 5)
      .map(([key, c]) => `${label.route(key)} ${c}${delta(c, p("landing", key))}`)
      .join(" · ")}`,
  ];
  const sections = top(current.section, 6);
  if (sections.length > 0) {
    content.push(
      `• Sections (sessions): ${sections.map(([key, c]) => `${label.section(key)} ${c}`).join(" · ")}`,
    );
  }
  const preContact = top(current.precontact, 3);
  if (preContact.length > 0) {
    content.push("• Before reaching Contact:");
    content.push(...preContact.map(([path, c]) => `   ${pathLabel(path)} (${c})`));
  }
  const conversionPaths = top(current.conversion_path, 3);
  if (conversionPaths.length > 0) {
    content.push("• Paths to a form submission:");
    content.push(...conversionPaths.map(([path, c]) => `   ${pathLabel(path)} (${c})`));
  }
  const events = top(current.event, 8);
  content.push(
    events.length > 0
      ? `• Actions: ${events.map(([key, c]) => `${label.event(key)} ${c}${delta(c, p("event", key))}`).join(" · ")}`
      : "• Actions: none recorded",
  );
  blocks.push(content.join("\n"));

  const insights = buildInsights(input);
  blocks.push(
    ["💡 KEY INSIGHTS", ...(insights.length > 0 ? insights.map((i) => `• ${i}`) : ["• Nothing notable."])].join(
      "\n",
    ),
  );

  return packMessages(blocks, MESSAGE_BUDGET);
}

/** Packs blocks into as few messages as fit Telegram's limit, never splitting a block. */
export function packMessages(blocks: string[], budget: number): string[] {
  const messages: string[] = [];
  let current = "";
  for (const block of blocks) {
    const next = current ? `${current}\n\n${block}` : block;
    if (next.length <= budget) {
      current = next;
    } else {
      if (current) messages.push(current);
      current = block.length <= budget ? block : `${block.slice(0, budget - 1)}…`;
    }
  }
  if (current) messages.push(current);
  return messages;
}
