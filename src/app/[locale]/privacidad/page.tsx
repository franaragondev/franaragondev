"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function PrivacyPolicy() {
  const t = useTranslations("privacyPolicy");

  const sections = t.raw("sections") as {
    title: string;
    text: string;
  }[];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-sm leading-6">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      <p className="mb-4">{t("intro")}</p>

      {sections.map((section, index) => (
        <div key={index}>
          <h2 className="text-xl font-semibold mt-8 mb-2">{section.title}</h2>
          {index === 7 ? (
            <p className="mb-4">
              {section.text.replace("nuestra Política de Cookies", "")}
              <Link href="/cookies" legacyBehavior>
                <a className="underline">{t("cookiesLinkText")}</a>
              </Link>
              .
            </p>
          ) : (
            <p className="mb-4">{section.text}</p>
          )}
        </div>
      ))}

      <p className="text-xs text-gray-500 mt-8">{t("lastUpdated")}</p>
    </div>
  );
}
