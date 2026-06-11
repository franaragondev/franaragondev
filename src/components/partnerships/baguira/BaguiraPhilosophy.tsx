"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export default function BaguiraPhilosophy() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section className="py-40 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-sm font-semibold tracking-[0.3em] uppercase text-[#6E6E73] mb-10">
          {t("philosophy.title")}
        </h2>

        <blockquote className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
          {t("philosophy.quote")}
        </blockquote>

        <div className="mt-20">
          <h3 className="text-3xl font-bold mb-4">{t("cta.title")}</h3>

          <p className="max-w-3xl text-lg text-[#6E6E73] mb-8">
            {t("cta.paragraph")}
          </p>

          <Link
            href={`/${locale}#contact`}
            className="inline-flex items-center px-6 py-4 rounded-2xl bg-[#1D1D1F] text-white font-semibold"
          >
            {t("cta.button")}
          </Link>
        </div>
      </div>
    </section>
  );
}
