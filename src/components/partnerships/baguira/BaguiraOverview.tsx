"use client";

import { useTranslations } from "next-intl";

export default function BaguiraOverview() {
  const t = useTranslations();

  return (
    <section className="py-28 px-6 md:px-12 border-t border-black/5 dark:border-white/5">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">
          {t("overview.title")}
        </h2>

        <p className="text-xl leading-relaxed text-[#6E6E73]">
          {t("overview.paragraph")}
        </p>
      </div>
    </section>
  );
}
