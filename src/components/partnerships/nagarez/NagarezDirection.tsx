"use client";

import { useTranslations } from "next-intl";

type Principle = { title: string; text: string };

export default function NagarezDirection() {
  const t = useTranslations();

  const principles = t.raw("partnerships.nagarez.direction.items") as Principle[];

  return (
    <section className="py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">
          {t("partnerships.nagarez.direction.title")}
        </h2>

        <p className="text-xl leading-relaxed text-[#6E6E73] mb-16">
          {t("partnerships.nagarez.direction.paragraph")}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {principles.map((principle) => (
            <div
              key={principle.title}
              className="p-8 md:p-10 rounded-3xl bg-[#F5F5F7] dark:bg-[#1C1C1E]"
            >
              <h3 className="text-2xl font-bold mb-4">{principle.title}</h3>

              <p className="text-lg leading-relaxed text-[#6E6E73]">{principle.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
