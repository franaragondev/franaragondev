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
 * Revalidates the page cache every 60 seconds to balance high-performance
 * delivery with dynamic content updates.
 */
export const revalidate = 60;

/**
 * Dynamic Metadata Orchestration:
 * @param params - Handled as a Promise to comply with Next.js 15 async API.
 * This function explicitly defines title and description to prevent metadata
 * merging conflicts and ensure a 100/100 SEO score.
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

    const baseUrl = "https://www.franaragondev.com";

    /**
     * Canonical URL Logic:
     * English remains the root domain. Any other locale (es, fr) appends its prefix.
     */
    const currentCanonical = locale === "en" ? baseUrl : `${baseUrl}/${locale}`;

    return {
      ...common,
      title: messages.head.title,
      description: messages.head.description,
      keywords: messages.head.keywords,
      alternates: {
        canonical: currentCanonical,
        languages: {
          en: baseUrl,
          es: `${baseUrl}/es`,
          fr: `${baseUrl}/fr`, // Added French locale support
          "x-default": baseUrl,
        },
      },
      openGraph: {
        ...common?.openGraph,
        title: messages.head.title,
        description: messages.head.description,
        url: currentCanonical,
      },
      twitter: {
        ...common?.twitter,
        title: messages.head.title,
        description: messages.head.description,
      },
    };
  } catch (error) {
    console.error("Critical: Metadata generation failed in production", error);
    return {
      title: "Fran Aragón | Software Engineer",
      description:
        "Software Engineer specializing in scalable digital products.",
    };
  }
}

/**
 * Homepage (Main Landing):
 * Primary Server Component orchestrating the core value propositions.
 * Layout sequence follows a strategic conversion funnel designed to build
 * authority before reaching the primary Call to Action (CTA).
 */
export default function Home() {
  return (
    <>
      {/* High-fidelity hero with priority LCP optimization */}
      <AppHero />

      {/* Strategic service categorization */}
      <WhatIBuild />

      {/* Biographical narrative and social proof */}
      <AboutSection />

      {/* Engineering portfolio and production-grade case studies */}
      <ProjectsSection />

      {/* Professional trajectory and milestone logging */}
      <ExperienceSection />

      {/* Lead generation channel and contact orchestration */}
      <ContactSection />
    </>
  );
}
