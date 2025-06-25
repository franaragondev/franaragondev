"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

export function DesktopMenu() {
  const t = useTranslations("menu");
  const locale = useLocale();
  const pathname = usePathname();

  const basePath = `/${locale}`;

  const links = [
    { href: `${basePath}`, label: t("home") },
    { href: `${basePath}#experience`, label: t("experience") },
    { href: `${basePath}#about`, label: t("about") },
    { href: `${basePath}#contact`, label: t("contact") },
  ];

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="flex gap-6">
      {links.map(({ href, label }) => {
        const isActive = href === basePath ? pathname === href : false;

        return (
          <Link
            key={href}
            href={href.startsWith("#") ? `${basePath}${href}` : href}
            onClick={(e) => {
              if (href.startsWith("#")) {
                handleClick(e, href);
              }
            }}
            className={`text-gray-700 hover:text-black transition ${
              isActive ? "text-black font-semibold" : ""
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export default DesktopMenu;
