"use client";

import { useState, useRef } from "react";
import { FaInstagram, FaTwitter, FaLinkedin, FaGithub, FaWhatsapp } from "react-icons/fa";
import { useTranslations } from "next-intl";

/**
 * ContactSection Component
 * * Orchestrates the primary lead-generation flow. Features a secure 
 * asynchronous form submission with bot-mitigation logic and a 
 * responsive grid layout for direct communication channels.
 */
export default function ContactSection() {
  const t = useTranslations("contact");
  
  /**
   * Honeypot strategy for non-intrusive bot protection.
   * This hidden field traps automated scripts without impacting UX for human users.
   */
  const honeypotRef = useRef<HTMLInputElement>(null);
  
  /**
   * State machine to manage the submission lifecycle:
   * 'idle'    - Ready for input.
   * 'loading' - Async request in progress.
   * 'success' - Request acknowledged by server.
   * 'error'   - API or network failure.
   * 'bot'     - Trap triggered by automated submission.
   */
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "bot">("idle");

  /**
   * Handles the form submission via Fetch API.
   * Implements pre-flight bot checks and dynamic state updates based on server response.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Bot mitigation: If the hidden honeypot field is filled, abort the request silently.
    if (honeypotRef.current?.value) return setStatus("bot");
    
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", { 
        method: "POST", 
        body: new FormData(e.currentTarget) 
      });

      if (response.ok) { 
        setStatus("success"); 
        e.currentTarget.reset(); 
      } else { 
        setStatus("error"); 
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="px-4 md:px-12 py-32 bg-white dark:bg-[#111111] scroll-mt-24">
      {/* Dynamic header leveraging high-contrast typography for readability */}
      <div className="text-center mb-24">
        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-[#1D1D1F] dark:text-[#F5F5F7]">
          {t("title")}
        </h2>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
        {/* Contact Form: Minimalist design with Apple-standard focus rings */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold tracking-wide text-[#6E6E73] uppercase mb-2">
              {t("name")}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              aria-label={t("name")}
              className="w-full px-5 py-4 rounded-2xl bg-[#F5F5F7] dark:bg-[#1C1C1E] border-none text-[#1D1D1F] dark:text-white focus:ring-2 focus:ring-[#1D1D1F] dark:focus:ring-white transition-shadow text-lg"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold tracking-wide text-[#6E6E73] uppercase mb-2">
              {t("email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              aria-label={t("email")}
              className="w-full px-5 py-4 rounded-2xl bg-[#F5F5F7] dark:bg-[#1C1C1E] border-none text-[#1D1D1F] dark:text-white focus:ring-2 focus:ring-[#1D1D1F] dark:focus:ring-white transition-shadow text-lg"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold tracking-wide text-[#6E6E73] uppercase mb-2">
              {t("message")}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              aria-label={t("message")}
              className="w-full px-5 py-4 rounded-2xl bg-[#F5F5F7] dark:bg-[#1C1C1E] border-none text-[#1D1D1F] dark:text-white focus:ring-2 focus:ring-[#1D1D1F] dark:focus:ring-white transition-shadow text-lg resize-none"
            />
          </div>

          {/* Honeypot Field: Positioned off-screen for accessibility compliance (aria-hidden) */}
          <div aria-hidden="true" className="absolute -left-[5000px]">
            <input type="text" name="honeypot" tabIndex={-1} ref={honeypotRef} />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full md:w-auto bg-[#1D1D1F] dark:bg-white text-white dark:text-black px-10 py-4 rounded-full font-semibold text-lg tracking-tight hover:scale-105 active:scale-95 transition-transform flex items-center justify-center disabled:opacity-50"
          >
            {status === "loading" ? "..." : t("submit")}
          </button>

          {/* Contextual feedback messages */}
          {status === "success" && <p className="text-[#34C759] font-medium tracking-tight mt-2">{t("success")}</p>}
          {status === "error" && <p className="text-[#FF3B30] font-medium tracking-tight mt-2">{t("error")}</p>}
        </form>

        {/* Secondary Communication Channels */}
        <div className="space-y-10 text-[#1D1D1F] dark:text-white">
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-[#6E6E73] uppercase mb-3">{t("phone")}</h3>
            <a href="https://wa.me/420774363226" className="text-2xl md:text-3xl font-bold tracking-tighter hover:opacity-70 transition-opacity" target="_blank">
              +420 774 363 226
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-[#6E6E73] uppercase mb-4">{t("social")}</h3>
            <div className="flex gap-6 text-2xl">
              <a href="https://github.com/franaragondev" target="_blank" aria-label="GitHub" className="hover:scale-110 transition-transform"><FaGithub /></a>
              <a href="https://www.linkedin.com/in/fran-aragon-simon/" target="_blank" aria-label="LinkedIn" className="hover:scale-110 transition-transform"><FaLinkedin /></a>
              <a href="https://wa.me/420774363226" target="_blank" aria-label="WhatsApp" className="hover:scale-110 transition-transform"><FaWhatsapp /></a>
              <a href="https://twitter.com/franaragondev" target="_blank" aria-label="Twitter" className="hover:scale-110 transition-transform"><FaTwitter /></a>
              <a href="https://instagram.com/franaragon13" target="_blank" aria-label="Instagram" className="hover:scale-110 transition-transform"><FaInstagram /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}