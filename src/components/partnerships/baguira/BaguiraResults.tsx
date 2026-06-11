"use client";

import { useTranslations } from "next-intl";

export default function BaguiraResults() {
  const t = useTranslations();

  const metrics = [
    {
      label: "Mobile Lighthouse",
      value: "96",
    },
    {
      label: "Desktop Lighthouse",
      value: "98",
    },
    {
      label: "Accessibility",
      value: "100",
    },
    {
      label: "Best Practices",
      value: "100",
    },
  ];

  return (
    <section className="py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">
          {t("results.title")}
        </h2>

        <p className="text-xl leading-relaxed text-[#6E6E73] mb-16">
          {t("results.paragraph")}
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
      </div>
    </section>
  );
}
