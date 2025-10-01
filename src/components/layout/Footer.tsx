"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import UsefulLinks from "./UsefulLinks";
import Logo from "@/assets/Logo";

export default function Footer() {
  const t = useTranslations("footer");
  const tPrivacy = useTranslations("privacyPolicy");
  const tCookies = useTranslations("cookiesPolicy");
  const tTerms = useTranslations("termsOfUse");
  const locale = useLocale();

  return (
    <footer className="py-6 text-sm text-white">
      <div className="container mx-auto px-4 flex flex-col gap-3">
        {/* Logo at the top, centered */}
        <div className="flex justify-center mb-4">
          <Logo className="w-30 h-30 text-[var(--primary)] hover:text-[var(--secondary)] transition" />
        </div>

        <UsefulLinks />

        {/* Legal navigation links */}
        <nav className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2">
          <Link
            href={`/${locale}/privacidad`}
            className="hover:text-[var(--secondary)]"
          >
            {tPrivacy("title")}
          </Link>
          <Link
            href={`/${locale}/cookies`}
            className="hover:text-[var(--secondary)]"
          >
            {tCookies("title")}
          </Link>
          <Link
            href={`/${locale}/terminos-de-uso`}
            className="hover:text-[var(--secondary)]"
          >
            {tTerms("title")}
          </Link>
        </nav>

        {/* Credits row: left = copyright, right = attribution */}
        <div className="flex flex-col sm:flex-row justify-between text-center sm:text-left gap-2">
          <span>{t("left")}</span>
          <span>
            {t.rich("right", {
              link: (chunks) => (
                <a
                  href="https://franaragondev.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--secondary)]"
                >
                  {chunks}
                </a>
              ),
            })}
          </span>
        </div>
      </div>
    </footer>
  );
}
