import { describe, expect, it } from "vitest";
import { formatFollowUpMessage, formatVisitMessage } from "./format";
import { mergeVisit, type MergeContext } from "./sessionize";
import { validPayload } from "./testing/fixtures";

const context = (overrides: Partial<MergeContext> = {}): MergeContext => ({
  now: Date.parse("2026-10-19T12:32:00Z"),
  week: "2026-10-19",
  country: "DE",
  region: "BY",
  device: { device: "mobile", browser: "Safari", os: "iOS", inApp: null },
  ...overrides,
});

const sum = (increments: { dimension: string; field: string; by: number }[]) =>
  Object.fromEntries(increments.map((i) => [`${i.dimension}.${i.field}`, i.by]));

describe("session grouping", () => {
  it("counts session-level dimensions once, on first sight", () => {
    const { visit, increments } = mergeVisit(null, validPayload(), context());
    expect(sum(increments)).toMatchObject({
      "totals.sessions": 1,
      "country.DE": 1,
      "device.mobile": 1,
      "channel.organic": 1,
      "referrer.google.com": 1,
      "landing.home": 1,
      "page.home": 1,
      "section.projects": 1,
      "totals.engaged": 1,
    });
    expect(visit.engaged).toBe(true);
  });

  it("emits nothing for a duplicate beacon", () => {
    const first = mergeVisit(null, validPayload(), context());
    const again = mergeVisit(first.visit, validPayload(), context());
    expect(again.increments).toEqual([]);
    expect(again.notification).toBeNull();
  });

  it("emits only the deltas of a later beacon in the same session", () => {
    const first = mergeVisit(null, validPayload(), context());
    const later = mergeVisit(
      first.visit,
      validPayload({
        trail: ["home", "projects", "experience", "contact"],
        sections: ["projects", "experience", "contact"],
        engagedMs: 40_000,
      }),
      context(),
    );
    expect(sum(later.increments)).toEqual({
      "totals.engaged_ms": 28_000,
      "section.experience": 1,
      "section.contact": 1,
      "totals.contact_reached": 1,
      "precontact.projects>experience": 1,
    });
  });

  it("ignores a trail that does not extend the stored one", () => {
    const first = mergeVisit(null, validPayload({ trail: ["home", "projects"] }), context());
    const forged = mergeVisit(first.visit, validPayload({ trail: ["baguira", "baguira"] }), context());
    expect(forged.visit.trail).toEqual(["home", "projects"]);
    expect(sum(forged.increments)).not.toHaveProperty("page.baguira");
  });

  it("records unknown country instead of guessing", () => {
    const { increments, visit } = mergeVisit(null, validPayload(), context({ country: null, region: null }));
    expect(sum(increments)).toHaveProperty("country.unknown", 1);
    expect(formatVisitMessage(visit, "Europe/Prague")).toContain("📍 Location: Unknown");
  });
});

describe("notifications", () => {
  it("does not notify for a bounce", () => {
    const { notification, visit } = mergeVisit(
      null,
      validPayload({ engagedMs: 3_000, trail: ["home"], sections: [] }),
      context(),
    );
    expect(visit.engaged).toBe(false);
    expect(notification).toBeNull();
  });

  it("notifies once when the session becomes engaged", () => {
    const bounce = mergeVisit(null, validPayload({ engagedMs: 3_000 }), context());
    const engaged = mergeVisit(bounce.visit, validPayload({ engagedMs: 11_000 }), context());
    const again = mergeVisit(engaged.visit, validPayload({ engagedMs: 50_000 }), context());
    expect(engaged.notification).toEqual({ kind: "visit" });
    expect(again.notification).toBeNull();
  });

  it("sends a capped follow-up for conversions after the first notification", () => {
    let state = mergeVisit(null, validPayload(), context()).visit;
    const followUp = mergeVisit(state, validPayload({ events: ["contact_submit"] }), context());
    expect(followUp.notification).toEqual({ kind: "follow-up", events: ["contact_submit"] });
    expect(sum(followUp.increments)).toMatchObject({
      "event.contact_submit": 1,
      "totals.conversion_sessions": 1,
      "conversion_path.projects": 1,
    });
    state = followUp.visit;
    // Non-conversion events never trigger a follow-up.
    expect(mergeVisit(state, validPayload({ events: ["contact_submit", "github_click"] }), context()).notification).toBeNull();
  });
});

describe("visit message format", () => {
  it("renders a compact message from observed data only", () => {
    const { visit } = mergeVisit(
      null,
      validPayload({
        trail: ["home", "expertise", "projects", "contact"],
        sections: ["expertise", "projects", "contact"],
        events: ["linkedin_click"],
        engagedMs: 138_000,
      }),
      context(),
    );
    const text = formatVisitMessage(visit, "Europe/Prague");
    expect(text).toBe(
      [
        "🌐 New website visit",
        "",
        "🕒 Mon 19 Oct, 14:32 CEST",
        "📍 Location: Germany · region BY",
        "📱 Device: Mobile · iOS / Safari",
        "🔎 Source: Google · organic search",
        "🔗 Landing: Home (EN)",
        "👀 Viewed: Home → Expertise → Selected projects → Contact",
        "🎯 Actions: LinkedIn click",
        "⏱️ Engagement: 2m 18s active · 1 page view · 3 sections",
        "",
        "⭐ Interest: Took a contact step (LinkedIn click). Reached the contact section after viewing the portfolio.",
      ].join("\n"),
    );
  });

  it("does not claim a form submission that was not recorded", () => {
    const { visit } = mergeVisit(null, validPayload({ sections: ["contact"], trail: ["home", "contact"] }), context());
    const text = formatVisitMessage(visit, "Europe/Prague");
    expect(text).not.toContain("Submitted");
    expect(text).not.toContain("🎯");
  });

  it("formats follow-ups", () => {
    const { visit } = mergeVisit(null, validPayload(), context());
    expect(formatFollowUpMessage(visit, ["contact_submit"], "Europe/Prague")).toContain(
      "New: Contact form submitted",
    );
  });
});
