"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Globe } from "lucide-react";

const locales = [
  { code: "es", key: "es" },
  { code: "en", key: "en" },
];

export default function UserDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tLang = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function changeLocale(newLocale: string) {
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
    setOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative flex" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded px-3 py-1 hover:bg-gray-100 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="User menu"
      >
        <Globe className="w-5 h-5" />
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50"
          role="menu"
        >
          <ul>
            {locales.map(({ code, key }) => (
              <li key={code}>
                <button
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    code === locale ? "font-bold bg-gray-200" : ""
                  }`}
                  onClick={() => changeLocale(code)}
                  disabled={code === locale}
                >
                  {tLang(key)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
