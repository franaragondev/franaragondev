import { afterEach, describe, expect, it, vi } from "vitest";
import { KEYS } from "./collect";
import { FakeRedis } from "./testing/fakeRedis";
import { isAuthorizedCronRequest, resolveReportWeek, runWeeklyReport } from "./weeklyReport";

const WEEK = "2026-10-12";

function seed(redis: FakeRedis, sessions = 12) {
  redis.hashes.set(KEYS.week(WEEK, "totals"), new Map([["sessions", sessions], ["engaged", 5]]));
  redis.hashes.set(KEYS.week(WEEK, "channel"), new Map([["direct", sessions]]));
}

function run(redis: FakeRedis, telegram: ReturnType<typeof vi.fn> | null, dryRun = false) {
  return runWeeklyReport({
    redis,
    telegram,
    week: WEEK,
    comparison: "2026-10-05",
    timeZone: "Europe/Prague",
    dryRun,
    now: () => new Date("2026-10-19T06:00:00Z"),
  });
}

describe("weekly report job", () => {
  it("sends the digest once and skips later runs", async () => {
    const redis = new FakeRedis();
    seed(redis);
    const telegram = vi.fn().mockResolvedValue(undefined);
    expect(await run(redis, telegram)).toMatchObject({ status: "sent" });
    expect(await run(redis, telegram)).toEqual({ status: "already_sent", week: WEEK });
    expect(telegram).toHaveBeenCalledTimes(1);
    expect(redis.strings.has(KEYS.digestLock(WEEK))).toBe(false);
  });

  it("refuses to run while another run holds the lock", async () => {
    const redis = new FakeRedis();
    seed(redis);
    redis.strings.set(KEYS.digestLock(WEEK), "1");
    const telegram = vi.fn();
    expect(await run(redis, telegram)).toEqual({ status: "in_progress", week: WEEK });
    expect(telegram).not.toHaveBeenCalled();
  });

  it("resumes after the last delivered message when retried", async () => {
    const redis = new FakeRedis();
    seed(redis);
    redis.strings.set(KEYS.digest(WEEK), JSON.stringify({ status: "partial", sentParts: 1 }));
    const telegram = vi.fn().mockResolvedValue(undefined);
    // The seeded week fits in one message, which was already delivered.
    expect(await run(redis, telegram)).toMatchObject({ status: "sent" });
    expect(telegram).not.toHaveBeenCalled();
  });

  it("reports failures, releases the lock and allows a retry", async () => {
    const redis = new FakeRedis();
    seed(redis);
    const failing = vi.fn().mockRejectedValue(new Error("Telegram returned 502"));
    expect(await run(redis, failing)).toMatchObject({ status: "failed", sentParts: 0 });
    expect(redis.strings.has(KEYS.digestLock(WEEK))).toBe(false);
    const working = vi.fn().mockResolvedValue(undefined);
    expect(await run(redis, working)).toMatchObject({ status: "sent" });
  });

  it("returns the messages on a dry run without sending or locking", async () => {
    const redis = new FakeRedis();
    seed(redis);
    const telegram = vi.fn();
    const result = await run(redis, telegram, true);
    expect(result.status).toBe("dry_run");
    expect(telegram).not.toHaveBeenCalled();
    expect(redis.strings.size).toBe(0);
  });

  it("fails clearly when Telegram is not configured", async () => {
    const redis = new FakeRedis();
    seed(redis);
    expect(await run(redis, null)).toMatchObject({ status: "failed", error: "Telegram is not configured" });
  });
});

describe("week selection", () => {
  const now = new Date("2026-10-21T10:00:00Z");
  it("defaults to the previous complete week", () => {
    expect(resolveReportWeek(null, now, "Europe/Prague")).toEqual({ week: WEEK, comparison: "2026-10-05" });
  });
  it("rejects the current week and malformed input", () => {
    expect(resolveReportWeek("2026-10-19", now, "Europe/Prague")).toHaveProperty("error");
    expect(resolveReportWeek("last-week", now, "Europe/Prague")).toHaveProperty("error");
  });
});

describe("cron authentication", () => {
  const request = (authorization?: string) =>
    new Request("https://franaragondev.com/api/cron/weekly-digest", {
      headers: authorization ? { authorization } : {},
    });

  it("accepts only the exact bearer secret", () => {
    expect(isAuthorizedCronRequest(request("Bearer s3cret"), "s3cret")).toBe(true);
    expect(isAuthorizedCronRequest(request("Bearer wrong!"), "s3cret")).toBe(false);
    expect(isAuthorizedCronRequest(request(), "s3cret")).toBe(false);
    expect(isAuthorizedCronRequest(request("Bearer "), undefined)).toBe(false);
  });
});

describe("cron route", () => {
  const original = { ...process.env };
  afterEach(() => {
    process.env = { ...original };
    vi.resetModules();
  });

  async function call(headers: Record<string, string> = {}) {
    const { GET } = await import("@/app/api/cron/weekly-digest/route");
    const { NextRequest } = await import("next/server");
    return GET(new NextRequest("https://franaragondev.com/api/cron/weekly-digest", { headers }));
  }

  it("is unavailable without CRON_SECRET", async () => {
    delete process.env.CRON_SECRET;
    expect((await call()).status).toBe(503);
  });

  it("rejects unauthenticated callers", async () => {
    process.env.CRON_SECRET = "s3cret";
    expect((await call()).status).toBe(401);
    expect((await call({ authorization: "Bearer nope" })).status).toBe(401);
  });

  it("reports missing Redis configuration to authenticated callers", async () => {
    process.env.CRON_SECRET = "s3cret";
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.KV_REST_API_URL;
    expect((await call({ authorization: "Bearer s3cret" })).status).toBe(503);
  });
});
