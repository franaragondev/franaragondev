import { describe, expect, it } from "vitest";
import {
  formatDuration,
  formatWeekRange,
  isCompleteWeek,
  isValidWeekKey,
  previousCompleteWeek,
  reportingTimezone,
  weekKeyFor,
} from "./time";

const TZ = "Europe/Prague";

describe("weekly reporting boundaries", () => {
  it("assigns Sunday late evening (local) to the ending week", () => {
    // Sunday 18 Oct 2026, 23:30 CEST = 21:30 UTC
    expect(weekKeyFor(new Date("2026-10-18T21:30:00Z"), TZ)).toBe("2026-10-12");
  });

  it("assigns Monday just after midnight (local) to the new week, even while UTC is still Sunday", () => {
    // Monday 19 Oct 2026, 00:30 CEST = Sunday 22:30 UTC
    expect(weekKeyFor(new Date("2026-10-18T22:30:00Z"), TZ)).toBe("2026-10-19");
  });

  it("handles the DST change inside a week", () => {
    // DST ends Sunday 25 Oct 2026; 23:59 CET that day = 22:59 UTC.
    expect(weekKeyFor(new Date("2026-10-25T22:59:00Z"), TZ)).toBe("2026-10-19");
    expect(weekKeyFor(new Date("2026-10-25T23:00:00Z"), TZ)).toBe("2026-10-26");
  });

  it("reports the previous complete week when the cron fires on Monday morning", () => {
    // Cron: Monday 06:00 UTC = 08:00 CEST
    expect(previousCompleteWeek(new Date("2026-10-19T06:00:00Z"), TZ)).toEqual({
      week: "2026-10-12",
      comparison: "2026-10-05",
    });
  });

  it("never reports the current, partial week", () => {
    const now = new Date("2026-10-21T10:00:00Z");
    expect(isCompleteWeek("2026-10-19", now, TZ)).toBe(false);
    expect(isCompleteWeek("2026-10-12", now, TZ)).toBe(true);
  });

  it("validates week keys", () => {
    expect(isValidWeekKey("2026-10-12")).toBe(true);
    expect(isValidWeekKey("2026-10-13")).toBe(false); // Tuesday
    expect(isValidWeekKey("2026-02-30")).toBe(false);
    expect(isValidWeekKey("../../x")).toBe(false);
  });

  it("uses a valid configured timezone and falls back otherwise", () => {
    expect(reportingTimezone({} as unknown as NodeJS.ProcessEnv)).toBe(TZ);
    expect(reportingTimezone({ ANALYTICS_TIMEZONE: "UTC" } as unknown as NodeJS.ProcessEnv)).toBe("UTC");
    expect(reportingTimezone({ ANALYTICS_TIMEZONE: "Mars/Base" } as unknown as NodeJS.ProcessEnv)).toBe(TZ);
  });
});

describe("formatting", () => {
  it("formats week ranges and durations", () => {
    expect(formatWeekRange("2026-10-12")).toBe("12–18 Oct 2026");
    expect(formatWeekRange("2026-09-28")).toMatch(/^28 Sept? – 4 Oct 2026$/);
    expect(formatDuration(8_000)).toBe("8s");
    expect(formatDuration(138_000)).toBe("2m 18s");
    expect(formatDuration(3_900_000)).toBe("1h 5m");
  });
});
