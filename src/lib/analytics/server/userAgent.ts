/**
 * User-Agent Summary:
 * Reduces the user agent to coarse categories at request time. The raw string is
 * never stored or forwarded; only these labels are.
 */

export type DeviceCategory = "mobile" | "tablet" | "desktop";
export type InAppBrowser = "LinkedIn" | "Facebook" | "Instagram" | null;

export interface DeviceSummary {
  device: DeviceCategory;
  browser: string;
  os: string;
  inApp: InAppBrowser;
}

const BOT_PATTERN =
  /bot\b|bot\/|crawl|spider|slurp|scrap|archiver|facebookexternalhit|embedly|preview|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|curl\/|wget|python|axios|node-fetch|undici|go-http|okhttp|java\/|httpclient|libwww|phantomjs|selenium|puppeteer|playwright|vercel/i;

/** Known automation. Bots that do not run JavaScript never reach the tracker at all. */
export function isLikelyBot(userAgent: string | null | undefined): boolean {
  if (!userAgent || userAgent.length < 20) return true;
  return BOT_PATTERN.test(userAgent);
}

export function summarizeUserAgent(userAgent: string, touch: boolean): DeviceSummary {
  const ua = userAgent;
  const isMacintosh = /Macintosh/.test(ua);
  const iPadOS = isMacintosh && touch;

  const os = /iPhone|iPod/.test(ua)
    ? "iOS"
    : /iPad/.test(ua) || iPadOS
      ? "iPadOS"
      : /Android/.test(ua)
        ? "Android"
        : /Windows/.test(ua)
          ? "Windows"
          : /CrOS/.test(ua)
            ? "ChromeOS"
            : isMacintosh
              ? "macOS"
              : /Linux/.test(ua)
                ? "Linux"
                : "Other";

  const device: DeviceCategory =
    /iPad|Tablet|PlayBook|Silk/.test(ua) || iPadOS || (/Android/.test(ua) && !/Mobile/.test(ua))
      ? "tablet"
      : /Mobi|iPhone|iPod|Android|Windows Phone/.test(ua)
        ? "mobile"
        : "desktop";

  const inApp: InAppBrowser = /LinkedInApp/.test(ua)
    ? "LinkedIn"
    : /Instagram/.test(ua)
      ? "Instagram"
      : /FBAN|FBAV|FB_IAB/.test(ua)
        ? "Facebook"
        : null;

  const browser = inApp
    ? `${inApp} in-app`
    : /Edg(e|A|iOS)?\//.test(ua)
      ? "Edge"
      : /OPR\/|Opera/.test(ua)
        ? "Opera"
        : /SamsungBrowser/.test(ua)
          ? "Samsung Internet"
          : /Firefox|FxiOS/.test(ua)
            ? "Firefox"
            : /CriOS|Chrome\//.test(ua)
              ? "Chrome"
              : /Safari\//.test(ua) && /Version\//.test(ua)
                ? "Safari"
                : "Other";

  return { device, browser, os, inApp };
}
