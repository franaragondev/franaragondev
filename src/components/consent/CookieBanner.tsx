"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("cookies");

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
    location.reload();
  };

  const rejectCookies = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 w-full bg-black text-white p-4 z-50 text-sm flex flex-col sm:flex-row justify-between items-center gap-2">
      <p>
        {t("message")}{" "}
        <Link
          href="/cookies"
          className="underline text-blue-300 hover:text-blue-100"
        >
          {t("linkText")}
        </Link>
        .
      </p>
      <div className="flex gap-2">
        <button
          onClick={acceptCookies}
          className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200 transition"
        >
          {t("accept")}
        </button>
        <button
          onClick={rejectCookies}
          className="bg-transparent border border-white px-3 py-1 rounded hover:bg-white hover:text-black transition"
        >
          {t("reject")}
        </button>
      </div>
    </div>
  );
}
