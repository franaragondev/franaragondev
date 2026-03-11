"use client";

import { useTranslations } from "next-intl";

/**
 * Footer Component
 * * Provides the final brand touchpoint and strategic positioning.
 * The layout uses a minimalist "Apple-style" caption system with high
 * letter-spacing (tracking) to convey premium quality and professional rigor.
 */
export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="py-12 border-t border-black/5 dark:border-white/5 bg-white dark:bg-[#000000]">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center gap-4">
        {/* Attribution & Core Statement:
            The use of [0.2em] tracking and uppercase is a hallmark of 
            utility-focused premium design systems.
        */}
        <div className="flex flex-col gap-2">
          <span className="text-[#515154] dark:text-[#A1A1A6] text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase">
            © 2026 Fran Aragón. {t("center")}
          </span>

          {/* Partnership Status Indicator:
              Reinforces the 'Strategic Partner' positioning and implements 
              a subtle scarcity signal to high-ticket clients.
          */}
          <div className="flex items-center justify-center gap-2">
            <p className="text-[#6E6E73] text-[9px] font-bold uppercase tracking-[0.15em]">
              {t("status")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
