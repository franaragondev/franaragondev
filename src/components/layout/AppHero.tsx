"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function AppHero() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setVideoLoaded(true);

    video.addEventListener("canplay", handleCanPlay);

    // Fallback autoplay (Safari/iOS)
    const tryPlay = () => video.play().catch(() => {});
    document.addEventListener("click", tryPlay, { once: true });
    document.addEventListener("scroll", tryPlay, { once: true });

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      document.removeEventListener("click", tryPlay);
      document.removeEventListener("scroll", tryPlay);
    };
  }, []);

  return (
    <section className="relative w-full min-h-[100vh] overflow-hidden bg-black">
      {/* Poster fijo */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/hero-poster.webp"
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
        <div
          className={`absolute inset-0 bg-black/20 transition-opacity duration-500 ${
            videoLoaded ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>

      {/* Mini preview de 5 segundos */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out ${
          videoLoaded ? "opacity-0" : "opacity-100"
        }`}
      >
        <source src="/hero-preview-5s.mp4" type="video/mp4" />
        <source src="/hero-preview-5s.webm" type="video/webm" />
      </video>

      {/* Video real */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
        poster="/hero-poster.webp"
      >
        <source src="/hero-480p.mp4" type="video/mp4" />
        <source src="/hero-480p.webm" type="video/webm" />
      </video>
    </section>
  );
}
