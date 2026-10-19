"use client";

import { useTranslations } from "next-intl";

export default function CdEsteponaOverview() {
  const t = useTranslations();

  return (
    <section className="py-28 px-6 md:px-12 border-t border-black/5 dark:border-white/5">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">
          {t("partnerships.cdestepona.overview.title")}
        </h2>

        <p className="text-xl leading-relaxed text-[#6E6E73]">
          {t("partnerships.cdestepona.overview.paragraph")}
        </p>

        <div className="mt-16 p-8 md:p-12 rounded-3xl bg-[#F5F5F7] dark:bg-[#1C1C1E]">
          <h3 className="text-2xl font-bold mb-6">
            {t("partnerships.cdestepona.overview.roleTitle")}
          </h3>

          <p className="text-lg leading-relaxed text-[#6E6E73]">
            {t("partnerships.cdestepona.overview.role")}
          </p>
        </div>
      </div>
    </section>
  );
}
