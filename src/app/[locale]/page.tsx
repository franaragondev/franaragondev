"use client";

import AppHero from "@/components/layout/AppHero";
import AboutSection from "@/components/layout/AboutSection";
import ProjectsSection from "@/components/layout/ProjectsSection";
import ExperienceSection from "@/components/layout/ExperienceSection";
import ContactSection from "@/components/layout/ContactSection";

export default function Home() {
  return (
    <>
      <AppHero />
      <AboutSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
    </>
  );
}
