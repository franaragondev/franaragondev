"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import Logo from "@/assets/Logo";
import { motion } from "framer-motion";
import { FaInstagram, FaFacebook, FaEnvelope, FaPhone } from "react-icons/fa";

export default function Footer() {
  const t = useTranslations("footer");
  const tPrivacy = useTranslations("privacyPolicy");
  const tCookies = useTranslations("cookiesPolicy");
  const locale = useLocale();

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="text-white pt-12 pb-8">
      <motion.div
        className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.15 }}
      >
        {/* Columna 1: Logo + Slogan + Redes */}
        <motion.div
          className="flex flex-col items-center md:items-start gap-4"
          variants={fadeInUp}
        >
          <Logo className="w-32 h-32 text-[var(--primary)] hover:text-[var(--secondary)] transition" />
          <p className="text-gray-300 max-w-xs text-center md:text-left">
            {t("slogan")}
          </p>
          <div className="flex gap-4 mt-2 text-2xl">
            <a
              href="https://facebook.com/#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--secondary)] transition-transform transform hover:-translate-y-1"
            >
              <FaFacebook />
            </a>
            <a
              href="https://instagram.com/#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--secondary)] transition-transform transform hover:-translate-y-1"
            >
              <FaInstagram />
            </a>
          </div>
        </motion.div>

        {/* Columna 2: Contacto */}
        <motion.div variants={fadeInUp}>
          <h4 className="font-semibold text-lg text-[var(--primary)] mb-4">
            {t("contactTitle")}
          </h4>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center gap-2">
              <FaPhone className="text-[var(--secondary)]" />
              <a
                href="tel:+34622080113"
                className="hover:text-[var(--secondary)] transition"
              >
                +34 *** *** ***
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-[var(--secondary)]" />
              <a
                href="mailto:info@empresa.com"
                className="hover:text-[var(--secondary)] transition"
              >
                info@empresa.com
              </a>
            </li>
          </ul>
        </motion.div>

        {/* Columna 3: Legal */}
        <motion.div variants={fadeInUp}>
          <h4 className="font-semibold text-lg text-[var(--primary)] mb-4">
            {t("legalTitle")}
          </h4>
          <nav className="flex flex-col gap-2 mb-6">
            <Link
              href={`/${locale}/privacidad`}
              className="hover:text-[var(--secondary)] transition"
            >
              {tPrivacy("title")}
            </Link>
            <Link
              href={`/${locale}/cookies`}
              className="hover:text-[var(--secondary)] transition"
            >
              {tCookies("title")}
            </Link>
          </nav>
        </motion.div>
      </motion.div>

      {/* Créditos */}
      <motion.div
        className="mt-12 text-center text-gray-500 text-sm border-t border-gray-800 pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span>{t("left")}</span> ·{" "}
        {t.rich("right", {
          link: (chunks) => (
            <a
              href="https://franaragondev.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--secondary)] transition"
            >
              {chunks}
            </a>
          ),
        })}
      </motion.div>
    </footer>
  );
}
