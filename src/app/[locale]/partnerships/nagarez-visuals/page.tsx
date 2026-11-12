import type { Metadata } from "next";
import { getCommonMetadata } from "@/utils/getCommonMetadata";

import NagarezHero from "@/components/partnerships/nagarez/NagarezHero";
import NagarezOverview from "@/components/partnerships/nagarez/NagarezOverview";
import NagarezChallenge from "@/components/partnerships/nagarez/NagarezChallenge";
import NagarezDirection from "@/components/partnerships/nagarez/NagarezDirection";
import NagarezHavn from "@/components/partnerships/nagarez/NagarezHavn";
import NagarezExperience from "@/components/partnerships/nagarez/NagarezExperience";
import NagarezResults from "@/components/partnerships/nagarez/NagarezResults";
import NagarezPhilosophy from "@/components/partnerships/nagarez/NagarezPhilosophy";

export const revalidate = 60;

const PAGE_PATH = "partnerships/nagarez-visuals";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const common = (await getCommonMetadata(locale, PAGE_PATH)) as Metadata;

  try {
    const messages = (await import(`../../../../../messages/${locale}.json`)).default;
    const { title, description } = messages.partnerships.nagarez.meta;

    return {
      ...common,
      title,
      description,
      openGraph: { ...common?.openGraph, title, description },
      twitter: { ...common?.twitter, title, description },
    };
  } catch {
    return common;
  }
}

export default function NagarezCaseStudyPage() {
  return (
    <>
      <NagarezHero />
      <NagarezOverview />
      <NagarezChallenge />
      <NagarezDirection />
      <NagarezHavn />
      <NagarezExperience />
      <NagarezResults />
      <NagarezPhilosophy />
    </>
  );
}
