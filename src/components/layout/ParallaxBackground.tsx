"use client";

import { Parallax } from "react-scroll-parallax";
import { useEffect, useState } from "react";

/**
 * ParallaxBackground Component
 * * A performance-optimized background wrapper that implements a multi-layered 
 * parallax effect. Designed for high visual fidelity while maintaining 
 * smooth frame rates through GPU acceleration and efficient resize listeners.
 */
interface ParallaxBackgroundProps {
  /** Source path for the background image */
  backgroundImage: string;
  /** Velocity of the parallax effect; negative values create an 'ascending' feel */
  speed?: number;
  /** Minimum vertical space the section occupies */
  minHeight?: string;
  /** Semantic ID for anchor-link navigation targeting */
  sectionName?: string;
}

export default function ParallaxBackground({
  backgroundImage,
  speed = -10,
  minHeight = "600px",
  sectionName,
}: ParallaxBackgroundProps) {
  /** * Responsive Background Positioning:
   * Optimized to ensure the visual focal point remains visible across 
   * different aspect ratios (Mobile vs. Desktop).
   */
  const [bgPosition, setBgPosition] = useState("center 70%");

  useEffect(() => {
    /** Handles viewport changes to adjust image focal alignment dynamically */
    const updatePosition = () => {
      if (window.innerWidth < 768) {
        setBgPosition("75% 50%"); // Mobile-optimized focus
      } else {
        setBgPosition("center 70%"); // Desktop-optimized focus
      }
    };

    updatePosition();
    
    /** * Using passive event listeners to avoid blocking the browser's 
     * main thread during high-frequency resize events.
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
      <Parallax speed={speed}>
        <div
          className="relative w-full h-full min-h-[600px] bg-cover"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: bgPosition,
            /** * Hardware Acceleration: 
             * Using will-change and translate3d to promote the element 
             * to its own GPU compositor layer, minimizing layout shifts and repaint.
             */
            willChange: "transform",
            transform: "translate3d(0,0,0)",
            /* Height offset prevents white-space gaps during intense scroll speeds */
            minHeight: `calc(${minHeight} + 350px)`,
          }}
        />
        
        {/* Visual Scrim: 
            A low-opacity layer that neutralizes background highlights 
            to ensure foreground text meets accessibility contrast standards. 
        */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none z-10" />
      </Parallax>
    </section>
  );
}