"use client";

import Image from "next/image";

const HERO_SRC = "/hero-bg.webp";

export default function AppHero() {
  return (
    <section className="relative w-full min-h-[100vh] overflow-hidden bg-black">
      <Image
        src={HERO_SRC}
        alt="Hero background"
        fill
        className="object-cover"
        placeholder="blur"
        blurDataURL="/hero-bg-frame.jpg"
      />
      <div className="absolute inset-0 bg-black/20" />
    </section>
  );
}
