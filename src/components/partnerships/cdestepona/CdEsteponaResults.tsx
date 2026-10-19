"use client";

import { useTranslations } from "next-intl";

export default function CdEsteponaResults() {
  const t = useTranslations();

  /** Lighthouse 12.8 lab medians, measured 19 Oct 2026 (see results.note). */
  const metrics = [
    { label: t("partnerships.cdestepona.results.metrics.mobile"), value: "91" },
    { label: t("partnerships.cdestepona.results.metrics.desktop"), value: "99" },
    { label: t("partnerships.cdestepona.results.metrics.accessibility"), value: "94" },
    { label: t("partnerships.cdestepona.results.metrics.seo"), value: "100" },
  ];

  return (
    <section className="py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">
          {t("partnerships.cdestepona.results.title")}
        </h2>

        <p className="text-xl leading-relaxed text-[#6E6E73] mb-16">
          {t("partnerships.cdestepona.results.paragraph")}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="p-8 rounded-3xl bg-[#F5F5F7] dark:bg-[#1C1C1E]"
            >
              <div className="text-5xl font-bold mb-3">{metric.value}</div>

              <div className="text-sm uppercase tracking-widest text-[#6E6E73]">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm leading-relaxed text-[#6E6E73]">
          {t("partnerships.cdestepona.results.note")}
        </p>

        <div className="mt-24">
          <h3 className="text-2xl font-bold mb-6">
            {t("partnerships.cdestepona.evolution.title")}
          </h3>

          <p className="text-xl leading-relaxed text-[#6E6E73]">
            {t("partnerships.cdestepona.evolution.paragraph")}
          </p>
        </div>
      </div>
    </section>
  );
}
