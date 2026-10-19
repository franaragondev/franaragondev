import { describe, expect, it } from "vitest";
import { classifyAcquisition } from "./acquisition";
import { isLikelyBot, summarizeUserAgent } from "./userAgent";
import {
  ANDROID_CHROME,
  ANDROID_TABLET,
  GOOGLEBOT,
  IPHONE_SAFARI,
  LINKEDIN_IOS,
  MAC_SAFARI,
  WINDOWS_EDGE,
} from "./testing/fixtures";

describe("referrer classification", () => {
  const classify = (referrer: string | null, extra: Partial<Parameters<typeof classifyAcquisition>[0]> = {}) =>
    classifyAcquisition({ referrer, utm: null, inApp: null, ...extra });

  it("recognises search engines, including country domains", () => {
    expect(classify("www.google.com")).toMatchObject({ channel: "organic", label: "Google · organic search" });
    expect(classify("www.google.co.uk").channel).toBe("organic");
    expect(classify("duckduckgo.com").channel).toBe("organic");
    expect(classify("search.seznam.cz").channel).toBe("organic");
  });

  it("separates AI assistants from search", () => {
    expect(classify("gemini.google.com").channel).toBe("ai");
    expect(classify("chatgpt.com").label).toBe("ChatGPT · AI assistant");
  });

  it("recognises social networks behind redirect subdomains", () => {
    expect(classify("lm.facebook.com")).toMatchObject({ channel: "social", domain: "facebook.com" });
    expect(classify("www.linkedin.com").channel).toBe("social");
    expect(classify("t.co").channel).toBe("social");
  });

  it("treats other sites as referrals and keeps the domain", () => {
    expect(classify("github.com")).toMatchObject({ channel: "referral", domain: "github.com" });
  });

  it("gives UTM campaigns precedence", () => {
    expect(
      classify("www.linkedin.com", { utm: { source: "linkedin", medium: "post", campaign: "oct" } }),
    ).toMatchObject({ channel: "campaign", campaign: "linkedin / post · oct" });
  });

  it("never invents a source when there is no referrer", () => {
    expect(classify(null)).toMatchObject({ channel: "direct", domain: null });
    expect(classify(null).label).toContain("No referrer");
    expect(classify(null, { resumed: true }).channel).toBe("unknown");
  });

  it("uses an observed in-app browser signature, and says the referrer was missing", () => {
    expect(classify(null, { inApp: "LinkedIn" })).toMatchObject({
      channel: "social",
      label: "LinkedIn app (in-app browser, no referrer)",
    });
  });
});

describe("user agent summary", () => {
  it.each([
    [IPHONE_SAFARI, false, { device: "mobile", os: "iOS", browser: "Safari" }],
    [MAC_SAFARI, false, { device: "desktop", os: "macOS", browser: "Safari" }],
    [MAC_SAFARI, true, { device: "tablet", os: "iPadOS", browser: "Safari" }],
    [WINDOWS_EDGE, false, { device: "desktop", os: "Windows", browser: "Edge" }],
    [ANDROID_CHROME, true, { device: "mobile", os: "Android", browser: "Chrome" }],
    [ANDROID_TABLET, true, { device: "tablet", os: "Android", browser: "Chrome" }],
    [LINKEDIN_IOS, true, { device: "mobile", os: "iOS", browser: "LinkedIn in-app", inApp: "LinkedIn" }],
  ])("summarises %s", (ua, touch, expected) => {
    expect(summarizeUserAgent(ua, touch)).toMatchObject(expected);
  });

  it("falls back to Other for unknown agents", () => {
    expect(summarizeUserAgent("SomethingNew/1.0 (unknown platform)", false)).toMatchObject({
      device: "desktop",
      os: "Other",
      browser: "Other",
    });
  });

  it("flags crawlers, tools and empty agents as bots", () => {
    expect(isLikelyBot(GOOGLEBOT)).toBe(true);
    expect(isLikelyBot("curl/8.7.1")).toBe(true);
    expect(isLikelyBot("Mozilla/5.0 HeadlessChrome/140.0 Safari/537.36")).toBe(true);
    expect(isLikelyBot(null)).toBe(true);
    expect(isLikelyBot(IPHONE_SAFARI)).toBe(false);
    expect(isLikelyBot(WINDOWS_EDGE)).toBe(false);
  });
});
