"use client";

import { useTranslations } from "next-intl";

type DesktopMenuProps = {
  isHeaderVisible: boolean;
};

export function DesktopMenu({ isHeaderVisible }: DesktopMenuProps) {
  const t = useTranslations("menu");
  const HEADER_HEIGHT = 72;
  const HEADER_HEIGHT_HIDDEN = 0;

  const links = [
    { href: "#about", label: t("about") },
    { href: "#projects", label: t("projects") },
    { href: "#experience", label: t("experience") },
    { href: "#contact", label: t("contact") },
  ];

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
        return (
          <a
            key={href}
            href={href}
            onClick={(e) => handleClick(e, href)}
            className="text-[#eac582] hover:text-[#bb9b63] transition"
          >
            {label}
          </a>
        );
      })}
    </nav>
  );
}

export default DesktopMenu;
