export type ContactSubmissionResult = "success" | "error";

/**
 * Sends the contact form and resets it only when the server accepted the message.
 * The form element is passed in explicitly: React clears `event.currentTarget`
 * once the handler yields, so it must be captured before any `await`.
 * On failure the form is left untouched, preserving what the visitor typed.
 */
export async function submitContactForm(
  form: Pick<HTMLFormElement, "reset">,
  body: FormData,
  fetchImpl: typeof fetch = fetch,
): Promise<ContactSubmissionResult> {
  let response: Response;
  try {
    response = await fetchImpl("/api/contact", { method: "POST", body });
  } catch {
    return "error";
  }

  if (!response.ok) return "error";

  form.reset();
  return "success";
}
