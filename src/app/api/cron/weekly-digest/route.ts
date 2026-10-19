import { NextResponse, type NextRequest } from "next/server";
import { createRedis, redisConfig } from "@/lib/analytics/server/redis";
import { createTelegramSender, telegramConfig } from "@/lib/analytics/server/telegram";
import { reportingTimezone } from "@/lib/analytics/server/time";
import {
  isAuthorizedCronRequest,
  resolveReportWeek,
  runWeeklyReport,
} from "@/lib/analytics/server/weeklyReport";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Weekly digest job, triggered by Vercel Cron (see vercel.json).
 * Vercel sends `Authorization: Bearer $CRON_SECRET`; any other caller gets 401.
 *
 * Query parameters (still require the secret):
 *   ?dryRun=1          return the messages without sending them
 *   ?week=YYYY-MM-DD   report a specific completed week (its Monday)
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET is not configured" }, { status: 503 });
  }
  if (!isAuthorizedCronRequest(request, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redis = redisConfig();
  if (!redis) {
    return NextResponse.json({ error: "Redis is not configured" }, { status: 503 });
  }

  const timeZone = reportingTimezone();
  const { searchParams } = request.nextUrl;
  const target = resolveReportWeek(searchParams.get("week"), new Date(), timeZone);
  if ("error" in target) return NextResponse.json({ error: target.error }, { status: 400 });

  const telegram = telegramConfig();
  try {
    const result = await runWeeklyReport({
      redis: createRedis(redis),
      telegram: telegram ? createTelegramSender(telegram) : null,
      week: target.week,
      comparison: target.comparison,
      timeZone,
      dryRun: searchParams.get("dryRun") === "1",
      now: () => new Date(),
    });

    if (result.status === "failed") {
      console.error(`[analytics] weekly digest ${result.week} failed: ${result.error}`);
      return NextResponse.json(result, { status: 502 });
    }
    return NextResponse.json(result, { status: result.status === "in_progress" ? 409 : 200 });
  } catch (error) {
    console.error(
      `[analytics] weekly digest failed: ${error instanceof Error ? error.message : "unknown error"}`,
    );
    return NextResponse.json({ error: "Digest failed" }, { status: 500 });
  }
}
