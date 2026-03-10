"use client";

import { useTranslations } from "next-intl";
import { Box, Layers, Zap } from "lucide-react";

/**
 * ExpertiseSection Component
 * * A high-fidelity section designed to communicate the engineer's core 
 * value propositions. It utilizes a three-column bento-grid layout 
 * inspired by minimalist design systems.
 */
export default function ExpertiseSection() {
  const t = useTranslations("expertise");

  /**
   * Normalized Service Schema:
   * Consolidating data into a single source of truth to maintain 
   * clean mapping logic and consistent visual styling.
   */
  const services = [
    {
      id: "saas",
      title: t("saas.title"),
      description: t("saas.description"),
      icon: <Layers className="w-10 h-10" />,
    },
    {
      id: "performance",
      title: t("performance.title"),
      description: t("performance.description"),
      icon: <Zap className="w-10 h-10" />,
    },
    {
      id: "architecture",
      title: t("architecture.title"),
      description: t("architecture.description"),
      icon: <Box className="w-10 h-10" />,
    },
  ];

  return (
    <section
      id="expertise"
      /* scroll-mt-24 prevents the fixed header from overlapping 
         the title during anchor-link navigation. 
      */
      className="relative px-4 md:px-12 py-32 bg-white dark:bg-[#111111] scroll-mt-24 border-b border-black/5 dark:border-white/5"
    >
      {/* Section Header with high-impact tracking for modern aesthetic */}
      <div className="text-center mb-24">
        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-[#1D1D1F] dark:text-[#F5F5F7]">
          {t("label")}
        </h2>
      </div>

      {/* Grid Layout: Optimized for fluid responsiveness from mobile to 1024px+ viewports */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map(({ id, title, description, icon }) => (
          <div
            key={id}
            /**
             * Card Engineering:
             * Implements complex hover states (translate-y and shadow expansion)
             * to provide immediate tactile feedback during user interaction.
             */
            className="group relative p-10 md:p-12 rounded-[2.5rem] bg-[#F5F5F7] dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-black/40"
          >
            {/* Visual Anchor: Icon with secondary micro-interaction (scale) */}
            <div className="mb-8 text-[#1D1D1F] dark:text-white transition-transform duration-500 group-hover:scale-110">
              {icon}
            </div>

            <h3 className="text-2xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] mb-4">
              {title}
            </h3>

            {/* Typography: Leverages high-contrast grays to ensure high legibility 
                and WCAG accessibility compliance in both color modes. 
            */}
            <p className="text-[#515154] dark:text-[#A1A1A6] text-lg leading-relaxed font-medium tracking-tight">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}