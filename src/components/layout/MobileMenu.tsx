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
    const defaultLocale = "en";

    const pathWithLocale =
      locale === defaultLocale && !pathname.startsWith(`/${locale}`)
        ? `/${locale}${pathname}`
        : pathname;

    const newPathname = pathWithLocale.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
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
    {
      href: `${locale === "en" ? "/menu_english.pdf" : "/menu_español.pdf"}`,
      label: t("menu"),
      isPdf: true,
    },
    { href: `${basePath}/`, label: t("home") },
    { href: `${basePath}/gallery`, label: t("gallery") },
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
            <div className="flex items-center md:hidden justify-start text-[#eac582] hover:text-[#bb9b63] transition z-60">
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
              {menuLinks.map(({ href, label, isPdf }) =>
                isPdf ? (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" pt-2 text-[#eac582] hover:text-[#bb9b63] transition"
                    onClick={() => onCloseAction()}
                  >
                    {label}
                  </a>
                ) : (
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
                    className={`text-[#eac582] hover:text-[#bb9b63] transition ${
                      currentPath === href.replace(`/${locale}`, "")
                        ? "font-bold"
                        : ""
                    }`}
                  >
                    {label}
                  </Link>
                )
              )}
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
                      className={`py-1 px-3 rounded text-[#eac582] ${
                        code === locale
                          ? "font-semibold text-[#bb9b63]"
                          : "hover:text-[#bb9b63]"
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
