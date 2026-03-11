"use client";

import { Parallax } from "react-scroll-parallax";
import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * ParallaxBackground Component
 * * A high-performance background primitive designed for immersive visual storytelling.
 * * Key Engineering Features:
 * * LCP Optimization: Utilizes Next.js <Image /> with 'priority' and 'fetchPriority'
 * to ensure critical background assets are prioritized during the initial hydration.
 * * Hardware Acceleration: Leverages GPU-bound transformations via react-scroll-parallax
 * to maintain a consistent 60fps experience even during heavy scroll interactions.
 * * Responsive Focal Points: Implements dynamic background positioning to maintain
 * visual intent across heterogeneous viewport aspect ratios.
 */

interface ParallaxBackgroundProps {
  /** Resource path for the background asset (optimized via Next.js Image Loader) */
  backgroundImage: string;
  /** Scroll velocity modifier; negative values simulate depth/ascent */
  speed?: number;
  /** CSS min-height constraint for the section container */
  minHeight?: string;
  /** Semantic identifier for document-level anchor navigation */
  sectionName?: string;
}

export default function ParallaxBackground({
  backgroundImage,
  speed = -10,
  minHeight = "600px",
  sectionName,
}: ParallaxBackgroundProps) {
  /** * Responsive Anchor Logic:
   * Dynamically adjusts the image's focal point to prevent critical visual
   * clipping on ultra-narrow (mobile) viewports.
   */
  const [bgPosition, setBgPosition] = useState("center 70%");

  useEffect(() => {
    const updatePosition = () => {
      if (window.innerWidth < 768) {
        setBgPosition("75% 50%"); // Optimized for portrait mobile focus
      } else {
        setBgPosition("center 70%"); // Standard desktop wide-angle focus
      }
    };

    updatePosition();

    /** * Performance optimization: Using passive listeners to avoid main-thread
     * jank during high-frequency window resize events.
     */
    window.addEventListener("resize", updatePosition, { passive: true });
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  return (
    <section
      id={sectionName}
      className="relative overflow-hidden bg-[#111111]"
      style={{ minHeight }}
    >
      <Parallax speed={speed} className="absolute inset-0 h-full w-full">
        <div
          className="relative h-full w-full"
          /* Calculating height offset to prevent whitespace gaps during intense parallax deltas */
          style={{ minHeight: `calc(${minHeight} + 350px)` }}
        >
          {/* Next.js Optimized Image Component:
              Priority is set to true as this often serves as the Largest Contentful Paint (LCP).
              Alt is empty ("") as the image is purely decorative, satisfying WCAG 2.1 A11y standards.
          */}
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            fetchPriority="high"
            className="object-cover"
            style={{ objectPosition: bgPosition }}
            sizes="100vw"
            quality={90}
          />

          {/* Visual Scrim / Overlay: 
              Normalizes the background luminance to ensure foreground typography 
              consistently passes WCAG AA/AAA contrast ratios.
          */}
          <div className="absolute inset-0 bg-black/30 pointer-events-none z-10" />
        </div>
      </Parallax>
    </section>
  );
}
