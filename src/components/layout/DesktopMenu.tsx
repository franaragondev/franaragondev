"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";

type DesktopMenuProps = {
  isHeaderVisible: boolean;
};

export function DesktopMenu({ isHeaderVisible }: DesktopMenuProps) {
  const t = useTranslations("menu");
  const locale = useLocale();
  const pathname = usePathname();
  const HEADER_HEIGHT = 72;
  const HEADER_HEIGHT_HIDDEN = 0;

  const links = [
    { href: "/", label: t("home") },
    { href: "/menu", label: t("menu") },
    { href: "/gallery", label: t("gallery") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  const normalizedPath = pathname.replace(`/${locale}`, "") || "/";

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
    }
  };

  return (
    <nav className="flex gap-6">
      {links.map(({ href, label }) => {
        const isActive = normalizedPath === href;

        return (
          <a
            key={href}
            href={`/${locale}${href === "/" ? "" : href}`}
            onClick={(e) => handleClick(e, href)}
            className={`text-[#eac582] hover:text-[#bb9b63] transition ${
              isActive ? "font-bold" : ""
            }`}
          >
            {label}
          </a>
        );
      })}
    </nav>
  );
}

export default DesktopMenu;
