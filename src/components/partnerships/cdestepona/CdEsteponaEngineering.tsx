"use client";

import { useTranslations } from "next-intl";

type Decision = { title: string; text: string };

export default function CdEsteponaEngineering() {
  const t = useTranslations();

  const decisions = t.raw("partnerships.cdestepona.engineering.items") as Decision[];

  return (
    <section className="py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-16">
          {t("partnerships.cdestepona.engineering.title")}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {decisions.map((decision) => (
            <div
              key={decision.title}
              className="p-8 md:p-10 rounded-3xl bg-[#F5F5F7] dark:bg-[#1C1C1E]"
            >
              <h3 className="text-2xl font-bold mb-4">{decision.title}</h3>

              <p className="text-lg leading-relaxed text-[#6E6E73]">{decision.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
