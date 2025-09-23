"use client";

import { useState } from "react";
import { useVideoCache } from "@/hooks/useVideoCache";

export default function AppHero() {
  const videoUrl = useVideoCache("/hero-bg.mp4");
  const [isVisible, setIsVisible] = useState(false);

  if (!videoUrl) return <div className="w-full min-h-[100vh] bg-black" />;

  return (
    <section className="relative w-full min-h-[100vh] overflow-hidden bg-black">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ opacity: isVisible ? 1 : 0 }}
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        poster="/hero-bg-frame.jpg"
        onCanPlayThrough={() => setIsVisible(true)}
      />

      {isVisible && (
        <div className="absolute inset-0 bg-black/20 transition-opacity duration-700" />
      )}
    </section>
  );
}
