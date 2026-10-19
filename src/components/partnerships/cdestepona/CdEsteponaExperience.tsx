"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

const IOS_SCREENSHOTS = [
  { src: "/partnerships/cdestepona/ios-home.jpg", caption: "iosHome" },
  { src: "/partnerships/cdestepona/ios-match-centre.jpg", caption: "iosMatchCentre" },
  { src: "/partnerships/cdestepona/ios-widgets.jpg", caption: "iosWidgets" },
  { src: "/partnerships/cdestepona/ios-live-activity.jpg", caption: "iosLiveActivity" },
] as const;

export default function CdEsteponaExperience() {
  const t = useTranslations();

  return (
    <section className="py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">
          {t("partnerships.cdestepona.experience.title")}
        </h2>

        <p className="text-xl leading-relaxed text-[#6E6E73] mb-16">
          {t("partnerships.cdestepona.experience.paragraph")}
        </p>

        <figure>
          <div className="overflow-hidden rounded-3xl border border-black/5 dark:border-white/10 bg-[#F5F5F7] dark:bg-[#1C1C1E]">
            <Image
              src="/partnerships/cdestepona/website-home.jpg"
              alt={t("partnerships.cdestepona.experience.captions.website")}
              width={1600}
              height={1000}
              sizes="(min-width: 1152px) 1104px, 100vw"
              className="w-full h-auto"
            />
          </div>
          <figcaption className="mt-4 text-sm uppercase tracking-widest text-[#6E6E73]">
            {t("partnerships.cdestepona.experience.captions.website")}
          </figcaption>
        </figure>

        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {IOS_SCREENSHOTS.map((shot) => (
            <figure key={shot.src}>
              <div className="overflow-hidden rounded-3xl bg-[#F5F5F7] dark:bg-[#1C1C1E]">
                <Image
                  src={shot.src}
                  alt={t(`partnerships.cdestepona.experience.captions.${shot.caption}`)}
                  width={644}
                  height={1400}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="w-full h-auto"
                />
              </div>
              <figcaption className="mt-4 text-sm uppercase tracking-widest text-[#6E6E73]">
                {t(`partnerships.cdestepona.experience.captions.${shot.caption}`)}
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-10 text-sm leading-relaxed text-[#6E6E73]">
          {t("partnerships.cdestepona.experience.note")}
        </p>
      </div>
    </section>
  );
}
