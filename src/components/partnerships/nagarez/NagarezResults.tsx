"use client";

import { useFormatter, useTranslations } from "next-intl";

/** Google PageSpeed Insights, mobile, single run on 12 Nov 2026 (see results.note). */
const SCORES = [
  { key: "performance", value: 96 },
  { key: "accessibility", value: 100 },
  { key: "bestPractices", value: 100 },
  { key: "seo", value: 100 },
] as const;

const VITALS = [
  { key: "fcp", value: 0.9, unit: "second" },
  { key: "lcp", value: 2.7, unit: "second" },
  { key: "tbt", value: 10, unit: "millisecond" },
  { key: "cls", value: 0 },
] as const;

const tile = "flex flex-col-reverse justify-end p-8 rounded-3xl bg-[#F5F5F7] dark:bg-[#1C1C1E]";

export default function NagarezResults() {
  const t = useTranslations();
  const format = useFormatter();

  return (
    <section className="py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">
          {t("partnerships.nagarez.results.title")}
        </h2>

        <p className="text-xl leading-relaxed text-[#6E6E73] mb-16">
          {t("partnerships.nagarez.results.paragraph")}
        </p>

        <h3 className="text-2xl font-bold mb-8">
          {t("partnerships.nagarez.results.scoresTitle")}
        </h3>

        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {SCORES.map((score) => (
            <div key={score.key} className={tile}>
              <dt className="text-sm uppercase tracking-widest text-[#6E6E73]">
                {t(`partnerships.nagarez.results.scores.${score.key}`)}
              </dt>
              <dd className="text-5xl font-bold mb-3">{score.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-24">
          <h3 className="text-2xl font-bold mb-8">
            {t("partnerships.nagarez.results.vitalsTitle")}
          </h3>

          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {VITALS.map((vital) => (
              <div key={vital.key} className={tile}>
                <dt className="text-sm uppercase tracking-widest text-[#6E6E73]">
                  {t(`partnerships.nagarez.results.vitals.${vital.key}`)}
                </dt>
                <dd className="text-5xl font-bold mb-3">
                  {"unit" in vital
                    ? format.number(vital.value, {
                        style: "unit",
                        unit: vital.unit,
                        unitDisplay: "short",
                        maximumFractionDigits: 1,
                      })
                    : format.number(vital.value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="mt-8 text-sm leading-relaxed text-[#6E6E73]">
          {t("partnerships.nagarez.results.note")}
        </p>
      </div>
    </section>
  );
}
