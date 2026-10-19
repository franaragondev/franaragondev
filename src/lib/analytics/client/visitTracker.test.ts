import { describe, expect, it, vi } from "vitest";
import type { VisitPayload } from "../payload";
import { parseUtm, referrerHost, SESSION_TIMEOUT_MS, STORAGE_KEY, VisitTracker } from "./visitTracker";
import { isSectionInView } from "./sectionVisibility";

function memoryStorage() {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  };
}

function setup(overrides: Partial<{ pathname: string; search: string; referrer: string }> = {}) {
  let now = 1_000_000;
  let ids = 0;
  const sent: VisitPayload[] = [];
  const onRecord = vi.fn();
  const storage = memoryStorage();
  const make = () =>
    new VisitTracker(
      {
        storage,
        now: () => now,
        randomId: () => String(++ids).padStart(32, "a"),
        send: (payload) => sent.push(payload),
        onRecord,
      },
      {
        pathname: overrides.pathname ?? "/",
        search: overrides.search ?? "",
        referrer: overrides.referrer ?? "",
        host: "www.franaragondev.com",
        touch: false,
      },
    );
  const tracker = make();
  tracker.start(true);
  return {
    tracker,
    make,
    sent,
    storage,
    onRecord,
    advance: (ms: number) => {
      now += ms;
    },
  };
}

describe("page views and client-side route transitions", () => {
  it("counts the landing view once, even when the effect runs twice (Strict Mode)", () => {
    const { tracker } = setup();
    tracker.pageView("/");
    tracker.pageView("/");
    expect(tracker.payload).toMatchObject({ landing: "home", locale: "en", pageviews: 1, trail: ["home"] });
  });

  it("records each client-side navigation in order", () => {
    const { tracker } = setup({ pathname: "/es" });
    tracker.pageView("/es");
    tracker.pageView("/es/partnerships/baguira-suites");
    tracker.pageView("/es");
    expect(tracker.payload).toMatchObject({
      landing: "home",
      locale: "es",
      pageviews: 3,
      trail: ["home", "baguira", "home"],
    });
  });
});

describe("section views", () => {
  it("deduplicates sections within a session", () => {
    const { tracker, onRecord } = setup();
    tracker.pageView("/");
    expect(tracker.sectionView("projects")).toBe(true);
    expect(tracker.sectionView("projects")).toBe(false);
    tracker.sectionView("contact");
    expect(tracker.payload?.sections).toEqual(["projects", "contact"]);
    expect(tracker.payload?.trail).toEqual(["home", "projects", "contact"]);
    expect(onRecord).toHaveBeenCalledTimes(2);
  });

  it("requires a sensible share of the section or viewport to be visible", () => {
    expect(isSectionInView(100, 2000, 800)).toBe(false);
    expect(isSectionInView(320, 2000, 800)).toBe(true); // 40% of the viewport
    expect(isSectionInView(150, 300, 800)).toBe(true); // half of a short section
    expect(isSectionInView(0, 300, 800)).toBe(false);
  });
});

describe("events and beacons", () => {
  it("flushes immediately on a conversion and only once per event", () => {
    const { tracker, sent } = setup();
    tracker.pageView("/");
    tracker.event("contact_submit");
    tracker.event("contact_submit");
    expect(sent).toHaveLength(1);
    expect(sent[0].events).toEqual(["contact_submit"]);
  });

  it("does not flush for non-conversion interactions until the tab is hidden", () => {
    const { tracker, sent, advance } = setup();
    tracker.pageView("/");
    tracker.event("github_click");
    expect(sent).toHaveLength(0);
    advance(15_000);
    tracker.setVisible(false);
    expect(sent).toHaveLength(1);
    expect(sent[0].engagedMs).toBe(15_000);
  });

  it("skips beacons when nothing changed since the last one", () => {
    const { tracker, sent, advance } = setup();
    tracker.pageView("/");
    tracker.setVisible(false);
    tracker.setVisible(false);
    advance(500);
    tracker.setVisible(true);
    advance(500);
    tracker.setVisible(false); // < 1s of visibility is ignored
    expect(sent).toHaveLength(1);
  });

  it("accumulates engagement only while the tab is visible", () => {
    const { tracker, sent, advance } = setup();
    tracker.pageView("/");
    advance(5_000);
    tracker.setVisible(false);
    advance(60_000);
    tracker.setVisible(true);
    advance(3_000);
    tracker.setVisible(false);
    expect(sent.at(-1)?.engagedMs).toBe(8_000);
  });
});

describe("session lifecycle", () => {
  it("resumes the session from sessionStorage after a full reload", () => {
    const { tracker, make, storage } = setup();
    tracker.pageView("/");
    tracker.sectionView("about");
    const reloaded = make();
    reloaded.start(true);
    expect(reloaded.payload?.id).toBe(tracker.payload?.id);
    expect(reloaded.payload?.sections).toEqual(["about"]);
    expect(storage.data.has(STORAGE_KEY)).toBe(true);
  });

  it("starts a new, origin-unknown session when a tab returns after the timeout", () => {
    const { tracker, advance } = setup({ referrer: "https://www.google.com/" });
    tracker.pageView("/");
    const firstId = tracker.payload?.id;
    expect(tracker.payload?.referrer).toBe("www.google.com");
    tracker.setVisible(false);
    advance(SESSION_TIMEOUT_MS + 1);
    tracker.setVisible(true);
    expect(tracker.payload?.id).not.toBe(firstId);
    expect(tracker.payload).toMatchObject({ referrer: null, resumed: true, pageviews: 1 });
  });
});

describe("referrer and UTM sanitisation", () => {
  it("keeps only the external hostname", () => {
    expect(referrerHost("https://www.google.com/search?q=secret", "franaragondev.com")).toBe("www.google.com");
    expect(referrerHost("https://franaragondev.com/es", "www.franaragondev.com")).toBeNull();
    expect(referrerHost("android-app://com.linkedin.android/", "franaragondev.com")).toBeNull();
    expect(referrerHost("", "franaragondev.com")).toBeNull();
  });

  it("normalises UTM values and drops unsafe characters", () => {
    expect(parseUtm("?utm_source=LinkedIn&utm_medium=Social Post&utm_campaign=<b>oct</b>")).toEqual({
      source: "linkedin",
      medium: "social-post",
      campaign: "boctb",
    });
    expect(parseUtm("?ref=abc")).toBeNull();
  });
});
