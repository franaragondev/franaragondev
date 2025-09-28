"use client";

import { useState } from "react";

export default function AppHero() {
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="relative w-full min-h-[100vh] overflow-hidden bg-black">
      {/* Blur oscuro placeholder */}
      <div
        className={`absolute inset-0 bg-cover bg-center scale-110 transition-opacity duration-700 ease-out ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage: 'url("/hero-bg-frame.jpg")',
          filter: "blur(24px)",
        }}
      >
        {/* Overlay negro */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Video */}
      <video
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-800 ease-out ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/hero-bg-frame.jpg"
        onLoadedData={() => setLoaded(true)}
      >
        <source src="/hero-bg-720p.webm" type="video/webm" />
        <source src="/input.mp4" type="video/mp4" />
      </video>

      {/* Overlay final */}
      <div className="absolute inset-0 bg-black/20" />
    </section>
  );
}
