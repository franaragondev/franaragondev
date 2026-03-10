"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Globe } from "lucide-react";

/**
 * MobileMenu Component
 * * A slide-in navigation overlay designed for small viewports.
 * It manages focal trap-like behavior, spring-based animations, and 
 * dynamic locale-aware route resolution.
 */

type MobileMenuProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  isHeaderVisible: boolean;
};

const locales = [
  { code: "es", key: "es" },
  { code: "en", key: "en" },
];

export default function MobileMenu({ isOpen, onCloseAction, isHeaderVisible }: MobileMenuProps) {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("menu");
  const tLang = useTranslations("language");
  const HEADER_HEIGHT = 72;

  /**
   * Locale Switcher Logic:
   * * Sophisticated path replacement to ensure the user remains on the 
   * same relative segment while switching languages. 
   * It accounts for the default locale prefixing logic in Next.js.
   */
  function changeLocale(newLocale: string) {
    const defaultLocale = "en";
    const pathWithLocale = locale === defaultLocale && !pathname.startsWith(`/${locale}`)
        ? `/${locale}${pathname}`
        : pathname;

    const newPathname = pathWithLocale.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
    onCloseAction();
  }

  /**
   * Enhanced Anchor Navigation:
   * * Prevents default link behavior for internal hash links to execute
   * a smooth scroll with a calculated offset, accounting for the 
   * global sticky header height.
   */
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, hash: string) => {
    if (hash.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(hash);
      if (element) {
        const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - HEADER_HEIGHT;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
      onCloseAction();
    }
  };

  const basePath = `/${locale}`;

  return (
    <AnimatePresence>
      {isOpen && (
        /* Backdrop Layer: Handles dismissal through click-outside behavior */
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onCloseAction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Main Sidebar: Utilizes spring physics for a high-fidelity feel */}
          <motion.aside
            className="fixed top-[72px] left-0 h-[calc(100vh-72px)] w-full max-w-sm bg-[#F5F5F7]/95 dark:bg-[#111111]/95 backdrop-blur-2xl border-r border-black/5 dark:border-white/10 shadow-2xl z-50 p-8 flex flex-col"
            onClick={(e) => e.stopPropagation()} // Prevents event bubbling to the backdrop
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <nav className="flex flex-col space-y-6 mt-4">
              {[
                { href: `${basePath}#expertise`, label: t("expertise") },
                { href: `${basePath}#about`, label: t("about") },
                { href: `${basePath}#projects`, label: t("projects") },
                { href: `${basePath}#experience`, label: t("experience") },
                { href: `${basePath}#contact`, label: t("contact") },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={(e) => handleClick(e, href.split("#")[1] ? `#${href.split("#")[1]}` : "")}
                  className="text-3xl font-bold tracking-tighter text-[#1D1D1F] dark:text-white hover:opacity-70 transition-opacity"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Language Selection Footer */}
            <div className="mt-auto pt-8 border-t border-black/5 dark:border-white/10">
              <div className="flex items-center gap-2 mb-4 text-[#86868B]">
                <Globe className="w-5 h-5" />
                <h3 className="text-sm font-semibold tracking-widest uppercase">
                  {t("language")}
                </h3>
              </div>
              <ul className="flex gap-4">
                {locales.map(({ code, key }) => (
                  <li key={code} className="flex-1">
                    <button
                      onClick={() => changeLocale(code)}
                      disabled={code === locale}
                      className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        code === locale
                          ? "bg-[#1D1D1F] text-white dark:bg-white dark:text-black shadow-md"
                          : "bg-black/5 dark:bg-white/5 text-[#1D1D1F] dark:text-white hover:bg-black/10 dark:hover:bg-white/10"
                      }`}
                    >
                      {tLang(key)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}