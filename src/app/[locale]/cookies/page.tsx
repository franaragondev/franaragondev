"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

interface CookiesPolicyMessages {
  title: string;
  intro: string;

  whatAreCookiesTitle: string;
  whatAreCookies: string;

  typesTitle: string;
  typesList: string[];

  manageTitle: string;
  manageText: string;

  personalDataTitle: string;

  personalDataTextPart1: string;
  personalDataTextPart2: string;

  privacyPolicyLinkText: string;

  changesTitle: string;
  changesText: string;

  lastUpdated: string;
}

export default function CookiesPage() {
  const t = useTranslations("cookiesPolicy") as {
    (key: keyof CookiesPolicyMessages): string;
    raw: (key: keyof CookiesPolicyMessages) => unknown;
  };

  const typesList = t.raw("typesList") as unknown as string[];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-sm leading-6">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      <p className="mb-4">{t("intro")}</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        {t("whatAreCookiesTitle")}
      </h2>
      <p className="mb-4">{t("whatAreCookies")}</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">{t("typesTitle")}</h2>
      <ul className="list-disc list-inside mb-4">
        {typesList.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">{t("manageTitle")}</h2>
      <p className="mb-4">{t("manageText")}</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        {t("personalDataTitle")}
      </h2>
      <p className="mb-4">
        {t("personalDataTextPart1")}
        <Link href="/privacidad" className="underline">
          {t("privacyPolicyLinkText")}
        </Link>
        {t("personalDataTextPart2")}
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">{t("changesTitle")}</h2>
      <p className="mb-4">{t("changesText")}</p>

      <p className="text-xs text-gray-500 mt-8">{t("lastUpdated")}</p>
    </div>
  );
}
