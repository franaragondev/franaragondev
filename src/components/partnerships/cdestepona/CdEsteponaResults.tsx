"use client";

import { useFormatter, useTranslations } from "next-intl";

type Metric = { key: string; value: number; fractionDigits?: number };

/**
 * Snapshot from the CD Estepona Fans admin dashboard, approx. 20 Sep–19 Oct 2026
 * (see results.sourceNote). Usage comes from GA4; search figures are the
 * dashboard's aggregate of the top 10 Search Console queries.
 */
const METRIC_GROUPS: { key: "reach" | "search"; metrics: Metric[] }[] = [
  {
    key: "reach",
    metrics: [
      { key: "visits", value: 3172 },
      { key: "activeUsers", value: 1361 },
      { key: "pageViews", value: 5545 },
    ],
  },
  {
    key: "search",
    metrics: [
      { key: "clicks", value: 607 },
      { key: "impressions", value: 8271 },
      { key: "position", value: 3.6, fractionDigits: 1 },
    ],
  },
];

export default function CdEsteponaResults() {
  const t = useTranslations();
  const format = useFormatter();

  /** Lighthouse 12.8 lab medians, measured 19 Oct 2026 (see results.note). */
  const performance = [
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

        <div className="space-y-16">
          {METRIC_GROUPS.map((group) => (
            <div key={group.key}>
              <h3 className="text-2xl font-bold mb-8">
                {t(`partnerships.cdestepona.results.${group.key}.title`)}
              </h3>

              <dl className="grid md:grid-cols-3 gap-6">
                {group.metrics.map((metric) => (
                  <div
                    key={metric.key}
                    className="flex flex-col-reverse justify-end p-8 rounded-3xl bg-[#F5F5F7] dark:bg-[#1C1C1E]"
                  >
                    <dt className="text-sm uppercase tracking-widest text-[#6E6E73]">
                      {t(`partnerships.cdestepona.results.${group.key}.${metric.key}`)}
                    </dt>

                    <dd className="text-5xl font-bold mb-3">
                      {format.number(metric.value, {
                        minimumFractionDigits: metric.fractionDigits ?? 0,
                        maximumFractionDigits: metric.fractionDigits ?? 0,
                      })}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm leading-relaxed text-[#6E6E73]">
          {t("partnerships.cdestepona.results.sourceNote")}
        </p>

        <div className="mt-24">
          <h3 className="text-2xl font-bold mb-8">
            {t("partnerships.cdestepona.results.performanceTitle")}
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performance.map((metric) => (
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
        </div>

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
