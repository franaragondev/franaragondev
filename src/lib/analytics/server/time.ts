/**
 * Reporting Calendar:
 * Weeks run Monday 00:00 → Sunday 24:00 in the reporting timezone
 * (ANALYTICS_TIMEZONE, default Europe/Prague). Weeks are keyed by the local date
 * of their Monday ("2026-10-12"), so DST transitions never shift a boundary.
 */

export const DEFAULT_TIMEZONE = "Europe/Prague";

export function reportingTimezone(env: NodeJS.ProcessEnv = process.env): string {
  const candidate = env.ANALYTICS_TIMEZONE?.trim();
  if (!candidate) return DEFAULT_TIMEZONE;
  try {
    new Intl.DateTimeFormat("en", { timeZone: candidate });
    return candidate;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

const WEEK_KEY = /^\d{4}-\d{2}-\d{2}$/;

/** Local calendar date and ISO weekday (1 = Monday) of an instant. */
export function localDate(instant: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(instant);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const weekday = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(get("weekday")) + 1;
  return { year: Number(get("year")), month: Number(get("month")), day: Number(get("day")), weekday };
}

function keyFromUtcDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(weekKey: string, days: number): string {
  const date = new Date(`${weekKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return keyFromUtcDate(date);
}

/** Key of the reporting week containing `instant`. */
export function weekKeyFor(instant: Date, timeZone: string): string {
  const { year, month, day, weekday } = localDate(instant, timeZone);
  const local = new Date(Date.UTC(year, month - 1, day));
  local.setUTCDate(local.getUTCDate() - (weekday - 1));
  return keyFromUtcDate(local);
}

/** The most recent fully completed week and the one before it. */
export function previousCompleteWeek(now: Date, timeZone: string) {
  const current = weekKeyFor(now, timeZone);
  const week = addDays(current, -7);
  return { week, comparison: addDays(week, -7) };
}

export function isValidWeekKey(value: string): boolean {
  if (!WEEK_KEY.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && keyFromUtcDate(date) === value && date.getUTCDay() === 1;
}

/** True when the week has fully ended in the reporting timezone. */
export function isCompleteWeek(weekKey: string, now: Date, timeZone: string): boolean {
  return addDays(weekKey, 7) <= weekKeyFor(now, timeZone);
}

/** "12–18 Oct 2026" */
export function formatWeekRange(weekKey: string): string {
  const start = new Date(`${weekKey}T00:00:00Z`);
  const end = new Date(`${addDays(weekKey, 6)}T00:00:00Z`);
  const day = (date: Date) => date.getUTCDate();
  const month = (date: Date) => date.toLocaleString("en-GB", { month: "short", timeZone: "UTC" });
  const year = end.getUTCFullYear();
  return start.getUTCMonth() === end.getUTCMonth()
    ? `${day(start)}–${day(end)} ${month(end)} ${year}`
    : `${day(start)} ${month(start)} – ${day(end)} ${month(end)} ${year}`;
}

/** "Mon 19 Oct, 14:32 CEST" */
export function formatTimestamp(instant: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZoneName: "short",
  }).formatToParts(instant);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("weekday")} ${get("day")} ${get("month")}, ${get("hour")}:${get("minute")} ${get("timeZoneName")}`;
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}
