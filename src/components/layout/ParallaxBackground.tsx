"use client";

import { Parallax } from "react-scroll-parallax";
import { useEffect, useState, type CSSProperties } from "react";
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
  /** * Scroll-Linked Engine Selection:
   * When the browser supports CSS scroll-driven animations, the `.parallax-layer`
   * rules in globals.css run the effect in the rendering pipeline (off the main
   * thread where supported), which keeps it in sync with iOS momentum scrolling.
   * The JS controller is then disabled so it stops writing transforms on scroll.
   * Unsupported browsers keep the react-scroll-parallax path unchanged.
   * Reduced-motion users get a static image on both paths.
   */
  const [jsParallaxDisabled, setJsParallaxDisabled] = useState(false);

  useEffect(() => {
    const supportsScrollTimeline =
      typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () =>
      setJsParallaxDisabled(supportsScrollTimeline || reducedMotion.matches);

    update();
    reducedMotion.addEventListener("change", update);
    return () => reducedMotion.removeEventListener("change", update);
  }, []);

  /** Same translateY range react-scroll-parallax derives from `speed`. */
  const parallaxRange = {
    "--parallax-from": `${speed * 10}px`,
    "--parallax-to": `${speed * -10}px`,
  } as CSSProperties;

  return (
    <section
      id={sectionName}
      className="parallax-scope relative overflow-hidden bg-[#111111]"
      style={{ minHeight }}
    >
      <Parallax
        speed={speed}
        disabled={jsParallaxDisabled}
        className="parallax-layer absolute inset-0 h-full w-full"
        style={parallaxRange}
      >
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
            /* Responsive focal point: portrait mobile focus below md, wide-angle above */
            className="object-cover object-[75%_50%] md:object-[center_70%]"
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
