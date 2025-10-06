"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function ProjectsSection() {
  const t = useTranslations("projects");

  const projects = [
    {
      id: "homestocker",
      title: t("homestocker.title"),
      description: t("homestocker.description"),
      url: "https://homestocker.app/",
      image: "https://homestocker.app/logo-simple.webp",
      accentColor: "from-[#1e40af] to-[#3b82f6]",
      buttonTextColor: "#3b82f6",
    },
    {
      id: "cdestepona",
      title: t("cdestepona.title"),
      description: t("cdestepona.description"),
      url: "https://www.cdesteponafans.com/",
      image: "https://www.cdesteponafans.com/logo.png",
      accentColor: "from-[#9d174d] to-[#ec4899]",
      buttonTextColor: "#ec4899",
    },
    {
      id: "sportsteam-template",
      title: t("sportsteam-template.title"),
      description: t("sportsteam-template.description"),
      url: "https://www.sportsteamtemplate.com/",
      image: "https://www.sportsteamtemplate.com/logo.webp",
      accentColor: "from-[#059669] to-[#10b981]",
      buttonTextColor: "#10b981",
    },

    {
      id: "restaurant-template",
      title: t("restaurant-template.title"),
      description: t("restaurant-template.description"),
      url: "https://restaurant-template.franaragondev.com/",
      image: "https://restaurant-template.franaragondev.com/logo.png",
      accentColor: "from-[#f59e0b] to-[#f97316]",
      buttonTextColor: "#f97316",
    },
    {
      id: "business-template",
      title: t("business-template.title"),
      description: t("business-template.description"),
      url: "https://businesstemplate.franaragondev.com/",
      image: "https://businesstemplate.franaragondev.com/logo.png",
      accentColor: "from-[#9333ea] to-[#c084fc]",
      buttonTextColor: "#a855f7",
    },
  ];

  return (
    <section
      id="projects"
      className="relative px-4 md:px-12 py-24 bg-white/20 dark:bg-gray-900/40 backdrop-blur-xl scroll-mt-24"
    >
      <div className="text-center mb-20">
        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white relative inline-block">
          {t("title")}
          <span className="block h-1 w-24 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full mx-auto mt-4" />
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto">
        {projects.map(
          ({
            id,
            title,
            description,
            url,
            image,
            accentColor,
            buttonTextColor,
          }) => (
            <a
              key={id}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-white/10 to-white/5 dark:from-black/20 dark:to-black/10
                p-8 cursor-pointer
                transition-transform hover:-translate-y-3 hover:shadow-xl
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                focus-visible:outline-pink-500"
              style={
                {
                  backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                  "--btn-hover-color": buttonTextColor,
                } as React.CSSProperties
              }
            >
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-40 transition-opacity duration-700 ${accentColor}`}
                aria-hidden="true"
              />

              <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                <div className="w-24 h-24 relative rounded-lg overflow-hidden drop-shadow-lg">
                  <Image
                    src={image}
                    alt={`${title} logo`}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-white transition-colors">
                  {title}
                </h3>

                <p className="text-gray-700 dark:text-gray-300 max-w-md">
                  {description}
                </p>

                <span
                  className="inline-block mt-4 px-5 py-2 rounded-full text-sm font-semibold transition-colors
                    md:bg-white/20 md:dark:bg-gray-800/40
                    md:text-gray-900 md:dark:text-white
                    group-hover:bg-white
                    group-hover:text-[var(--btn-hover-color)]"
                  style={{
                    backgroundColor: buttonTextColor,
                    color: "white",
                  }}
                >
                  {t("viewProject")}
                </span>
              </div>
            </a>
          )
        )}
      </div>
    </section>
  );
}
