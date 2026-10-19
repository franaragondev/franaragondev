import { describe, expect, it, vi } from "vitest";
import { createTelegramSender, telegramConfig, TelegramDeliveryError, TELEGRAM_MAX_LENGTH } from "./telegram";

const config = { token: "123456:secret-token-value", chatId: "-100123" };
const response = (status: number, body: unknown = { ok: status < 300 }) =>
  new Response(JSON.stringify(body), { status });

function sender(fetchImpl: ReturnType<typeof vi.fn>) {
  return createTelegramSender(config, {
    fetchImpl: fetchImpl as unknown as typeof fetch,
    sleep: async () => undefined,
  });
}

describe("Telegram delivery", () => {
  it("posts plain text to the configured chat", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(response(200));
    await sender(fetchImpl)("hello");
    const [url, init] = fetchImpl.mock.calls[0];
    expect(String(url)).toBe(`https://api.telegram.org/bot${config.token}/sendMessage`);
    expect(JSON.parse(init.body)).toMatchObject({ chat_id: "-100123", text: "hello" });
    expect(JSON.parse(init.body)).not.toHaveProperty("parse_mode");
  });

  it("throws on a client error without retrying or leaking the token", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(response(400, { ok: false, description: "Bad Request: chat not found" }));
    const error = await sender(fetchImpl)("x").catch((e) => e);
    expect(error).toBeInstanceOf(TelegramDeliveryError);
    expect(error.message).toBe("Telegram returned 400 — Bad Request: chat not found");
    expect(error.message).not.toContain(config.token);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("retries once on rate limiting and server errors", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(response(429, { ok: false, parameters: { retry_after: 1 } }))
      .mockResolvedValueOnce(response(200));
    await expect(sender(fetchImpl)("x")).resolves.toBeUndefined();
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("surfaces network failures after the retry, without the URL", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError(`fetch failed for bot${config.token}`));
    const error = await sender(fetchImpl)("x").catch((e) => e);
    expect(error).toBeInstanceOf(TelegramDeliveryError);
    expect(error.message).not.toContain(config.token);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("truncates messages to Telegram's limit", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(response(200));
    await sender(fetchImpl)("a".repeat(5000));
    expect(JSON.parse(fetchImpl.mock.calls[0][1].body).text).toHaveLength(TELEGRAM_MAX_LENGTH);
  });

  it("reports missing configuration as null", () => {
    expect(telegramConfig({ TELEGRAM_BOT_TOKEN: "t" } as unknown as NodeJS.ProcessEnv)).toBeNull();
    expect(telegramConfig({} as unknown as NodeJS.ProcessEnv)).toBeNull();
  });
});
