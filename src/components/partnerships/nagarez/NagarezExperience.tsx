"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

const MOBILE_SCREENSHOTS = [
  { src: "/partnerships/nagarez/mobile-home.jpg", caption: "mobileHome" },
  { src: "/partnerships/nagarez/mobile-portfolio.jpg", caption: "mobilePortfolio" },
] as const;

const frame =
  "overflow-hidden rounded-3xl border border-black/5 dark:border-white/10 bg-[#F5F5F7] dark:bg-[#1C1C1E]";
const caption = "mt-4 text-sm uppercase tracking-widest text-[#6E6E73]";

export default function NagarezExperience() {
  const t = useTranslations();
  const label = (key: string) => t(`partnerships.nagarez.experience.captions.${key}`);

  return (
    <section className="py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">
          {t("partnerships.nagarez.experience.title")}
        </h2>

        <p className="text-xl leading-relaxed text-[#6E6E73] mb-16">
          {t("partnerships.nagarez.experience.paragraph")}
        </p>

        <figure>
          <div className={frame}>
            <Image
              src="/partnerships/nagarez/website-home.jpg"
              alt={label("websiteHome")}
              width={1600}
              height={1000}
              sizes="(min-width: 1152px) 1104px, 100vw"
              className="w-full h-auto"
            />
          </div>
          <figcaption className={caption}>{label("websiteHome")}</figcaption>
        </figure>

        {/* The portfolio capture is tall, so it sits beside the phones instead of stretching the page. */}
        <div className="mt-16 grid lg:grid-cols-12 gap-6">
          <figure className="lg:col-span-5">
            <div className={frame}>
              <Image
                src="/partnerships/nagarez/website-portfolio.jpg"
                alt={label("websitePortfolio")}
                width={1600}
                height={2450}
                sizes="(min-width: 1152px) 450px, (min-width: 1024px) 40vw, 100vw"
                className="w-full h-auto"
              />
            </div>
            <figcaption className={caption}>{label("websitePortfolio")}</figcaption>
          </figure>

          <div className="lg:col-span-7 grid grid-cols-2 gap-6 content-start">
            {MOBILE_SCREENSHOTS.map((shot, index) => (
              <figure key={shot.src} className={index % 2 === 1 ? "sm:mt-16" : undefined}>
                <div className={frame}>
                  <Image
                    src={shot.src}
                    alt={label(shot.caption)}
                    width={645}
                    height={1400}
                    sizes="(min-width: 1024px) 300px, 50vw"
                    className="w-full h-auto"
                  />
                </div>
                <figcaption className={caption}>{label(shot.caption)}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        <p className="mt-10 text-sm leading-relaxed text-[#6E6E73]">
          {t("partnerships.nagarez.experience.note")}
        </p>
      </div>
    </section>
  );
}
