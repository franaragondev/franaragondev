"use client";

import AppHero from "@/components/layout/AppHero";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  FaUtensils,
  FaLeaf,
  FaHeart,
  FaUsers,
  FaRecycle,
  FaLightbulb,
} from "react-icons/fa";
import imagesData from "@/data/gallery.json";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useState } from "react";

export default function HomePageExtended() {
  const t = useTranslations("home");
  const [index, setIndex] = useState<number | null>(null);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 30 },
  };

  const values = [
    { icon: <FaUtensils />, title: t("quality"), text: t("qualityText") },
    { icon: <FaLeaf />, title: t("fresh"), text: t("freshText") },
    { icon: <FaHeart />, title: t("love"), text: t("loveText") },
    { icon: <FaUsers />, title: t("community"), text: t("communityText") },
    {
      icon: <FaRecycle />,
      title: t("sustainability"),
      text: t("sustainabilityText"),
    },
    {
      icon: <FaLightbulb />,
      title: t("innovation"),
      text: t("innovationText"),
    },
  ];

  const featuredImages = imagesData.slice(0, 4);

  const menuItems = [
    {
      name: t("menuItem1"),
      description: t("menuItem1Desc"),
      image: "/images/dish1.webp",
    },
    {
      name: t("menuItem2"),
      description: t("menuItem2Desc"),
      image: "/images/dish2.webp",
    },
    {
      name: t("menuItem3"),
      description: t("menuItem3Desc"),
      image: "/images/dish3.webp",
    },
  ];

  return (
    <main>
      {/* Hero */}
      <AppHero />

      {/* Sobre nosotros breve */}
      <section className="px-4 md:px-12 mt-32">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-4xl tracking-tight text-[var(--primary)] uppercase">
            {t("aboutTitle")}
          </h2>
          <p className="mt-4 text-gray-200 dark:text-gray-400 max-w-2xl mx-auto">
            {t("aboutSubtitle")}
          </p>
        </motion.div>

        <motion.div
          className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="space-y-4 text-gray-200 dark:text-gray-300">
            <p>{t("aboutText1")}</p>
            <p>{t("aboutText2")}</p>
          </div>

          <div className="relative h-80 md:h-[28rem] w-full rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/images/restaurant-team.webp"
              alt={t("aboutImageAlt")}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
          </div>
        </motion.div>
      </section>

      {/* Valores destacados */}
      <section className="px-4 md:px-12 mt-32">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-4xl tracking-tight text-[var(--primary)] uppercase">
            {t("valuesTitle")}
          </h2>
          <p className="mt-4 text-gray-200 dark:text-gray-400 max-w-2xl mx-auto">
            {t("valuesSubtitle")}
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {values.map((item, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col items-center text-center p-6 rounded-xl shadow-lg relative overflow-hidden group cursor-pointer transition-transform transform hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] opacity-10 group-hover:opacity-20 transition-opacity rounded-xl" />
              <div className="relative z-10">
                <div className="text-[var(--secondary)] text-4xl mb-3">
                  {item.icon}
                </div>
                <h4 className="font-semibold text-lg">{item.title}</h4>
                <p className="text-sm mt-1">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Galería destacada */}
      <section className="px-4 md:px-12 mt-32">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-4xl tracking-tight text-[var(--primary)] uppercase">
            {t("galleryTitle")}
          </h2>
          <p className="mt-4 text-gray-200 dark:text-gray-400 max-w-2xl mx-auto">
            {t("gallerySubtitle")}
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredImages.map((img, idx) => (
            <motion.div
              key={idx}
              className="relative h-56 rounded-xl overflow-hidden shadow-lg cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.6 }}
              onClick={() => setIndex(idx)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-30 transition-opacity rounded-xl" />
            </motion.div>
          ))}
        </div>
      </section>

      {index !== null && (
        <Lightbox
          open={index !== null}
          index={index}
          close={() => setIndex(null)}
          slides={featuredImages.map((img) => ({ src: img.src, alt: img.alt }))}
        />
      )}

      {/* Menú / Especialidades */}
      <section className="px-4 md:px-12 mt-32">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-4xl tracking-tight text-[var(--primary)] uppercase">
            {t("menuTitle")}
          </h2>
          <p className="mt-4 text-gray-200 dark:text-gray-400 max-w-2xl mx-auto">
            {t("menuSubtitle")}
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {menuItems.map((item, idx) => (
            <motion.div
              key={idx}
              className="rounded-xl overflow-hidden shadow-lg group cursor-pointer transition-transform transform hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
            >
              <div className="relative h-64 w-full">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 bg-gray-900 text-gray-200">
                <h4 className="font-semibold text-lg">{item.name}</h4>
                <p className="mt-2 text-sm">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to action de contacto */}
      <section className="px-4 md:px-12 mt-32 text-center mb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl tracking-tight text-[var(--primary)] uppercase">
            {t("contactTitle")}
          </h2>
          <p className="mt-4 text-gray-200 dark:text-gray-400 max-w-2xl mx-auto">
            {t("contactSubtitle")}
          </p>
          <Link
            href="/contact"
            className="inline-block mt-6 px-8 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-gray-900 dark:text-white rounded-full font-semibold hover:opacity-90 transition"
          >
            {t("contactButton")}
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
