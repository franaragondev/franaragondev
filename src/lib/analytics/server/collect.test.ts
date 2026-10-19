import { describe, expect, it, vi } from "vitest";
import { handleCollect, KEYS, RATE_LIMIT, type CollectDeps } from "./collect";
import { FakeRedis } from "./testing/fakeRedis";
import { IPHONE_SAFARI, GOOGLEBOT, validPayload } from "./testing/fixtures";

function setup(overrides: Partial<CollectDeps> = {}) {
  const redis = new FakeRedis();
  const telegram = vi.fn().mockResolvedValue(undefined);
  const tasks: Array<() => Promise<void>> = [];
  const log = vi.fn();
  const deps: CollectDeps = {
    redis,
    telegram,
    schedule: (task) => void tasks.push(task),
    now: () => new Date("2026-10-19T12:32:00Z"),
    timeZone: "Europe/Prague",
    hashSecret: "test-secret",
    log,
    ...overrides,
  };
  const runScheduled = async () => {
    while (tasks.length) await tasks.shift()?.();
  };
  return { redis, telegram, tasks, deps, log, runScheduled };
}

function beacon(body: unknown, headers: Record<string, string> = {}) {
  const text = typeof body === "string" ? body : JSON.stringify(body);
  return new Request("https://franaragondev.com/api/analytics/visit", {
    method: "POST",
    body: text,
    headers: {
      host: "franaragondev.com",
      origin: "https://franaragondev.com",
      "sec-fetch-site": "same-origin",
      "user-agent": IPHONE_SAFARI,
      "x-real-ip": "203.0.113.7",
      "x-vercel-ip-country": "DE",
      "x-vercel-ip-country-region": "BY",
      ...headers,
    },
  });
}

describe("visit collection", () => {
  it("records the session and sends one notification after the response", async () => {
    const { redis, telegram, deps, tasks, runScheduled } = setup();
    const response = await handleCollect(beacon(validPayload()), deps);
    expect(response.status).toBe(204);
    expect(telegram).not.toHaveBeenCalled(); // deferred until after the response
    expect(tasks).toHaveLength(1);
    await runScheduled();
    expect(telegram).toHaveBeenCalledTimes(1);
    expect(telegram.mock.calls[0][0]).toContain("📍 Location: Germany · region BY");
    expect(redis.hash(KEYS.week("2026-10-19", "totals"))).toMatchObject({ sessions: 1, engaged: 1 });
  });

  it("never stores the IP address or user agent", async () => {
    const { redis, deps } = setup();
    await handleCollect(beacon(validPayload()), deps);
    const everything = JSON.stringify([...redis.strings, ...redis.hashes.keys()]);
    expect(everything).not.toContain("203.0.113.7");
    expect(everything).not.toContain("AppleWebKit");
  });

  it("does not double count or re-notify for repeated beacons of the same session", async () => {
    const { redis, telegram, deps, runScheduled } = setup();
    await handleCollect(beacon(validPayload()), deps);
    await handleCollect(beacon(validPayload()), deps);
    await runScheduled();
    expect(telegram).toHaveBeenCalledTimes(1);
    expect(redis.hash(KEYS.week("2026-10-19", "totals")).sessions).toBe(1);
  });

  it("keeps working and logs safely when Telegram fails", async () => {
    const { deps, log, runScheduled } = setup({
      telegram: vi.fn().mockRejectedValue(new Error("Telegram returned 500")),
    });
    const response = await handleCollect(beacon(validPayload()), deps);
    await expect(runScheduled()).resolves.toBeUndefined();
    expect(response.status).toBe(204);
    expect(log).toHaveBeenCalledWith("notification failed: Telegram returned 500");
  });

  it("records stats without notifying when Telegram is not configured", async () => {
    const { redis, deps, tasks } = setup({ telegram: null });
    await handleCollect(beacon(validPayload()), deps);
    expect(tasks).toHaveLength(0);
    expect(redis.hash(KEYS.week("2026-10-19", "totals")).sessions).toBe(1);
  });

  it("accepts silently when Redis is not configured", async () => {
    const { deps } = setup({ redis: null });
    expect((await handleCollect(beacon(validPayload()), deps)).status).toBe(204);
  });

  it("records missing geolocation as unknown", async () => {
    const { redis, deps } = setup();
    await handleCollect(
      beacon(validPayload(), { "x-vercel-ip-country": "", "x-vercel-ip-country-region": "" }),
      deps,
    );
    expect(redis.hash(KEYS.week("2026-10-19", "country"))).toEqual({ unknown: 1 });
  });

  it("ignores known bots entirely", async () => {
    const { redis, deps, tasks } = setup();
    const response = await handleCollect(beacon(validPayload(), { "user-agent": GOOGLEBOT }), deps);
    expect(response.status).toBe(204);
    expect(redis.hashes.size).toBe(0);
    expect(tasks).toHaveLength(0);
  });

  it.each([
    ["malformed JSON", "{not json", 400],
    ["invalid payload", { ...validPayload(), landing: "admin" }, 400],
    ["oversized payload", JSON.stringify({ pad: "x".repeat(5000) }), 413],
  ])("rejects %s", async (_, body, status) => {
    const { redis, deps } = setup();
    expect((await handleCollect(beacon(body), deps)).status).toBe(status);
    expect(redis.hashes.size).toBe(0);
  });

  it("rejects cross-site requests", async () => {
    const { deps } = setup();
    const response = await handleCollect(
      beacon(validPayload(), { origin: "https://evil.example", "sec-fetch-site": "cross-site" }),
      deps,
    );
    expect(response.status).toBe(403);
  });

  it("rate limits a single client", async () => {
    const { deps } = setup();
    let last = 0;
    for (let i = 0; i <= RATE_LIMIT.maxBeacons; i += 1) {
      last = (await handleCollect(beacon(validPayload()), deps)).status;
    }
    expect(last).toBe(429);
  });

  it("caps notifications per hour", async () => {
    const { redis, telegram, deps, runScheduled, log } = setup();
    redis.strings.set(KEYS.notifyCap("2026-10-19T12"), "30");
    await handleCollect(beacon(validPayload()), deps);
    await runScheduled();
    expect(telegram).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith("hourly notification cap reached; visit still recorded");
  });

  it("fails open (204) when Redis is unavailable", async () => {
    const { redis, deps } = setup();
    redis.failNext = true;
    expect((await handleCollect(beacon(validPayload()), deps)).status).toBe(204);
  });
});
