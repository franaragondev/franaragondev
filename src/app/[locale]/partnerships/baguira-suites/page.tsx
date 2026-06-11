import type { Metadata } from "next";
import { getCommonMetadata } from "@/utils/getCommonMetadata";

import BaguiraHero from "@/components/partnerships/baguira/BaguiraHero";
import BaguiraOverview from "@/components/partnerships/baguira/BaguiraOverview";
import BaguiraChallenge from "@/components/partnerships/baguira/BaguiraChallenge";
import BaguiraArchitecture from "@/components/partnerships/baguira/BaguiraArchitecture";
import BaguiraResults from "@/components/partnerships/baguira/BaguiraResults";
import BaguiraPhilosophy from "@/components/partnerships/baguira/BaguiraPhilosophy";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    ...(await getCommonMetadata(locale, "partnerships/baguira-suites")),
    title:
      "Baguira Suites Experiences | Luxury Hospitality Platform Case Study",
    description:
      "Case study covering architecture, performance engineering, SEO strategy and multilingual platform development for Baguira Suites Experiences.",
  };
}

export default function BaguiraCaseStudyPage() {
  return (
    <>
      <BaguiraHero />
      <BaguiraOverview />
      <BaguiraChallenge />
      <BaguiraArchitecture />
      <BaguiraResults />
      <BaguiraPhilosophy />
    </>
  );
}
