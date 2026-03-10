"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";
import UserDropdown from "./UserDropdown";
import { useLocale } from "next-intl";

/**
 * Header Component
 * * Acts as the primary navigational shell. Implements an "Auto-hide" scroll logic
 * inspired by mobile OS patterns, high-fidelity glassmorphism, and 
 * comprehensive mobile/desktop responsive orchestration.
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const locale = useLocale();
  const basePath = `/${locale}`;

  /**
   * Effect: Body Scroll Lock
   * * Prevents background scrolling when the Mobile Menu overlay is active.
   * This is a critical UX/Accessibility requirement for modal-like components.
   */
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

  /**
   * Effect: Scroll Direction Tracking
   * * Implements a "Smart Header" that hides on scroll down and reveals on scroll up.
   * Enhances vertical screen real estate for content consumption while 
   * maintaining instant access to navigation.
   */
  useEffect(() => {
    let prevScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Threshold check (80px) ensures the header doesn't hide too early at the page top
      if (currentScrollY > prevScrollY && currentScrollY > 80) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      prevScrollY = currentScrollY;
    };
    
    // Using { passive: true } to optimize scroll performance and prevent main thread blocking
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 h-[72px]
             flex items-center justify-between px-6 md:px-12
             bg-white/70 dark:bg-[#111111]/70 backdrop-blur-xl border-b border-black/5 dark:border-white/10
             transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
               showHeader ? "translate-y-0" : "-translate-y-full"
             }`}
      >
        {/* Mobile Viewport: Trigger for MobileMenu */}
        <div className="flex md:hidden flex-1 justify-start">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            className="text-[#1D1D1F] dark:text-white hover:opacity-70 transition-opacity"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Global Branding / Logo: Implements localized home-routing */}
        <div className="flex justify-center md:justify-start md:flex-1">
          <Link href={basePath} className="transition-transform duration-300 hover:scale-105 active:scale-95">
            <Image
              src="/logo.png"
              alt="Fran Aragon Logo"
              width={36}
              height={36}
              className="drop-shadow-sm"
              priority // LCP optimization for brand identity
            />
          </Link>
        </div>

        {/* Desktop Viewport: Centered Nav Content */}
        <div className="hidden md:flex flex-1 justify-center">
          <DesktopMenu isHeaderVisible={showHeader} />
        </div>

        {/* Utilities: Global Language Switching & Identity */}
        <div className="flex flex-1 justify-end items-center">
          <div className="hidden md:block">
            <UserDropdown />
          </div>
        </div>
      </header>

      {/* Portal-like Overlay: Decoupled for clean DOM structure */}
      <MobileMenu
        isOpen={isMenuOpen}
        onCloseAction={() => setIsMenuOpen(false)}
        isHeaderVisible={showHeader}
      />
    </>
  );
}