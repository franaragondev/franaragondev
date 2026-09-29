"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

/**
 * Engagement:
 * A single client project delivered within a wider professional experience.
 * Allows one employment entry (e.g. Proxify) to host multiple client projects
 * over time without duplicating the employment relationship itself.
 */
type Engagement = {
  id: string;
  client: string;
  title: string;
  description: string;
  period: string;
  responsibilities: string[];
  technologies: string[];
};

/**
 * EngagementSource:
 * The locale-invariant definition of an engagement. Everything translatable,
 * including its period label, is resolved from the message files.
 */
type EngagementSource = {
  id: string;
  technologies: string[];
};

type Experience = {
  id: string;
  logo: string;
  role: string;
  company: string;
  period: string;
  responsibilities?: string[];
  engagements?: Engagement[];
};

/**
 * Proxify Engagement Registry:
 * Holds only the locale-invariant data of each engagement. All copy lives in
 * `messages/{locale}.json` under `experience.proxify.engagements.<id>`.
 * Adding a future client means appending one entry here plus its translations.
 */
const PROXIFY_ENGAGEMENTS: EngagementSource[] = [
  {
    id: "investmentPlatform",
    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "PostgreSQL",
      "Drizzle",
      "Supabase",
      "Vercel",
      "Microsoft Entra",
      "Microsoft Graph",
    ],
  },
];

/**
 * ResponsibilityList Component
 * Shared bullet rendering for both experience-level and engagement-level points.
 * Empty entries are filtered out to avoid orphan bullets.
 */
function ResponsibilityList({ points }: { points: string[] }) {
  const visible = points.filter((point) => point && point.trim() !== "");

  if (visible.length === 0) return null;

  return (
    <ul className="space-y-3">
      {visible.map((point, idx) => (
        <li
          key={idx}
          className="flex text-[#515154] dark:text-[#A1A1A6] text-base md:text-lg leading-relaxed tracking-tight font-medium"
        >
          <span
            className="text-[#1D1D1F] dark:text-white mr-3 mt-1.5 opacity-40"
            aria-hidden="true"
          >
            →
          </span>
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * ExperienceSection Component
 * Renders a vertical chronological timeline showcasing professional trajectory.
 * Designed with a focus on information density, readability, and visual hierarchy.
 * Utilizes a "Bento-grid" card aesthetic paired with a semantic vertical timeline.
 */
export default function ExperienceSection() {
  const t = useTranslations("experience");

  /**
   * Data Normalization:
   * Professional experiences are mapped into an array to maintain a DRY architecture.
   */
  const experiences: Experience[] = [
    {
      id: "proxify",
      logo: "/experience/proxify.png",
      role: t("proxify.title"),
      company: "Proxify",
      period: t("proxify.period"),
      engagements: PROXIFY_ENGAGEMENTS.map(({ id, technologies }) => ({
        id,
        client: t(`proxify.engagements.${id}.client`),
        title: t(`proxify.engagements.${id}.title`),
        description: t(`proxify.engagements.${id}.description`),
        period: t(`proxify.engagements.${id}.period`),
        responsibilities: t.raw(
          `proxify.engagements.${id}.responsibilities`,
        ) as string[],
        technologies,
      })),
    },
    {
      id: "solutia",
      logo: "/experience/solutia.jpg",
      role: t("solutia.title"),
      company: "Solutia s.r.o.",
      period: t("solutia.period"),
      responsibilities: [
        t("solutia.point1"),
        t("solutia.point2"),
        t("solutia.point3"),
      ],
    },
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
        t("adidas.point4"),
      ],
    },
    {
      id: "cei",
      logo: "/experience/cei.png",
      role: t("cei.title"),
      company: "CEI Escuela de Diseño y Marketing",
      period: t("cei.period"),
      responsibilities: [t("cei.point1"), t("cei.point2")],
    },
    {
      id: "gransliving",
      logo: "/experience/gransliving.png",
      role: t("gransliving.title"),
      company: "GransLiving",
      period: t("gransliving.period"),
      responsibilities: [
        t("gransliving.point1"),
        t("gransliving.point2"),
        t("gransliving.point3"),
      ],
    },
  ];

  return (
    <section
      id="experience"
      className="relative px-4 md:px-12 py-32 bg-[#F5F5F7] dark:bg-[#000000] scroll-mt-24 border-b border-black/5 dark:border-white/5"
    >
      {/* Section Title */}
      <div className="text-center mb-24">
        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-[#1D1D1F] dark:text-[#F5F5F7]">
          {t("title")}
        </h2>
      </div>

      {/* Vertical Timeline Container */}
      <div className="max-w-4xl mx-auto relative border-l border-[#D2D2D7] dark:border-[#333336] pl-8 space-y-16">
        {experiences.map(
          ({
            id,
            logo,
            role,
            company,
            period,
            responsibilities,
            engagements,
          }) => (
            <div key={id} className="relative group">
              {/* Timeline Anchor Point */}
              <span className="absolute left-[-37px] top-6 w-[10px] h-[10px] bg-[#1D1D1F] dark:bg-white rounded-full ring-4 ring-[#F5F5F7] dark:ring-[#000000] transition-transform duration-300 group-hover:scale-150" />

              {/* Experience Card */}
              <article className="relative bg-white dark:bg-[#1C1C1E] rounded-[2rem] p-8 md:p-10 border border-black/5 dark:border-white/5 shadow-sm transition-shadow duration-500 hover:shadow-xl">
                {/* Header: Company Identity & Role */}
                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                  {/* Logo Container */}
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center p-3 shadow-sm">
                    <Image
                      src={logo}
                      alt={company}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-[#1D1D1F] dark:text-white">
                      {role}
                    </h3>
                    <p className="text-[#6E6E73] text-sm uppercase tracking-widest font-semibold mt-1">
                      {company} <span className="mx-2 text-[#D2D2D7]">•</span>{" "}
                      {period}
                    </p>
                  </div>
                </div>

                {/* Responsibilities List: Conditionally rendered to avoid empty bullets */}
                {responsibilities && (
                  <ResponsibilityList points={responsibilities} />
                )}

                {/* Client Engagements: Projects delivered within this experience */}
                {engagements && engagements.length > 0 && (
                  <div className="space-y-6">
                    {engagements.map((engagement) => (
                      <div
                        key={engagement.id}
                        className="rounded-[1.5rem] bg-[#F5F5F7] dark:bg-[#111111] border border-black/5 dark:border-white/5 p-6 md:p-8"
                      >
                        {/* Engagement Identity & Timeframe */}
                        <p className="text-[#6E6E73] text-xs uppercase tracking-widest font-semibold">
                          {engagement.client}
                          <span
                            className="mx-2 text-[#D2D2D7]"
                            aria-hidden="true"
                          >
                            •
                          </span>
                          {engagement.period}
                        </p>
                        <h4 className="text-xl md:text-2xl font-bold tracking-tight text-[#1D1D1F] dark:text-white mt-2">
                          {engagement.title}
                        </h4>

                        <p className="text-[#515154] dark:text-[#A1A1A6] text-base md:text-lg leading-relaxed tracking-tight font-medium mt-4">
                          {engagement.description}
                        </p>

                        <div className="mt-6">
                          <ResponsibilityList
                            points={engagement.responsibilities}
                          />
                        </div>

                        {/* Tech Stack Metadata Tags */}
                        <div className="flex flex-wrap gap-2 mt-8">
                          {engagement.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-[10px] uppercase tracking-widest font-bold text-[#6E6E73] dark:text-[#A1A1A6]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
