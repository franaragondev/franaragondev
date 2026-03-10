"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";

/**
 * ProjectsSection Component
 * * A high-fidelity showcase of engineering output. It utilizes a dual-layout strategy:
 * 1. Static Bento Grid: Highlights high-impact, full-cycle featured products.
 * 2. Infinite CSS Marquee: Displays a broader ecosystem of architectural templates and UI systems.
 */
export default function ProjectsSection() {
  const t = useTranslations("projects");

  /** * Featured Case Studies:
   * Represents production-ready applications with specific tech-stack attribution.
   */
  const featuredProjects = [
    {
      id: "homestocker",
      title: t("homestocker.title"),
      description: t("homestocker.description"),
      url: "https://homestocker.app/",
      image: "https://homestocker.app/logo-simple.webp",
      tech: ["Swift", "Native iOS", "Cloud Architecture"],
    },
    {
      id: "cdestepona",
      title: t("cdestepona.title"),
      description: t("cdestepona.description"),
      url: "https://www.cdesteponafans.com/",
      image: "https://www.cdesteponafans.com/logo.png",
      tech: ["Next.js", "Prisma", "PostgreSQL"],
    },
  ];

  /** * Architectural Templates:
   * Reusable systems and boilerplate engines. Displayed via an infinite loop.
   */
  const templates = [
    {
      id: "sportsteam-template",
      title: "SportsTeam Architecture",
      url: "https://www.sportsteamtemplate.com/",
      image: "https://www.sportsteamtemplate.com/logo.webp",
    },
    {
      id: "restaurant-template",
      title: "Restaurant Template",
      url: "https://restaurant-template.franaragondev.com/",
      image: "https://restaurant-template.franaragondev.com/logo.png",
    },
    {
      id: "business-template",
      title: "Business Core Engine",
      url: "https://businesstemplate.franaragondev.com/",
      image: "https://businesstemplate.franaragondev.com/logo.png",
    },
  ];

  // Triplicating the array to ensure a seamless infinite loop without visual flickering
  const loopTemplates = [...templates, ...templates, ...templates];

  return (
    <section 
      id="projects" 
      className="relative py-32 bg-white dark:bg-[#111111] overflow-hidden border-b border-black/5 dark:border-white/5 scroll-mt-24"
    >
      
      {/* High-Performance CSS Marquee:
          Delegating the animation to the CSS engine ensures 60fps performance 
          and hardware acceleration via transform: translateX. 
          Includes a 'paused' state on hover for improved user interaction.
      */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 20s linear infinite;
        }
        .marquee-container:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>

      {/* SECTION 1: FEATURED CASE STUDIES */}
      <div className="px-4 md:px-12">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-[#1D1D1F] dark:text-[#F5F5F7]">
            {t("title")}
          </h2>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
          {featuredProjects.map((project) => (
            <a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col p-10 md:p-12 rounded-[2.5rem] bg-[#F5F5F7] dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="flex items-center gap-6 mb-8">
                {/* Brand Identity / Logo container with micro-scale interaction */}
                <div className="w-16 h-16 relative rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-[#2C2C2E] p-2 transition-transform duration-500 group-hover:scale-110">
                  <Image src={project.image} alt={project.title} fill className="object-contain" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
                    {project.title}
                  </h3>
                  {/* Tech Stack Metadata Tags */}
                  <div className="flex gap-2 mt-2">
                    {project.tech.map((tag) => (
                      <span key={tag} className="text-[10px] uppercase tracking-widest font-bold text-[#86868B]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-[#515154] dark:text-[#A1A1A6] text-lg leading-relaxed font-medium tracking-tight mb-8">
                {project.description}
              </p>

              {/* External CTA with semantic Lucide icon */}
              <div className="mt-auto flex items-center gap-2 text-sm font-bold text-[#1D1D1F] dark:text-white group-hover:gap-3 transition-all">
                {t("viewProject")} <ExternalLink size={16} />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* SECTION 2: ECOSYSTEM INFRASTRUCTURE (MARQUEE) */}
      <div className="marquee-container relative py-12 group cursor-default">
        <div className="text-center mb-12 px-4">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#86868B]">
            Infrastructure & UI Systems
          </p>
        </div>

        {/* Edge Fading Gradients:
            Absolutely positioned overlays that create a visual 'fade-in/out' effect
            at the edges of the viewport, enhancing the infinite motion feel.
        */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-[#111111] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-[#111111] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee gap-8 px-4">
          {loopTemplates.map(({ id, title, url, image }, idx) => (
            <a
              key={`${id}-${idx}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-8 py-5 rounded-3xl bg-[#F5F5F7]/50 dark:bg-[#1C1C1E]/50 border border-black/5 dark:border-white/5 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-500"
            >
              <div className="w-10 h-10 relative flex-shrink-0">
                <Image src={image} alt={title} fill className="object-contain" />
              </div>
              <span className="text-sm font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] whitespace-nowrap">
                {title}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}