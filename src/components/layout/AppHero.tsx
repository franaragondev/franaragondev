"use client";

import { useState } from "react";
import { useVideoCache } from "@/hooks/useVideoCache";

const VIDEO_SRC_MP4 = "/hero-bg.mp4";
const VIDEO_SRC_WEBM = "/hero-bg.webm";

export default function AppHero() {
  const videoUrl = useVideoCache(VIDEO_SRC_MP4);
  const [isVisible, setIsVisible] = useState(false);

  if (!videoUrl) return <div className="w-full min-h-[100vh] bg-black" />;

  return (
    <section className="relative w-full min-h-[100vh] overflow-hidden bg-black">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ opacity: isVisible ? 1 : 0 }}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/hero-bg-frame.jpg"
        onCanPlayThrough={() => setIsVisible(true)}
        crossOrigin="anonymous"
      >
        <source src={VIDEO_SRC_WEBM} type="video/webm" />
        <source src={videoUrl} type="video/mp4" />
      </video>

      {isVisible && (
        <div className="absolute inset-0 bg-black/20 transition-opacity duration-700" />
      )}
    </section>
  );
}
