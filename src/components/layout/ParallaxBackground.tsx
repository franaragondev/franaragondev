"use client";

import { Parallax } from "react-scroll-parallax";
import { useEffect, useState } from "react";

interface ParallaxBackgroundProps {
  backgroundImage: string;
  speed?: number;
  minHeight?: string;
  sectionName?: string;
}

export default function ParallaxBackground({
  backgroundImage,
  speed = -10,
  minHeight = "600px",
  sectionName,
}: ParallaxBackgroundProps) {
  const [bgPosition, setBgPosition] = useState("center 70%");

  useEffect(() => {
    const updatePosition = () => {
      if (window.innerWidth < 768) {
        // Mobile
        setBgPosition("75% 50%");
      } else {
        // Desktop
        setBgPosition("center 70%");
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  return (
    <section
      id={sectionName}
      className="relative overflow-hidden"
      style={{ minHeight }}
    >
      <Parallax speed={speed}>
        <div
          className="relative w-full h-full min-h-[600px] bg-cover"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: bgPosition,
            willChange: "transform",
            transform: "translate3d(0,0,0)",
            minHeight: `calc(${minHeight} + 350px)`,
          }}
        />

        <div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: 0.1, zIndex: 10 }}
        />
      </Parallax>
    </section>
  );
}
