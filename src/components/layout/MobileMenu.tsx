"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { X } from "lucide-react";

type MobileMenuProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  isHeaderVisible: boolean;
};

const locales = [
  { code: "es", key: "es" },
  { code: "en", key: "en" },
];

export default function MobileMenu({
  isOpen,
  onCloseAction,
  isHeaderVisible,
}: MobileMenuProps) {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("menu");
  const tLang = useTranslations("language");
  const HEADER_HEIGHT = 72;
  const HEADER_HEIGHT_HIDDEN = 0;
  const currentPath = pathname.replace(`/${locale}`, "") || "/";

  function changeLocale(newLocale: string) {
    const segments = pathname.split("/").filter(Boolean);
    const currentLocale = ["es", "en"].includes(segments[0])
      ? segments[0]
      : null;

    const restOfPath = currentLocale
      ? segments.slice(1).join("/")
      : segments.join("/");

    const newPathname =
      newLocale === "es"
        ? restOfPath
          ? `/${restOfPath}`
          : "/"
        : restOfPath
        ? `/${newLocale}/${restOfPath}`
        : `/${newLocale}`;

    if (newPathname === pathname) {
      router.refresh();
    } else {
      router.replace(newPathname);
    }

    onCloseAction();
  }

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    hash: string
  ) => {
    if (hash.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(hash);
      if (element) {
        const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset;
        const offset = isHeaderVisible ? HEADER_HEIGHT : HEADER_HEIGHT_HIDDEN;

        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
      onCloseAction?.();
    }
  };

  const basePath = `/${locale}`;

  const menuLinks = [
    { href: `${basePath}/`, label: t("home") },
    { href: `${basePath}/services`, label: t("services") },
    { href: `${basePath}/projects`, label: t("projects") },
    { href: `${basePath}/about`, label: t("about") },
    { href: `${basePath}/contact`, label: t("contact") },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-gray-800/40 z-50"
          onClick={onCloseAction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.aside
            className="fixed pt-16 left-0 h-[100vh] w-54 bg-white/30 backdrop-blur-md border-b border-white/20 shadow-md z-55 p-4"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "tween" }}
          >
            <div className="flex items-center md:hidden justify-start text-[var(--primary)] hover:text-[var(--secondary)] transition z-60">
              <button
                onClick={onCloseAction}
                aria-label="Toggle menu"
                className="ml-6 -mt-3.5"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menú */}
            <nav className="flex flex-col space-y-4 pt-10">
              {menuLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={(e) => {
                    const hash = href.split("#")[1]
                      ? `#${href.split("#")[1]}`
                      : "";
                    handleClick(e, hash);
                    onCloseAction();
                  }}
                  className={`text-[var(--primary)] hover:text-[var(--secondary)] transition ${
                    currentPath === href.replace(`/${locale}`, "")
                      ? "font-bold"
                      : ""
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Cambiar idioma */}
            <hr className="my-4 border-t border-gray-300" />
            <div className="mb-4">
              <h3 className="mb-2 font-semibold text-[#31302f] transition">
                {t("language")}
              </h3>
              <ul>
                {locales.map(({ code, key }) => (
                  <li key={code}>
                    <button
                      onClick={() => changeLocale(code)}
                      disabled={code === locale}
                      className={`py-1 px-3 rounded text-[var(--primary)] ${
                        code === locale
                          ? "font-semibold text-[#bb9b63]"
                          : "hover:text-[var(--secondary)]"
                      }`}
                    >
                      {tLang(key)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
