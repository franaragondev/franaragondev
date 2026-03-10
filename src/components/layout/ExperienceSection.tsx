"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

/**
 * ExperienceSection Component
 * * Renders a vertical chronological timeline showcasing professional trajectory.
 * Designed with a focus on information density, readability, and visual hierarchy.
 * Utilizes a "Bento-grid" card aesthetic paired with a semantic vertical timeline.
 */
export default function ExperienceSection() {
  const t = useTranslations("experience");

  /**
   * Data Normalization:
   * Professional experiences are mapped into an array to maintain a DRY (Don't Repeat Yourself) 
   * architecture, facilitating easy updates and consistent rendering logic.
   */
  const experiences = [
    {
      id: "solutia",
      logo: "/experience/solutia.jpg",
      role: t("solutia.title"),
      company: "Solutia s.r.o.",
      period: t("solutia.period"),
      responsibilities: [
        t("solutia.point1"),
        t("solutia.point2"),
        t("solutia.point3"),
      ],
    },
    {
      id: "adidas",
      logo: "/experience/adidas.png",
      role: t("adidas.title"),
      company: "adidas",
      period: t("adidas.period"),
      responsibilities: [
        t("adidas.point1"),
        t("adidas.point2"),
        t("adidas.point3"),
        t("adidas.point4"),
      ],
    },
    {
      id: "cei",
      logo: "/experience/cei.png",
      role: t("cei.title"),
      company: "CEI Escuela de Diseño y Marketing",
      period: t("cei.period"),
      responsibilities: [t("cei.point1"), t("cei.point2")],
    },
    {
      id: "gransliving",
      logo: "/experience/gransliving.png",
      role: t("gransliving.title"),
      company: "GransLiving",
      period: t("gransliving.period"),
      responsibilities: [t("gransliving.point1"), t("gransliving.point2"), t("gransliving.point3")],
    },
  ];

  return (
    <section
      id="experience"
      className="relative px-4 md:px-12 py-32 bg-[#F5F5F7] dark:bg-[#000000] scroll-mt-24 border-b border-black/5 dark:border-white/5"
    >
      {/* Section Title with high-impact tracking for modern aesthetic */}
      <div className="text-center mb-24">
        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-[#1D1D1F] dark:text-[#F5F5F7]">
          {t("title")}
        </h2>
      </div>

      {/* Vertical Timeline Container:
          Implements a left-border as the timeline axis.
          Responsiveness is handled via padding and max-width constraints.
      */}
      <div className="max-w-4xl mx-auto relative border-l border-[#D2D2D7] dark:border-[#333336] pl-8 space-y-16">
        {experiences.map(({ id, logo, role, company, period, responsibilities }) => (
          <div key={id} className="relative group">
           
            {/* Timeline Anchor Point: 
                Absolutely positioned relative to the parent to align perfectly with the border-l.
                Includes a subtle scale animation on group hover for enhanced interactivity.
            */}
            <span className="absolute left-[-37px] top-6 w-[10px] h-[10px] bg-[#1D1D1F] dark:bg-white rounded-full ring-4 ring-[#F5F5F7] dark:ring-[#000000] transition-transform duration-300 group-hover:scale-150" />

            {/* Experience Card: Implementing semantic HTML5 <article> for improved SEO and Accessibility */}
            <article className="relative bg-white dark:bg-[#1C1C1E] rounded-[2rem] p-8 md:p-10 border border-black/5 dark:border-white/5 shadow-sm transition-shadow duration-500 hover:shadow-xl">
              
              {/* Header: Company Identity & Role */}
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                {/* Logo Container with consistent aspect-ratio handling */}
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center p-3 shadow-sm">
                  <Image
                    src={logo}
                    alt={`Logo for ${company}`}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-[#1D1D1F] dark:text-white">
                    {role}
                  </h3>
                  <p className="text-[#86868B] text-sm uppercase tracking-widest font-semibold mt-1">
                    {company} <span className="mx-2 text-[#D2D2D7]">•</span> {period}
                  </p>
                </div>
              </div>

              {/* Responsibilities List: Focused on typography and list-style refinement */}
              <ul className="space-y-3">
                {responsibilities.map((point, idx) => (
                  <li key={idx} className="flex text-[#515154] dark:text-[#A1A1A6] text-base md:text-lg leading-relaxed tracking-tight font-medium">
                    {/* Visual indicator using an opacity-reduced arrow for direction without clutter */}
                    <span className="text-[#1D1D1F] dark:text-white mr-3 mt-1.5 opacity-40" aria-hidden="true">→</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}