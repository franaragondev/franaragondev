import type { Metadata } from "next";
import { getCommonMetadata } from "@/utils/getCommonMetadata";
import AppHero from "@/components/layout/AppHero";
import WhatIBuild from "@/components/layout/WhatIBuild";
import ProjectsSection from "@/components/layout/ProjectsSection";
import ExperienceSection from "@/components/layout/ExperienceSection";
import AboutSection from "@/components/layout/AboutSection";
import ContactSection from "@/components/layout/ContactSection";

/**
 * Static Site Generation (SSG) Configuration:
 * Revalidates the page every 60 seconds to ensure high-performance delivery
 * while maintaining eventual consistency with any backend or translation updates.
 */
export const revalidate = 60;

/**
/**
 * Dynamic Metadata Orchestration (Vercel Production Optimized):
 * Ensures 100/100 SEO score by explicitly providing title and description.
 * Next.js 15 requirement: params must be handled as a Promise.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  try {
    const messages = (await import(`../../../messages/${locale}.json`)).default;
    const common = (await getCommonMetadata(locale)) as Metadata;

    return {
      ...common,
      title: messages.head.title,
      description: messages.head.description,
      keywords: messages.head.keywords,
      alternates: {
        canonical: `${messages.head.url}/${locale}`,
        languages: {
          es: `${messages.head.url}/es`,
          en: `${messages.head.url}/en`,
          "x-default": `${messages.head.url}/en`,
        },
      },
      openGraph: {
        ...common?.openGraph,
        title: messages.head.title,
        description: messages.head.description,
        url: `${messages.head.url}/${locale}`,
      },
      twitter: {
        ...common?.twitter,
        title: messages.head.title,
        description: messages.head.description,
      },
    };
  } catch (error) {
    console.error("Metadata generation failed:", error);
    return {
      title: "Fran Aragón | Software Engineer",
      description: "Software Engineer based in Prague",
    };
  }
}

/**
 * Homepage (Main Landing):
 * Primary Server Component that orchestrates the core value propositions.
 * Sections are ordered following a logical marketing and conversion funnel:
 * High-impact hero -> Core services -> Professional bio -> Portfolio -> Trajectory -> Lead Gen.
 */
export default function Home() {
  return (
    <>
      {/* Visual hook and primary brand positioning */}
      <AppHero />

      {/* Categorization of technical service offerings */}
      <WhatIBuild />

      {/* Professional narrative and biographical overview */}
      <AboutSection />

      {/* Showcase of production-grade systems and templates */}
      <ProjectsSection />

      {/* Chronological career trajectory and milestones */}
      <ExperienceSection />

      {/* Primary lead generation and communication channel */}
      <ContactSection />
    </>
  );
}
