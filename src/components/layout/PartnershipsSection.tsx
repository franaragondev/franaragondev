"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ArrowUpRight } from "lucide-react";

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
            {t("partnerships.baguira.eyebrow")}
          </p>

          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-[#1D1D1F] dark:text-[#F5F5F7]">
            Partnerships
          </h2>
        </div>

        {/* Featured Partnership */}
        <div className="max-w-5xl mx-auto">
          <Link
            href={`/${locale}/partnerships/baguira-suites`}
            className="group block rounded-[2.5rem] border border-black/5 dark:border-white/10 bg-[#F5F5F7] dark:bg-[#1C1C1E] p-10 md:p-16 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#6E6E73] mb-4">
                  {t("partnerships.baguira.eyebrow")}
                </p>

                <div className="flex items-center gap-4 mb-8">
                  <Image
                    src="/partnerships/baguira/logo.png"
                    alt="Baguira Suites Experiences"
                    width={140}
                    height={100}
                    className="h-[100px] w-auto object-contain flex-shrink-0"
                  />

                  <div>
                    <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
                      {t("partnerships.baguira.title")}
                    </h3>

                    <p className="text-sm uppercase tracking-[0.25em] text-[#6E6E73] mt-2">
                      {t("partnerships.baguira.label")}
                    </p>
                  </div>
                </div>

                <p className="text-lg md:text-xl leading-relaxed text-[#515154] dark:text-[#A1A1A6]">
                  {t("partnerships.baguira.subtitle")}
                </p>

                <div className="flex flex-wrap gap-3 mt-8">
                  {[
                    "Calais, France",
                    "Next.js",
                    "TypeScript",
                    "Stripe",
                    "SEO",
                    "i18n",
                  ].map((item) => (
                    <span
                      key={item}
                      className="px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase bg-black/5 dark:bg-white/5 text-[#6E6E73]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-shrink-0">
                <div className="flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-[#1D1D1F] dark:text-white">
                  View Case Study
                  <ArrowUpRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
