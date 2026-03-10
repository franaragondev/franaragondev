"use client";

import { useTranslations } from "next-intl";
import ParallaxBackground from "./ParallaxBackground";

/**
 * AppHero Component
 * * Serves as the primary landing fold. It integrates a custom parallax 
 * background with a multi-layered scrim to ensure high text legibility 
 * and modern aesthetic standards.
 */
export default function AppHero() {
  const t = useTranslations("hero");

  return (
    <div className="relative overflow-hidden">
      {/* Custom Parallax Background: 
        Negative speed value creates a subtle "rising" effect against scroll. 
      */}
      <ParallaxBackground
        backgroundImage="/hero-bg.webp"
        speed={-20}
        minHeight="85vh"
        sectionName="home"
      />
      
      {/* Visual Scrim / Overlay:
        Implements a complex radial gradient to maintain high contrast (WCAG compliant) 
        between the dynamic background and the white typography. 
      */}
      <div className="absolute inset-0 z-10 bg-black/20 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.7)_0%,_rgba(0,0,0,0.3)_50%,_rgba(0,0,0,0.2)_100%)] transition-colors duration-500" />

      {/* Main Content Layer */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
        
        {/* Localized Rich Text: 
          Uses next-intl's rich text rendering to allow responsive line breaks (<br/>) 
          controlled directly via the translation JSON schema.
        */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 drop-shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
          {t.rich("title", {
            br: () => <br className="hidden md:block" />,
          })}
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 font-medium tracking-tight mb-10 drop-shadow-lg">
          {t("subtitle")}
        </p>
        
        {/* CTA / Badge Section: Implementing high-end glassmorphism effects */}
        <div className="flex flex-col md:flex-row gap-4 items-center mt-4">
          <span className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm font-semibold tracking-wide">
            {t("badgePrague")}
          </span>
          <span className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm font-semibold tracking-wide">
            {t("badgeWorldwide")}
          </span>
        </div>
      </div>
    </div>
  );
}