"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Globe, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Supported locale identifiers for route parsing.
 */
const SUPPORTED_LOCALES = ["es", "en"];

/**
 * Locale configuration for the UI display.
 */
const locales = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
];

/**
 * UserDropdown Component
 * * A high-fidelity language selector that implements glassmorphism, 
 * accessibility-compliant focus management, and localized route orchestration.
 * Designed to emulate native system-level menu behaviors (macOS/iOS style).
 */
export default function UserDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Orchestrates the locale switching logic by parsing the current URL path.
   * * It preserves the relative path segments while replacing the locale identifier,
   * handling edge cases for the default locale prefixing in Next.js.
   * * @param newLocale - The target language code (e.g., 'en', 'es').
   */
  const changeLocale = (newLocale: string) => {
    const segments = pathname.split("/").filter(Boolean);
    const currentLocale = SUPPORTED_LOCALES.includes(segments[0]) ? segments[0] : null;
    const restOfPath = currentLocale ? segments.slice(1).join("/") : segments.join("/");

    // Construct the new path: en is treated as the root locale (optional prefix)
    const newPathname = newLocale === "en"
        ? restOfPath ? `/${restOfPath}` : "/"
        : restOfPath ? `/${newLocale}/${restOfPath}` : `/${newLocale}`;

    if (newPathname === pathname) {
      router.refresh();
    } else {
      router.replace(newPathname);
    }

    setOpen(false);
  };

  /**
   * Effect: Click-Outside Listener
   * * Enhances UX by closing the dropdown automatically when the user clicks 
   * away from the component.
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      {/* Trigger Button: Visual state reflects the dropdown status */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-2 rounded-full px-3 py-1.5 transition-all duration-300 focus:outline-none ${
          open 
            ? "bg-black/5 dark:bg-white/10 text-[#1D1D1F] dark:text-white" 
            : "text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white"
        }`}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Globe className="w-[18px] h-[18px]" />
        <span className="text-[12px] font-bold uppercase tracking-widest">{locale}</span>
      </button>

      <AnimatePresence>
        {open && (
          /* Animated Dropdown Menu: Powered by Framer Motion for high-fidelity interaction */
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }} // Custom Apple-style easing
            className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-2xl border border-black/[0.05] dark:border-white/[0.08] bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)] z-50 p-1.5"
            role="menu"
          >
            <div className="flex flex-col gap-0.5">
              {locales.map(({ code, label }) => {
                const isActive = code === locale;
                return (
                  <button
                    key={code}
                    role="menuitem"
                    onClick={() => changeLocale(code)}
                    disabled={isActive}
                    className={`group flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 ${
                      isActive 
                        ? "bg-black/[0.03] dark:bg-white/[0.03] text-[#1D1D1F] dark:text-white cursor-default" 
                        : "text-[#515154] dark:text-[#A1A1A6] hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#1D1D1F] dark:hover:text-white"
                    }`}
                  >
                    {label}
                    {/* Active State Indicator */}
                    {isActive && (
                      <Check className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}