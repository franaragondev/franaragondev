import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/** Consent gate: without an explicit "accepted", nothing is stored or sent. */

function stubBrowser(consent: string | null, webdriver = false) {
  const store = new Map<string, string>();
  if (consent) store.set("cookie-consent", consent);
  const storage = () => ({
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
  });
  const sendBeacon = vi.fn(() => true);
  const session = storage();
  vi.stubGlobal("window", {
    localStorage: storage(),
    sessionStorage: session,
    location: { pathname: "/", search: "", host: "franaragondev.com" },
  });
  vi.stubGlobal("document", { referrer: "", visibilityState: "visible" });
  vi.stubGlobal("navigator", { webdriver, maxTouchPoints: 0, sendBeacon });
  return { sendBeacon, session };
}

beforeEach(() => vi.resetModules());
afterEach(() => vi.unstubAllGlobals());

describe("consent behaviour", () => {
  it.each([null, "rejected"])("does not start tracking when consent is %s", async (consent) => {
    const { sendBeacon, session } = stubBrowser(consent);
    const { initTracker, trackEvent, getTracker } = await import("./track");
    expect(initTracker()).toBeNull();
    trackEvent("contact_submit");
    expect(getTracker()).toBeNull();
    expect(sendBeacon).not.toHaveBeenCalled();
    expect(session.getItem("fa-visit")).toBeNull();
  });

  it("does not track automated browsers even with consent", async () => {
    stubBrowser("accepted", true);
    const { initTracker } = await import("./track");
    expect(initTracker()).toBeNull();
  });

  it("tracks and sends beacons after consent", async () => {
    const { sendBeacon } = stubBrowser("accepted");
    const { initTracker, trackEvent } = await import("./track");
    const tracker = initTracker();
    expect(tracker).not.toBeNull();
    trackEvent("contact_submit");
    expect(sendBeacon).toHaveBeenCalledTimes(1);
    const [url] = sendBeacon.mock.calls[0] as unknown as [string];
    expect(url).toBe("/api/analytics/visit");
  });
});
