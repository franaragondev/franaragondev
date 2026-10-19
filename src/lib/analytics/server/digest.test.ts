import { describe, expect, it } from "vitest";
import { buildDigest, buildInsights, DIMENSIONS, packMessages, type WeekStats } from "./digest";

function stats(partial: Partial<Record<(typeof DIMENSIONS)[number], Record<string, number>>>): WeekStats {
  return Object.fromEntries(DIMENSIONS.map((d) => [d, partial[d] ?? {}])) as WeekStats;
}

const busyWeek = stats({
  totals: {
    sessions: 40,
    engaged: 24,
    pageviews: 52,
    engaged_ms: 2_400_000,
    conversion_sessions: 3,
    contact_reached: 9,
  },
  country: { CZ: 15, DE: 10, ES: 8, unknown: 7 },
  country_engaged: { CZ: 6, DE: 9, ES: 4 },
  device: { mobile: 22, desktop: 16, tablet: 2 },
  browser: { Chrome: 20, Safari: 15, Firefox: 5 },
  os: { iOS: 14, Windows: 12, Android: 8, macOS: 6 },
  channel: { organic: 14, direct: 16, social: 7, referral: 3 },
  channel_engaged: { organic: 10, direct: 8, social: 5, referral: 1 },
  referrer: { "google.com": 13, "linkedin.com": 7, "github.com": 3 },
  landing: { home: 34, baguira: 6 },
  locale: { en: 28, es: 9, fr: 3 },
  page: { home: 40, baguira: 12 },
  section: { projects: 25, expertise: 22, contact: 9 },
  event: { linkedin_click: 2, contact_submit: 1, cv_open: 4 },
  precontact: { "projects>experience": 4, "(direct)": 2 },
  conversion_path: { "projects>contact": 1 },
});

const quietWeek = stats({
  totals: { sessions: 20, engaged: 10, pageviews: 30, conversion_sessions: 1 },
  country: { CZ: 10, DE: 10 },
  channel: { direct: 20 },
  landing: { home: 20, baguira: 1 },
});

const input = (current: WeekStats, previous: WeekStats | null) => ({
  week: "2026-10-12",
  comparisonWeek: "2026-10-05",
  current,
  previous,
  timeZone: "Europe/Prague",
});

describe("weekly digest", () => {
  it("says so when there is no data, instead of inventing a report", () => {
    const [message, ...rest] = buildDigest(input(stats({}), null));
    expect(rest).toHaveLength(0);
    expect(message).toContain("No sessions were recorded this week.");
  });

  it("renders every section with week-over-week changes when comparable", () => {
    const text = buildDigest(input(busyWeek, quietWeek)).join("\n");
    expect(text).toContain("📊 Weekly digest · 12–18 Oct 2026");
    expect(text).toContain("vs 5–11 Oct 2026");
    expect(text).toContain("• Sessions: 40 (+100%)");
    expect(text).toContain("• Engaged sessions: 24 · 60% (+140%)");
    expect(text).toContain("• Avg. active time: 1m 00s per session");
    expect(text).toContain("1. Czechia — 15 (38%) · 6 engaged ▲5");
    expect(text).toContain("• Organic search: 14 (35%) · 10 engaged ▲14");
    expect(text).toContain("Referring domains: google.com 13 · linkedin.com 7 · github.com 3");
    expect(text).toContain("   Selected projects → Experience (4)");
    expect(text).toContain("• Unique visitors: not measured");
    expect(text).toContain("💡 KEY INSIGHTS");
  });

  it("omits comparisons when the previous week is too thin", () => {
    const text = buildDigest(input(busyWeek, stats({ totals: { sessions: 3 } }))).join("\n");
    expect(text).toContain("no comparison (previous week: 3 sessions)");
    expect(text).toContain("• Sessions: 40\n");
    expect(text).not.toMatch(/[▲▼]/);
  });

  it("only produces data-grounded insights", () => {
    const insights = buildInsights(input(busyWeek, quietWeek));
    expect(insights).toContain("Contact form submitted 1×.");
    expect(insights).toContain("Direct / no referrer brought the most sessions (40%).");
    expect(insights).toContain("Visitors from Germany were the most engaged: 9 of 10 sessions.");
    expect(insights).toContain("Landings on Home rose from 20 to 34.");
    expect(insights.length).toBeLessThanOrEqual(5);
  });

  it("declines to find patterns in very low volume", () => {
    const insights = buildInsights(input(stats({ totals: { sessions: 4 }, channel: { direct: 4 } }), null));
    expect(insights).toEqual(["Only 4 sessions this week — too few to draw reliable patterns."]);
  });

  it("packs blocks into messages within the budget without splitting blocks", () => {
    expect(packMessages(["a".repeat(30), "b".repeat(30), "c".repeat(30)], 70)).toEqual([
      `${"a".repeat(30)}\n\n${"b".repeat(30)}`,
      "c".repeat(30),
    ]);
    for (const message of buildDigest(input(busyWeek, quietWeek))) {
      expect(message.length).toBeLessThanOrEqual(3800);
    }
  });
});
