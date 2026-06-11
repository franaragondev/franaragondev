"use client";

import { useTranslations } from "next-intl";

export default function BaguiraChallenge() {
  const t = useTranslations();

  return (
    <section className="py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">
          {t("partnerships.baguira.challenge.title")}
        </h2>

        <div className="space-y-8 text-xl leading-relaxed text-[#6E6E73]">
          <p>{t("partnerships.baguira.challenge.paragraph1")}</p>
          <p>{t("partnerships.baguira.challenge.paragraph2")}</p>
        </div>
      </div>
    </section>
  );
}
