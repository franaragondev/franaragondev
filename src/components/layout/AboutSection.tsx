"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function AboutSection() {
  const t = useTranslations("about");

  return (
    <section
      id="about"
      className="relative px-4 md:px-12 py-24 bg-gray-50 dark:bg-gray-900/40 backdrop-blur-xl scroll-mt-24 "
    >
      <div className="text-center mb-20">
        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          {t("title")}
          <span className="block h-1 w-24 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full mx-auto mt-4"></span>
        </h2>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center">
          <div className="w-48 h-48 md:w-64 md:h-64 relative rounded-full overflow-hidden shadow-xl">
            <Image
              src="/fran.png"
              alt="Fran Aragón"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Fran Aragón
          </h3>
          <p className="text-gray-800 dark:text-gray-300 leading-relaxed text-base md:text-lg">
            {t("description")}
          </p>

          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            {t("viewCV")}
          </a>
        </div>
      </div>
    </section>
  );
}
