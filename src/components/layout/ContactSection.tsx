"use client";

import { useState, useRef } from "react";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const Map = dynamic(() => import("./Map"), { ssr: false });

export default function ContactSection() {
  const t = useTranslations("contact");
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error" | "bot"
  >("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (honeypotRef.current?.value) {
      setStatus("bot");
      return;
    }
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("loading");
    const response = await fetch("/api/contact", {
      method: "POST",
      body: data,
    });
    if (response.ok) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 30 },
  };

  return (
    <>
      <section className="px-4 md:px-12 mt-32">
        {/* --- Título --- */}
        <motion.div
          className="text-center mb-20 -mt-10"
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-3xl tracking-tight text-[var(--primary)] uppercase">
            {t("title")}
          </h2>
        </motion.div>

        {/* --- Contenido: Formulario + Contacto --- */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Formulario */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6 relative"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <label className="block text-sm font-medium text-[var(--primary)]">
                {t("name")}
              </label>
              <input
                name="name"
                type="text"
                required
                className="w-full p-3 rounded-md bg-white/60 dark:bg-gray-800/40 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--primary)]">
                {t("email")}
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full p-3 rounded-md bg-white/60 dark:bg-gray-800/40 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--primary)]">
                {t("message")}
              </label>
              <textarea
                name="message"
                rows={5}
                required
                className="w-full p-3 rounded-md bg-white/60 dark:bg-gray-800/40 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Honeypot */}
            <div
              aria-hidden="true"
              style={{ position: "absolute", left: "-5000px" }}
            >
              <input
                type="text"
                name="honeypot"
                tabIndex={-1}
                autoComplete="off"
                ref={honeypotRef}
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="cursor-pointer bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-gray-900 dark:text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {status === "loading" ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                t("submit")
              )}
            </button>

            {status === "success" && (
              <p className="text-green-500 text-sm">{t("success")}</p>
            )}
            {status === "error" && (
              <p className="text-red-500 text-sm">{t("error")}</p>
            )}
            {status === "bot" && (
              <p className="text-yellow-500 text-sm">Bot detectado 🕵️‍♂️</p>
            )}
          </motion.form>

          {/* Información de contacto */}
          <motion.div
            className="space-y-6 text-gray-800 dark:text-gray-300"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h3 className="text-lg font-semibold text-[var(--primary)]">
                {t("phone")}
              </h3>
              <p className="text-white hover:text-[var(--secondary)] transition">
                🇪🇸 <a href="tel:+34622080113">+34 *** *** ***</a>
              </p>
              <p className="text-white hover:text-[var(--secondary)] transition">
                🇪🇸 <a href="tel:+34622080113">+34 *** *** ***</a>
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[var(--primary)]">
                {t("social")}
              </h3>
              <div className="flex gap-4 mt-2 text-2xl">
                <a
                  href="https://twitter.com/#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[var(--secondary)] transition"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://instagram.com/#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[var(--secondary)] transition"
                >
                  <FaInstagram />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Mapa --- */}
      <motion.div
        className="h-120 w-full overflow-hidden shadow-lg mt-15 mb-10 rounded-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center my-2 pl-10 pr-10">
          <a
            href="https://www.google.com/maps?q=Estepona"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--primary)] hover:text-[var(--secondary)] font-semibold transition"
          >
            {t("locationTitle")} · C. ****** · 29680 - Estepona (Málaga)
          </a>
        </div>
        <Map t={t} />
      </motion.div>
    </>
  );
}
