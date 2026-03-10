"use client";

import { useTranslations } from "next-intl";

/**
 * DesktopMenu Component
 * * Handles the primary horizontal navigation for desktop viewports.
 * It implements a custom smooth-scroll logic to handle anchor links, 
 * specifically calculating offsets to prevent the sticky header from 
 * overlapping section titles.
 */

type DesktopMenuProps = {
  /** Reactive state provided by the parent header to determine current visibility/height */
  isHeaderVisible: boolean;
};

export default function DesktopMenu({ isHeaderVisible }: DesktopMenuProps) {
  const t = useTranslations("menu");
  
  // Constants for layout calculations
  const HEADER_HEIGHT = 72;
  const HEADER_HEIGHT_HIDDEN = 0;

  /** * Navigation links data structure 
   * Mapping href anchors to localized labels 
   */
  const links = [
    { href: "#expertise", label: t("expertise") },
    { href: "#about", label: t("about") },
    { href: "#projects", label: t("projects") },
    { href: "#experience", label: t("experience") },
    { href: "#contact", label: t("contact") },
  ];

  /**
   * Smooth Scroll Implementation
   * @param e - Mouse event to prevent default browser anchor jump
   * @param hash - Target element ID
   * * Logic: Calculates the absolute position of the target element in the DOM
   * and subtracts the dynamic header offset to ensure perfect visual alignment.
   */
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, hash: string) => {
    if (hash.startsWith("#")) {
      e.preventDefault();
      
      const element = document.querySelector(hash);
      if (element) {
        // Calculate the element's top position relative to the document
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        
        // Dynamic offset calculation based on the current state of the sticky header
        const offset = isHeaderVisible ? HEADER_HEIGHT : HEADER_HEIGHT_HIDDEN;
        
        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <nav className="flex gap-8 items-center">
      {links.map(({ href, label }) => (
        <a
          key={href}
          href={href}
          onClick={(e) => handleClick(e, href)}
          className="text-xs font-semibold tracking-widest uppercase text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white transition-colors duration-300"
        >
          {label}
        </a>
      ))}
    </nav>
  );
}