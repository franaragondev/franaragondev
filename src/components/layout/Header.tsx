"use client";

import { useState, useEffect } from "react";
import Logo from "@/assets/Logo";
import Link from "next/link";
import { Menu } from "lucide-react";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";
import UserDropdown from "./UserDropdown";
import { useLocale } from "next-intl";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const locale = useLocale();
  const basePath = `/${locale}`;

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    // Check once on mount
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40
    grid grid-cols-3 items-center md:px-12 md:grid-cols-[1fr_auto_1fr]
    transition-all duration-300 ${
      isAtTop
        ? "p-10 bg-transparent border-transparent shadow-none"
        : "p-4 bg-white/30 backdrop-blur-md border-b border-white/20 shadow-md"
    }`}
      >
        {/* Mobile hamburger menu button */}
        <div className="flex items-center md:hidden justify-start text-[#eac582] hover:text-[#bb9b63] transition z-60">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            className="ml-0 mt-1"
          >
            {!isMenuOpen && <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Logo */}
        <div className="flex justify-center md:justify-start items-center z-50">
          <Link href={`${basePath}`}>
            <Logo className="w-10 h-10 text-[#eac582] hover:text-[#bb9b63] transition" />
          </Link>
        </div>

        {/* Desktop menu centered */}
        <div className="hidden md:flex justify-center">
          <DesktopMenu isHeaderVisible={!isAtTop} />
        </div>

        {/* User dropdown */}
        <div className="hidden md:flex justify-end items-center">
          <UserDropdown />
        </div>

        <div className="flex justify-end md:hidden"></div>
      </header>

      {/* Mobile menu overlay */}
      <MobileMenu
        isOpen={isMenuOpen}
        onCloseAction={() => setIsMenuOpen(false)}
        isHeaderVisible={!isAtTop}
      />
    </>
  );
}
