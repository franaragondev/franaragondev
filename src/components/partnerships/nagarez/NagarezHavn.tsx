"use client";

import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { havnUrl } from "./links";

type Offer = { name: string; text: string };

export default function NagarezHavn() {
  const t = useTranslations();
  const locale = useLocale();

  const compare = t.raw("partnerships.nagarez.havn.compare") as Offer[];
  const highlights = t.raw("partnerships.nagarez.highlights.items") as string[];

  return (
    <section className="py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">
          {t("partnerships.nagarez.havn.title")}
        </h2>

        <div className="space-y-8 text-xl leading-relaxed text-[#6E6E73]">
          <p>{t("partnerships.nagarez.havn.paragraph1")}</p>
          <p>{t("partnerships.nagarez.havn.paragraph2")}</p>
          <p>{t("partnerships.nagarez.havn.paragraph3")}</p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-6">
          {compare.map((offer, index) => (
            <div
              key={offer.name}
              className={
                index === compare.length - 1
                  ? "p-8 md:p-10 rounded-3xl bg-[#1D1D1F] text-white dark:bg-[#F5F5F7] dark:text-[#1D1D1F]"
                  : "p-8 md:p-10 rounded-3xl bg-[#F5F5F7] dark:bg-[#1C1C1E]"
              }
            >
              <h3 className="text-sm font-semibold uppercase tracking-widest mb-4 opacity-70">
                {offer.name}
              </h3>

              <p className="text-lg leading-relaxed">{offer.text}</p>
            </div>
          ))}
        </div>

        <a
          href={havnUrl(locale)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-10 text-sm font-bold tracking-widest uppercase text-[#1D1D1F] dark:text-white"
        >
          {t("partnerships.nagarez.havn.linkLabel")}
          <ArrowUpRight size={18} />
        </a>

        <div className="mt-24">
          <h3 className="text-2xl font-bold mb-8">
            {t("partnerships.nagarez.highlights.title")}
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>
    </section>
  );
}
