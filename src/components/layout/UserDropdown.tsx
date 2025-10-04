"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Globe, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SUPPORTED_LOCALES = ["es", "en"];

export default function UserDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tLang = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const setLocaleCookie = useCallback((locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  }, []);

  const changeLocale = useCallback(
    (newLocale: string) => {
      if (newLocale === locale) {
        setOpen(false);
        return;
      }

      setLocaleCookie(newLocale);

      const segments = pathname.split("/").filter(Boolean);
      const currentLocale = SUPPORTED_LOCALES.includes(segments[0])
        ? segments[0]
        : null;
      const restOfPath = currentLocale
        ? segments.slice(1).join("/")
        : segments.join("/");

      const newPathname =
        newLocale === "es"
          ? restOfPath
            ? `/${restOfPath}`
            : "/"
          : restOfPath
          ? `/${newLocale}/${restOfPath}`
          : `/${newLocale}`;

      if (newPathname === pathname) {
        router.refresh();
      } else {
        router.replace(newPathname);
      }

      setOpen(false);
    },
    [locale, pathname, router, setLocaleCookie]
  );

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative flex" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded focus:outline-none text-[var(--primary)] hover:text-[var(--secondary)] transition"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="User menu"
      >
        <Globe className="w-5 h-5" />
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-10 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden"
            role="menu"
          >
            <ul>
              {SUPPORTED_LOCALES.map((code) => (
                <li key={code}>
                  <button
                    className={`cursor-pointer flex items-center justify-between w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-[var(--primary)] hover:text-white transition ${
                      code === locale
                        ? "bg-[var(--secondary)] text-gray-900 font-semibold"
                        : ""
                    }`}
                    onClick={() => changeLocale(code)}
                    disabled={code === locale}
                  >
                    {tLang(code)}
                    {code === locale && <Check className="w-4 h-4" />}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
