"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import imagesData from "@/data/gallery.json";

interface GalleryImage {
  src: string;
  alt: string;
  category: "Platos" | "Local" | "Eventos";
}

export default function GalleryPage() {
  const t = useTranslations("gallery");
  const [index, setIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<GalleryImage["category"] | "All">("All");

  const images = imagesData as GalleryImage[];

  const filteredImages = useMemo(
    () =>
      filter === "All"
        ? images
        : images.filter((img) => img.category === filter),
    [filter, images]
  );

  const categories: GalleryImage["category"][] = ["Platos", "Local", "Eventos"];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 30 },
  };

  return (
    <section className="px-4 md:px-12 mt-32 mb-20">
      {/* --- Título --- */}
      <motion.div
        className="text-center mb-20 -mt-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl md:text-4xl tracking-tight text-[var(--primary)] uppercase">
          {t("title")}
        </h2>
        <p className="mt-4 text-gray-200 dark:text-gray-400 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </motion.div>

      {/* --- Filtros --- */}
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {["All", ...categories].map((cat) => {
          const isActive = filter === cat;
          const label = cat === "All" ? t("all") : t(cat.toLowerCase());
          return (
            <button
              key={cat}
              className={`cursor-pointer px-4 py-2 rounded-full font-semibold transition ${
                isActive
                  ? "bg-[var(--secondary)] text-gray-900"
                  : "bg-gray-700 text-gray-200 hover:bg-[var(--primary)] hover:text-white"
              }`}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => setFilter(cat as any)}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* --- Grid de imágenes --- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredImages.map((img, idx) => (
          <motion.div
            key={idx}
            className="relative h-64 rounded-xl overflow-hidden shadow-lg cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05, duration: 0.6 }}
            onClick={() => setIndex(images.indexOf(img))}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={idx < 3} // primeras 3 imágenes optimizadas para LCP
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL="/images/placeholder.jpg" // mini imagen base64 o jpg ligero
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-30 transition-opacity rounded-xl" />
          </motion.div>
        ))}
      </div>

      {/* --- Lightbox --- */}
      {index !== null && (
        <Lightbox
          open={index !== null}
          index={index}
          close={() => setIndex(null)}
          slides={images.map((img) => ({ src: img.src, alt: img.alt }))}
        />
      )}
    </section>
  );
}
