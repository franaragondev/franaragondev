"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function AppHero() {
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlayThrough = () => setLoaded(true);

    video.addEventListener("canplaythrough", handleCanPlayThrough);

    // Fallback autoplay si está bloqueado: reproducción tras interacción
    const tryPlay = () => {
      video
        .play()
        .then(() => setLoaded(true))
        .catch(() => {});
    };
    document.addEventListener("click", tryPlay, { once: true });
    document.addEventListener("scroll", tryPlay, { once: true });

    return () => {
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
      document.removeEventListener("click", tryPlay);
      document.removeEventListener("scroll", tryPlay);
    };
  }, []);

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
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Video hero */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-800 ease-out ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/hero-bg-frame.jpg"
      >
        <source src="/hero-bg-720p.webm" type="video/webm" />
        <source src="/hero-bg-720p.mp4" type="video/mp4" />
      </video>

      {/* Overlay final */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Fallback móvil */}
      {!loaded && (
        <div className="absolute inset-0 sm:hidden">
          <Image
            src="/hero-bg-frame.jpg"
            alt="Hero background"
            fill
            className="object-cover"
          />
        </div>
      )}
    </section>
  );
}
