"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

/**
 * AboutSection Component
 * * Provides a biographical overview and professional introduction.
 * Design follows a minimalist aesthetic with high-contrast typography
 * and an Apple-inspired "Bento" layout for desktop screens.
 */
export default function AboutSection() {
  const t = useTranslations("about");

  return (
    <section
      id="about"
      /* scroll-mt-24 ensures the section title isn't obscured by the 
         sticky header when navigating via anchor links.
      */
      className="relative px-4 md:px-12 py-32 bg-[#F5F5F7] dark:bg-[#000000] scroll-mt-24 border-b border-black/5 dark:border-white/5"
    >
      {/* Section Header */}
      <div className="text-center mb-20">
        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-[#1D1D1F] dark:text-[#F5F5F7]">
          {t("title")}
        </h2>
      </div>

      {/* Content Grid: 1 Column on Mobile, 2 Columns on Desktop */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Profile Image Container */}
        <div className="flex justify-center">
          <div className="w-56 h-56 md:w-72 md:h-72 relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-black/5 dark:border-white/10">
            <Image
              src="/fran.png"
              alt="Fran Aragón"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 224px, 288px"
              priority // Prioritizing load for above-the-fold content
            />
          </div>
        </div>

        {/* Biographical Content */}
        <div>
          {/* Accessible hidden header for SEO and Screen Readers */}
          <h3 className="text-2xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] mb-4 hidden sr-only">
            Fran Aragón
          </h3>

          {/* Rich text description: 
              dangerouslySetInnerHTML is utilized here to support localized 
              HTML tags (like <br/> or <strong>) within the translation files.
          */}
          <p
            className="text-[#515154] dark:text-[#A1A1A6] leading-relaxed text-lg md:text-xl tracking-tight font-medium"
            dangerouslySetInnerHTML={{ __html: t("description") }}
          ></p>

          {/* CTA: Resume Download */}
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-8 px-8 py-3 rounded-full bg-[#1D1D1F] dark:bg-white text-white dark:text-black font-semibold text-sm tracking-wide hover:scale-105 transition-transform duration-300"
          >
            {t("viewCV")}
          </a>
        </div>
      </div>
    </section>
  );
}
