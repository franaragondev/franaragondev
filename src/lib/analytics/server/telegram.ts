/**
 * Telegram Delivery:
 * Server-only sendMessage wrapper for the existing bot (FatherBot), using the same
 * TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID convention as the other projects. Only
 * sendMessage is ever called: no webhooks or getUpdates, so integrations that
 * already consume the bot's updates are unaffected.
 *
 * The token is part of the request URL, so neither the URL nor the token ever
 * appears in an error message or log line.
 */

export const TELEGRAM_MAX_LENGTH = 4096;

export class TelegramDeliveryError extends Error {
  override readonly name = "TelegramDeliveryError";

  constructor(
    message: string,
    readonly statusCode?: number,
    readonly retryable = false,
  ) {
    super(message);
  }
}

export interface TelegramConfig {
  token: string;
  chatId: string;
}

export function telegramConfig(env: NodeJS.ProcessEnv = process.env): TelegramConfig | null {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  return token && chatId ? { token, chatId } : null;
}

export type TelegramSender = (text: string) => Promise<void>;

async function postOnce(config: TelegramConfig, text: string, fetchImpl: typeof fetch) {
  let response: Response;
  try {
    response = await fetchImpl(`https://api.telegram.org/bot${config.token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: config.chatId,
        text,
        link_preview_options: { is_disabled: true },
      }),
      signal: AbortSignal.timeout(8000),
    });
  } catch (error) {
    const reason = error instanceof Error ? error.name : "unknown";
    throw new TelegramDeliveryError(`Telegram unreachable (${reason})`, undefined, true);
  }

  if (response.ok) return;

  let description = "";
  let retryAfter: number | undefined;
  try {
    const body = (await response.json()) as {
      description?: string;
      parameters?: { retry_after?: number };
    };
    description = String(body.description ?? "").slice(0, 200);
    retryAfter = body.parameters?.retry_after;
  } catch {
    // Body is optional for diagnostics.
  }
  const retryable = response.status === 429 || response.status >= 500;
  const error = new TelegramDeliveryError(
    `Telegram returned ${response.status}${description ? ` — ${description}` : ""}`,
    response.status,
    retryable,
  );
  (error as TelegramDeliveryError & { retryAfter?: number }).retryAfter = retryAfter;
  throw error;
}

/**
 * Sends one plain-text message (no parse mode, so no escaping pitfalls). Retries
 * once on network errors, 429 and 5xx; client errors such as a wrong chat id are
 * surfaced immediately.
 */
export function createTelegramSender(
  config: TelegramConfig,
  options: { fetchImpl?: typeof fetch; sleep?: (ms: number) => Promise<void> } = {},
): TelegramSender {
  const fetchImpl = options.fetchImpl ?? fetch;
  const sleep = options.sleep ?? ((ms: number) => new Promise((resolve) => setTimeout(resolve, ms)));

  return async (text: string) => {
    const message =
      text.length > TELEGRAM_MAX_LENGTH ? `${text.slice(0, TELEGRAM_MAX_LENGTH - 1)}…` : text;
    try {
      await postOnce(config, message, fetchImpl);
    } catch (error) {
      if (!(error instanceof TelegramDeliveryError) || !error.retryable) throw error;
      const retryAfter = (error as TelegramDeliveryError & { retryAfter?: number }).retryAfter;
      await sleep(Math.min((retryAfter ?? 1) * 1000, 5000));
      await postOnce(config, message, fetchImpl);
    }
  };
}
