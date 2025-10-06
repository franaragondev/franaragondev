"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import projectsData from "@/data/projects.json";

export default function ProjectsSection() {
  const t = useTranslations("projects");

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 30 },
  };

  return (
    <section className="px-4 md:px-12 mt-32 mb-20">
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

      <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
        {projectsData.map((project, index) => (
          <motion.div
            key={index}
            className="rounded-xl overflow-hidden shadow-lg bg-white/10 backdrop-blur-md border border-white/10 transition-transform transform hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
          >
            <div className="relative h-56 w-full">
              <Image
                src={project.image}
                alt={t("imageAlt")}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-[var(--secondary)] mb-2">
                {t(project.title)}
              </h3>
              <p className="text-gray-300 text-sm">{t(project.text)}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Link
          href="/contact"
          className="inline-block bg-[var(--secondary)] text-white px-6 py-3 rounded-lg hover:bg-[var(--primary)] transition"
        >
          {t("cta")}
        </Link>
      </motion.div>
    </section>
  );
}
