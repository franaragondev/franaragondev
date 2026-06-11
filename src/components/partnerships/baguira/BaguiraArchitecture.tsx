"use client";

import { useTranslations } from "next-intl";

export default function BaguiraArchitecture() {
  const t = useTranslations();

  const highlights = t.raw("highlights.items") as string[];

  return (
    <section className="py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">
          {t("architecture.title")}
        </h2>

        <p className="text-xl leading-relaxed text-[#6E6E73] mb-16">
          {t("architecture.paragraph")}
        </p>

        <h3 className="text-2xl font-bold mb-8">{t("highlights.title")}</h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((item) => (
            <div
              key={item}
              className="p-8 rounded-3xl bg-[#F5F5F7] dark:bg-[#1C1C1E]"
            >
              <span className="font-semibold">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
