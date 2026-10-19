import { describe, expect, it } from "vitest";
import { eventForLink, resolveRoute } from "./catalog";
import { validateVisitPayload } from "./payload";
import { validPayload } from "./server/testing/fixtures";

describe("validateVisitPayload", () => {
  it("accepts a well-formed payload", () => {
    expect(validateVisitPayload(validPayload())).toEqual({ ok: true, payload: validPayload() });
  });

  it("drops unknown properties instead of passing them through", () => {
    const result = validateVisitPayload({ ...validPayload(), email: "someone@example.com" });
    expect(result.ok && "email" in result.payload).toBe(false);
  });

  it.each([
    ["non-object", "hello"],
    ["array", []],
    ["wrong version", { ...validPayload(), v: 2 }],
    ["bad id", validPayload({ id: "../../etc" })],
    ["unknown route", { ...validPayload(), landing: "admin" }],
    ["unknown section", { ...validPayload(), sections: ["<script>"] }],
    ["duplicate sections", validPayload({ sections: ["about", "about"] })],
    ["unknown event", { ...validPayload(), events: ["purchase"] }],
    ["referrer with path", { ...validPayload(), referrer: "evil.com/path?q=1" }],
    ["utm with spaces", { ...validPayload(), utm: { source: "hello world" } }],
    ["oversized trail", validPayload({ trail: Array(41).fill("home") })],
    ["empty trail", validPayload({ trail: [] })],
    ["negative engagement", validPayload({ engagedMs: -1 })],
    ["absurd engagement", validPayload({ engagedMs: 10 ** 12 })],
    ["fractional pageviews", validPayload({ pageviews: 1.5 })],
    ["missing touch", { ...validPayload(), touch: undefined }],
  ])("rejects %s", (_, input) => {
    expect(validateVisitPayload(input).ok).toBe(false);
  });
});

describe("catalog helpers", () => {
  it("resolves routes across locale prefixes", () => {
    expect(resolveRoute("/")).toEqual({ route: "home", locale: "en" });
    expect(resolveRoute("/en")).toEqual({ route: "home", locale: "en" });
    expect(resolveRoute("/fr/partnerships/baguira-suites")).toEqual({ route: "baguira", locale: "fr" });
    expect(resolveRoute("/partnerships/cd-estepona-fans")).toEqual({ route: "cdestepona", locale: "en" });
    expect(resolveRoute("/es/partnerships/cd-estepona-fans")).toEqual({ route: "cdestepona", locale: "es" });
    expect(resolveRoute("/constructor")).toEqual({ route: "other", locale: "en" });
    expect(resolveRoute("/es/privacidad")).toEqual({ route: "privacy", locale: "es" });
    expect(resolveRoute("/wp-admin")).toEqual({ route: "other", locale: "en" });
  });

  it("classifies links into allowlisted events", () => {
    const host = "www.franaragondev.com";
    expect(eventForLink("https://wa.me/420774363226", host)).toBe("whatsapp_click");
    expect(eventForLink("https://www.linkedin.com/in/fran-aragon-simon/", host)).toBe("linkedin_click");
    expect(eventForLink("/cv.pdf", host)).toBe("cv_open");
    expect(eventForLink("https://homestocker.app/", host)).toBe("project_homestocker");
    expect(eventForLink("mailto:info@franaragondev.com", host)).toBe("email_click");
    expect(eventForLink("https://example.org/", host)).toBe("outbound_other");
    expect(eventForLink("#contact", host)).toBeNull();
    expect(eventForLink("/es/partnerships/baguira-suites", host)).toBeNull();
    expect(eventForLink("javascript:alert(1)", host)).toBeNull();
  });
});
