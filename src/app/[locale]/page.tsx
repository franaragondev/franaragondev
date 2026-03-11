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
 * Dynamic Metadata Orchestration:
 * @param params - Handled as a Promise to comply with Next.js 15 async API.
 * Leverages shared metadata utilities to ensure consistent SEO signals across
 * localized home routes.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return await getCommonMetadata(locale);
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
