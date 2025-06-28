"use client";

import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="py-6 text-sm text-gray-500">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-center text-center sm:text-left gap-2">
        <span>{t("center")}</span>
      </div>
    </footer>
  );
}
