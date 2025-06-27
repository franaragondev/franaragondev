"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function ExperienceSection() {
  const t = useTranslations("experience");

  const experiences = [
    {
      id: "adidas",
      logo: "/experience/adidas.png",
      role: t("adidas.title"),
      company: "adidas",
      period: t("adidas.period"),
      responsibilities: [
        t("adidas.point1"),
        t("adidas.point2"),
        t("adidas.point3"),
      ],
      accentColor: "from-[#000000] to-[#636363]",
    },
    {
      id: "cei",
      logo: "/experience/cei.png",
      role: t("cei.title"),
      company: "CEI Escuela de Diseño y Marketing",
      period: t("cei.period"),
      responsibilities: [t("cei.point1"), t("cei.point2")],
      accentColor: "from-[#00695c] to-[#26a69a]", // verde
    },
    {
      id: "gransliving",
      logo: "/experience/gransliving.png",
      role: t("gransliving.title"),
      company: "GransLiving",
      period: t("gransliving.period"),
      responsibilities: [t("gransliving.point1"), t("gransliving.point2")],
      accentColor: "from-[#9e1b32] to-[#ff416c]", // rosa
    },
  ];

  return (
    <section
      id="experience"
      className="relative min-h-screen px-4 md:px-12 py-24 bg-white/30 backdrop-blur-xl scroll-mt-24"
    >
      <div className="text-center mb-20">
        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white relative inline-block">
          {t("title")}
          <span className="block h-1 w-24 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full mx-auto mt-4"></span>
        </h2>
      </div>

      <div className="relative border-l-2 border-gray-300 dark:border-gray-700 pl-6 space-y-16">
        {experiences.map(
          ({
            id,
            logo,
            role,
            company,
            period,
            responsibilities,
            accentColor,
          }) => {
            const isAdidas = id === "adidas";

            return (
              <div key={id} className="relative group">
                <span className="absolute left-[-36px] top-4 w-3 h-3 bg-white dark:bg-gray-900 border-4 border-blue-500 rounded-full z-10" />

                <article
                  className={`relative bg-white/30 dark:bg-gray-900/40 backdrop-blur-md rounded-3xl overflow-hidden p-6 md:p-8
                    border-white/20 dark:border-gray-700 shadow-xl transition-transform transform group-hover:-translate-y-1`}
                >
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl bg-gradient-to-br ${accentColor}`}
                  />

                  <div className="absolute inset-0 opacity-10 pointer-events-none select-none rounded-3xl">
                    <Image
                      src={logo}
                      alt=""
                      fill
                      className="object-contain p-10"
                    />
                  </div>

                  <div
                    className={`absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br ${accentColor} rounded-3xl`}
                  />

                  <div className="absolute inset-0 z-0 bg-white/30 dark:bg-black/30 backdrop-blur-[2px] rounded-3xl" />

                  <div
                    className={`relative z-10 ${
                      isAdidas ? "group-hover:text-white" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden shadow">
                        <Image
                          src={logo}
                          alt={`Logo ${company}`}
                          width={48}
                          height={48}
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <h3
                          className={`text-xl md:text-2xl font-semibold transition-colors ${
                            isAdidas
                              ? "text-gray-900 dark:text-white group-hover:text-white"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {role}
                        </h3>
                        <p
                          className={`text-sm italic ${
                            isAdidas
                              ? "text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {company} · {period}
                        </p>
                      </div>
                    </div>

                    <ul
                      className={`list-disc list-inside text-sm leading-relaxed space-y-2 ${
                        isAdidas
                          ? "group-hover:text-white"
                          : "text-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {responsibilities.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              </div>
            );
          }
        )}
      </div>
    </section>
  );
}
