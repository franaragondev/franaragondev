import { describe, expect, it, vi } from "vitest";
import { submitContactForm } from "./submitContactForm";

function setup(result: Response | Error) {
  const form = { reset: vi.fn() };
  const body = new FormData();
  body.set("name", "Ada");
  const fetchImpl = vi.fn(() =>
    result instanceof Error ? Promise.reject(result) : Promise.resolve(result),
  ) as unknown as typeof fetch;
  return { form, body, fetchImpl };
}

describe("submitContactForm", () => {
  it("posts the form data and resets the form after success", async () => {
    const { form, body, fetchImpl } = setup(new Response("{}", { status: 200 }));
    await expect(submitContactForm(form, body, fetchImpl)).resolves.toBe("success");
    expect(fetchImpl).toHaveBeenCalledWith("/api/contact", { method: "POST", body });
    expect(form.reset).toHaveBeenCalledTimes(1);
  });

  it("keeps the visitor's input when the server rejects the message", async () => {
    const { form, body, fetchImpl } = setup(new Response("{}", { status: 500 }));
    await expect(submitContactForm(form, body, fetchImpl)).resolves.toBe("error");
    expect(form.reset).not.toHaveBeenCalled();
  });

  it("keeps the visitor's input on network failure", async () => {
    const { form, body, fetchImpl } = setup(new TypeError("fetch failed"));
    await expect(submitContactForm(form, body, fetchImpl)).resolves.toBe("error");
    expect(form.reset).not.toHaveBeenCalled();
  });

  it("reports success even if resetting happens after the event has been released", async () => {
    // Mirrors React: event.currentTarget is null after the handler yields,
    // but the form reference captured beforehand is still valid.
    const event = { currentTarget: { reset: vi.fn() } as { reset: () => void } | null };
    const form = event.currentTarget!;
    const fetchImpl = vi.fn(async () => {
      event.currentTarget = null;
      return new Response("{}", { status: 200 });
    }) as unknown as typeof fetch;
    await expect(submitContactForm(form, new FormData(), fetchImpl)).resolves.toBe("success");
    expect(form.reset).toHaveBeenCalledTimes(1);
  });
});
