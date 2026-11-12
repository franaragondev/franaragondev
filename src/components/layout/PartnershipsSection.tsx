"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ArrowUpRight } from "lucide-react";

type Partnership = {
  key: string;
  path: string;
  location: string;
  logo: {
    src: string;
    alt: string;
    width: number;
    height: number;
    /** Tailwind height class: emblems need more height than wide wordmarks to read at the same weight. */
    heightClass: string;
    /** Dark wordmarks are inverted so they stay legible on the dark card. */
    invertOnDark?: boolean;
  };
  tags: readonly string[];
};

const PARTNERSHIPS: readonly Partnership[] = [
  {
    key: "baguira",
    path: "partnerships/baguira-suites",
    location: "Calais, France",
    logo: { src: "/partnerships/baguira/logo.png", alt: "Baguira Suites Experiences", width: 140, height: 100, heightClass: "h-24" },
    tags: ["Next.js", "Stripe", "SEO", "i18n"],
  },
  {
    key: "cdestepona",
    path: "partnerships/cd-estepona-fans",
    location: "Estepona, Spain",
    logo: { src: "/partnerships/cdestepona/logo.png", alt: "CD Estepona Fans", width: 100, height: 100, heightClass: "h-24" },
    tags: ["Next.js", "SwiftUI", "Kotlin", "Push"],
  },
  {
    key: "nagarez",
    path: "partnerships/nagarez-visuals",
    location: "Prague · Calais",
    logo: {
      src: "/partnerships/nagarez/logo.png",
      alt: "Nagarez Visuals",
      width: 1200,
      height: 456,
      heightClass: "h-14",
      invertOnDark: true,
    },
    tags: ["Next.js", "HAVN", "Editorial", "i18n"],
  },
];

export default function PartnershipsSection() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section
      id="partnerships"
      className="relative py-32 border-b border-black/5 dark:border-white/5 scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#6E6E73] mb-4">
            {t("partnerships.sectionEyebrow")}
          </p>

          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-[#1D1D1F] dark:text-[#F5F5F7]">
            Partnerships
          </h2>
        </div>

        {/* Partnership cards: one column on phones, two on tablets, three on desktop */}
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PARTNERSHIPS.map(({ key, path, location, logo, tags }, index) => (
            <li
              key={key}
              className={
                // An odd last card spans the tablet row instead of leaving a gap.
                index === PARTNERSHIPS.length - 1 && PARTNERSHIPS.length % 2 === 1
                  ? "md:col-span-2 lg:col-span-1"
                  : undefined
              }
            >
              <Link
                href={`/${locale}/${path}`}
                className="group flex h-full flex-col rounded-[2rem] border border-black/5 dark:border-white/10 bg-[#F5F5F7] dark:bg-[#1C1C1E] p-3 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* Logo plate */}
                <div className="flex h-40 items-center justify-center rounded-[1.5rem] bg-white dark:bg-black/30 px-8">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width}
                    height={logo.height}
                    sizes="200px"
                    className={`${logo.heightClass} w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-105 ${
                      logo.invertOnDark ? "dark:invert" : ""
                    }`}
                  />
                </div>

                <div className="flex flex-1 flex-col px-5 pt-7 pb-5">
                  <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#6E6E73]">
                    {t(`partnerships.${key}.sector`)} · {location}
                  </p>

                  <h3 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
                    {t(`partnerships.${key}.title`)}
                  </h3>

                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#6E6E73]">
                    {t(`partnerships.${key}.label`)}
                  </p>

                  <p className="mt-5 line-clamp-4 leading-relaxed text-[#515154] dark:text-[#A1A1A6]">
                    {t(`partnerships.${key}.subtitle`)}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {tags.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-black/5 dark:bg-white/5 text-[#6E6E73]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-8">
                    <div className="flex items-center justify-between border-t border-black/5 dark:border-white/10 pt-5 text-xs font-bold tracking-widest uppercase text-[#1D1D1F] dark:text-white">
                      View Case Study
                      <ArrowUpRight
                        size={18}
                        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
