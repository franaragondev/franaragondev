"use client";

import Image from "next/image";
import {
  FaUtensils,
  FaLeaf,
  FaHeart,
  FaUsers,
  FaRecycle,
  FaLightbulb,
} from "react-icons/fa";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function AboutUsSection() {
  const t = useTranslations("about-us");

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

  return (
    <section className="px-4 md:px-12 mt-32 mb-10">
      {/* Título */}
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

      {/* Historia y misión */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Imagen con overlay */}
        <motion.div
          className="relative h-80 md:h-[32rem] w-full rounded-xl overflow-hidden shadow-lg"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/images/restaurant-team.webp"
            alt={t("imageAlt")}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        </motion.div>

        {/* Texto */}
        <motion.div
          className="space-y-6 text-gray-200 dark:text-gray-300"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p>{t("story")}</p>
          <p>{t("journey")}</p>
          <p>{t("mission")}</p>
          <p>{t("vision")}</p>
        </motion.div>
      </div>

      {/* Valores con fondo degradado y hover */}
      <div className="max-w-6xl mx-auto mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {values.map((item, idx) => (
          <motion.div
            key={idx}
            className="flex flex-col items-center text-center p-6 rounded-xl shadow-lg relative overflow-hidden group cursor-pointer transition-transform transform hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2, duration: 0.6 }}
          >
            {/* Fondo degradado sutil */}
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

      {/* Filosofía */}
      <motion.div
        className="max-w-4xl mx-auto mt-20 text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-2xl font-semibold text-[var(--primary)]">
          {t("philosophyTitle")}
        </h3>
        <p className="text-gray-200 dark:text-gray-400">
          {t("philosophyText")}
        </p>
      </motion.div>
    </section>
  );
}
