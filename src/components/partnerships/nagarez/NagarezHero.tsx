"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { havnUrl, nagarezWebsiteUrl } from "./links";

export default function NagarezHero() {
  const t = useTranslations();
  const locale = useLocale();

  const badges = ["Next.js", "TypeScript", "HAVN", "Editorial Design", "i18n"];

  return (
    <section className="pt-40 pb-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#6E6E73]">
          {t("partnerships.nagarez.eyebrow")}
        </p>

        <h1 className="mt-6 text-6xl md:text-8xl font-bold tracking-tighter text-[#1D1D1F] dark:text-[#F5F5F7]">
          {t("partnerships.nagarez.title")}
        </h1>

        <p className="mt-8 max-w-4xl text-xl md:text-2xl leading-relaxed text-[#6E6E73]">
          {t("partnerships.nagarez.subtitle")}
        </p>

        <div className="flex flex-wrap gap-3 mt-10">
          {badges.map((badge) => (
            <span
              key={badge}
              className="px-4 py-2 rounded-full bg-[#F5F5F7] dark:bg-[#1C1C1E] text-xs font-semibold uppercase tracking-widest"
            >
              {badge}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mt-12">
          <a
            href={nagarezWebsiteUrl(locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-[#1D1D1F] text-white font-semibold hover:opacity-90 transition-opacity"
          >
            {t("partnerships.nagarez.visitPlatform")}
            <ArrowUpRight size={18} />
          </a>

          <a
            href={havnUrl(locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl border border-black/10 dark:border-white/10 font-semibold"
          >
            {t("partnerships.nagarez.havn.linkLabel")}
            <ArrowUpRight size={18} />
          </a>

          <Link
            href={`/${locale}`}
            className="inline-flex items-center px-6 py-4 rounded-2xl border border-black/10 dark:border-white/10 font-semibold"
          >
            {t("partnerships.nagarez.backHome")}
          </Link>
        </div>

        <p className="mt-10 max-w-4xl text-sm leading-relaxed text-[#6E6E73]">
          {t("partnerships.nagarez.havnNote")}
        </p>
      </div>
    </section>
  );
}
