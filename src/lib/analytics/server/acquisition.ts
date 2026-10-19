import type { Utm } from "../payload";
import type { InAppBrowser } from "./userAgent";

/**
 * Acquisition Classification:
 * Derives the channel strictly from what was observed (UTM tags, the referrer
 * hostname, an in-app browser signature). A missing referrer is reported as
 * exactly that: it can mean a typed URL, a bookmark, an app, or a referrer
 * stripped by browser privacy settings, and is never guessed further.
 */

export type Channel = "campaign" | "organic" | "ai" | "social" | "referral" | "direct" | "unknown";

export const CHANNEL_LABELS: Record<Channel, string> = {
  campaign: "Campaign (UTM)",
  organic: "Organic search",
  ai: "AI assistant",
  social: "Social",
  referral: "Referral",
  direct: "Direct / no referrer",
  unknown: "Unknown",
};

export interface Acquisition {
  channel: Channel;
  /** Human summary, e.g. "Google · organic search". */
  label: string;
  /** Normalised referring domain, when one was sent. */
  domain: string | null;
  /** "source / medium · campaign", when UTM tags were present. */
  campaign: string | null;
}

const SEARCH_ENGINES: Array<[RegExp, string]> = [
  [/^google\.[a-z.]+$/, "Google"],
  [/^bing\.com$/, "Bing"],
  [/^duckduckgo\.com$/, "DuckDuckGo"],
  [/^(search\.)?yahoo\.[a-z.]+$/, "Yahoo"],
  [/^yandex\.[a-z.]+$/, "Yandex"],
  [/^baidu\.com$/, "Baidu"],
  [/^ecosia\.org$/, "Ecosia"],
  [/^search\.brave\.com$/, "Brave Search"],
  [/^startpage\.com$/, "Startpage"],
  [/^qwant\.com$/, "Qwant"],
  [/^seznam\.cz$|^search\.seznam\.cz$/, "Seznam"],
];

const AI_ASSISTANTS: Array<[RegExp, string]> = [
  [/^chatgpt\.com$|^chat\.openai\.com$/, "ChatGPT"],
  [/^perplexity\.ai$/, "Perplexity"],
  [/^claude\.ai$/, "Claude"],
  [/^gemini\.google\.com$/, "Gemini"],
  [/^copilot\.microsoft\.com$/, "Copilot"],
];

const SOCIAL: Array<[RegExp, string]> = [
  [/^linkedin\.com$|^lnkd\.in$/, "LinkedIn"],
  [/^(facebook|fb)\.com$/, "Facebook"],
  [/^instagram\.com$/, "Instagram"],
  [/^(t\.co|twitter\.com|x\.com)$/, "X/Twitter"],
  [/^reddit\.com$/, "Reddit"],
  [/^youtube\.com$/, "YouTube"],
  [/^tiktok\.com$/, "TikTok"],
  [/^threads\.net$/, "Threads"],
  [/^bsky\.app$/, "Bluesky"],
  [/^news\.ycombinator\.com$/, "Hacker News"],
  [/^(web\.)?whatsapp\.com$/, "WhatsApp"],
  [/^t\.me$|^(web\.)?telegram\.org$/, "Telegram"],
];

/** Drops common mobile/redirect subdomains: m.facebook.com → facebook.com. */
export function normalizeDomain(host: string): string {
  return host.toLowerCase().replace(/^(www|m|l|lm|mobile|out)\./, "");
}

function match(table: Array<[RegExp, string]>, domain: string): string | null {
  for (const [pattern, name] of table) if (pattern.test(domain)) return name;
  return null;
}

export function formatCampaign(utm: Utm): string {
  const head = [utm.source ?? "(no source)", utm.medium].filter(Boolean).join(" / ");
  return utm.campaign ? `${head} · ${utm.campaign}` : head;
}

export function classifyAcquisition(input: {
  referrer: string | null;
  utm: Utm | null;
  inApp: InAppBrowser;
  /** True when the session restarted in a stale tab, where the origin is unknowable. */
  resumed?: boolean;
}): Acquisition {
  const domain = input.referrer ? normalizeDomain(input.referrer) : null;

  if (input.utm) {
    const campaign = formatCampaign(input.utm);
    return { channel: "campaign", label: `Campaign: ${campaign}`, domain, campaign };
  }

  if (domain) {
    const ai = match(AI_ASSISTANTS, domain);
    if (ai) return { channel: "ai", label: `${ai} · AI assistant`, domain, campaign: null };
    const search = match(SEARCH_ENGINES, domain);
    if (search) return { channel: "organic", label: `${search} · organic search`, domain, campaign: null };
    const social = match(SOCIAL, domain);
    if (social) return { channel: "social", label: `${social} · social`, domain, campaign: null };
    return { channel: "referral", label: `Referral · ${domain}`, domain, campaign: null };
  }

  if (input.inApp) {
    return {
      channel: "social",
      label: `${input.inApp} app (in-app browser, no referrer)`,
      domain: null,
      campaign: null,
    };
  }

  if (input.resumed) {
    return { channel: "unknown", label: "Unknown (resumed tab)", domain: null, campaign: null };
  }

  return {
    channel: "direct",
    label: "No referrer (direct, bookmark, app or hidden)",
    domain: null,
    campaign: null,
  };
}
