"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";

export default function ProjectsCarousel() {
  const t = useTranslations("projects");

  const projects = [
    {
      id: "homestocker",
      title: t("homestocker.title"),
      description: t("homestocker.description"),
      url: "https://homestocker.app/",
      image: "https://homestocker.app/logo-simple.webp",
      buttonTextColor: "#3b82f6",
    },
    {
      id: "cdestepona",
      title: t("cdestepona.title"),
      description: t("cdestepona.description"),
      url: "https://www.cdesteponafans.com/",
      image: "https://www.cdesteponafans.com/logo.png",
      buttonTextColor: "#ec4899",
    },
    {
      id: "sportsteam-template",
      title: t("sportsteam-template.title"),
      description: t("sportsteam-template.description"),
      url: "https://www.sportsteamtemplate.com/",
      image: "https://www.sportsteamtemplate.com/logo.webp",
      buttonTextColor: "#10b981",
    },
    {
      id: "restaurant-template",
      title: t("restaurant-template.title"),
      description: t("restaurant-template.description"),
      url: "https://restaurant-template.franaragondev.com/",
      image: "https://restaurant-template.franaragondev.com/logo.png",
      buttonTextColor: "#f97316",
    },
    {
      id: "business-template",
      title: t("business-template.title"),
      description: t("business-template.description"),
      url: "https://businesstemplate.franaragondev.com/",
      image: "https://businesstemplate.franaragondev.com/logo.png",
      buttonTextColor: "#a855f7",
    },
  ];

  const loopProjects = [...projects, ...projects];

  return (
    <section className="relative px-4 md:px-12 py-24 bg-white/20 dark:bg-gray-900/40 backdrop-blur-xl overflow-hidden">
      <div className="text-center mb-20">
        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white relative inline-block">
          {t("title")}
          <span className="block h-1 w-24 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full mx-auto mt-4" />
        </h2>
      </div>

      <motion.div
        className="flex gap-8 w-[max-content]"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
      >
        {loopProjects.map(
          ({ id, title, description, url, image, buttonTextColor }, idx) => (
            <a
              key={`${id}-${idx}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-80 md:w-96 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 dark:from-black/20 dark:to-black/10
             p-6 cursor-pointer transition-transform -translate-y-2 shadow-2xl outline-none outline-offset-2 outline-pink-500"
            >
              <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                <div className="w-24 h-24 relative rounded-lg overflow-hidden drop-shadow-lg">
                  <Image
                    src={image}
                    alt={`${title} logo`}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                  {title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 max-w-xs h-30">
                  {description}
                </p>
                <span
                  className="inline-block mt-4 px-5 py-2 rounded-full text-sm font-semibold transition-colors"
                  style={{ backgroundColor: buttonTextColor, color: "white" }}
                >
                  {t("viewProject")}
                </span>
              </div>
            </a>
          )
        )}
      </motion.div>
    </section>
  );
}
