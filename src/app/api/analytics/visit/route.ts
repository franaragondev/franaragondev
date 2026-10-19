import { after, type NextRequest } from "next/server";
import { handleCollect } from "@/lib/analytics/server/collect";
import { createRedis, redisConfig } from "@/lib/analytics/server/redis";
import { createTelegramSender, telegramConfig } from "@/lib/analytics/server/telegram";
import { reportingTimezone } from "@/lib/analytics/server/time";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Visit beacon endpoint (POST only). Public by nature: it is protected by strict
 * payload validation, same-origin checks, per-client rate limits and an hourly
 * cap on notifications rather than by authentication.
 */
export async function POST(request: NextRequest) {
  const redis = redisConfig();
  const telegram = telegramConfig();

  return handleCollect(request, {
    redis: redis ? createRedis(redis) : null,
    telegram: telegram ? createTelegramSender(telegram) : null,
    schedule: (task) => after(task),
    now: () => new Date(),
    timeZone: reportingTimezone(),
    hashSecret: redis?.token ?? "",
  });
}
