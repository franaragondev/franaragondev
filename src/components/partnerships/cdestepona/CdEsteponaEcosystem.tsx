"use client";

import { useTranslations } from "next-intl";

type EcosystemItem = { name: string; status: string; description: string };

export default function CdEsteponaEcosystem() {
  const t = useTranslations();

  const items = t.raw("partnerships.cdestepona.ecosystem.items") as EcosystemItem[];

  return (
    <section className="py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">
          {t("partnerships.cdestepona.ecosystem.title")}
        </h2>

        <p className="text-xl leading-relaxed text-[#6E6E73] mb-16">
          {t("partnerships.cdestepona.ecosystem.paragraph")}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.name}
              className="p-8 rounded-3xl bg-[#F5F5F7] dark:bg-[#1C1C1E]"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6E6E73] mb-4">
                {item.status}
              </p>

              <h3 className="text-2xl font-bold mb-4">{item.name}</h3>

              <p className="leading-relaxed text-[#6E6E73]">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
