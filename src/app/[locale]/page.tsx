"use client";

import AppHero from "@/components/layout/AppHero";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useState } from "react";
import { FaChartLine, FaUsers, FaLightbulb } from "react-icons/fa";
import projectsData from "@/data/projects.json";

export default function HomePageBusiness() {
  const t = useTranslations("home");
  const [index, setIndex] = useState<number | null>(null);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const services = [
    {
      icon: <FaChartLine />,
      title: t("service1Title"),
      text: t("service1Text"),
    },
    { icon: <FaUsers />, title: t("service2Title"), text: t("service2Text") },
    {
      icon: <FaLightbulb />,
      title: t("service3Title"),
      text: t("service3Text"),
    },
  ];

  const featuredProjects = projectsData.slice(0, 4);

  return (
    <main>
      {/* Hero */}
      <AppHero />

      {/* Sobre nosotros */}
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
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4 text-gray-200 dark:text-gray-300">
            <p>{t("aboutText1")}</p>
            <p>{t("aboutText2")}</p>
          </div>
          <div className="relative h-80 md:h-[28rem] w-full rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/images/team.webp"
              alt={t("aboutImageAlt")}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
          </div>
        </div>
      </section>

      {/* Servicios */}
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
            {t("servicesTitle")}
          </h2>
          <p className="mt-4 text-gray-200 dark:text-gray-400 max-w-2xl mx-auto">
            {t("servicesSubtitle")}
          </p>
        </motion.div>
        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {services.map((item, idx) => (
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

      {/* Proyectos */}
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
            {t("projectsTitle")}
          </h2>
          <p className="mt-4 text-gray-200 dark:text-gray-400 max-w-2xl mx-auto">
            {t("projectsSubtitle")}
          </p>
        </motion.div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProjects.map((proj, idx) => (
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
                src={proj.image}
                alt={proj.alt}
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
          slides={projectsData.map((proj) => ({
            src: proj.image,
            alt: proj.alt,
          }))}
        />
      )}

      {/* CTA Contacto */}
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
