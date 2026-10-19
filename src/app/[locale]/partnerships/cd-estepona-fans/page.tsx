import type { Metadata } from "next";
import { getCommonMetadata } from "@/utils/getCommonMetadata";

import CdEsteponaHero from "@/components/partnerships/cdestepona/CdEsteponaHero";
import CdEsteponaOverview from "@/components/partnerships/cdestepona/CdEsteponaOverview";
import CdEsteponaChallenge from "@/components/partnerships/cdestepona/CdEsteponaChallenge";
import CdEsteponaEcosystem from "@/components/partnerships/cdestepona/CdEsteponaEcosystem";
import CdEsteponaArchitecture from "@/components/partnerships/cdestepona/CdEsteponaArchitecture";
import CdEsteponaEngineering from "@/components/partnerships/cdestepona/CdEsteponaEngineering";
import CdEsteponaExperience from "@/components/partnerships/cdestepona/CdEsteponaExperience";
import CdEsteponaResults from "@/components/partnerships/cdestepona/CdEsteponaResults";
import CdEsteponaPhilosophy from "@/components/partnerships/cdestepona/CdEsteponaPhilosophy";

export const revalidate = 60;

const PAGE_PATH = "partnerships/cd-estepona-fans";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const common = (await getCommonMetadata(locale, PAGE_PATH)) as Metadata;

  try {
    const messages = (await import(`../../../../../messages/${locale}.json`)).default;
    const { title, description } = messages.partnerships.cdestepona.meta;

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

export default function CdEsteponaCaseStudyPage() {
  return (
    <>
      <CdEsteponaHero />
      <CdEsteponaOverview />
      <CdEsteponaChallenge />
      <CdEsteponaEcosystem />
      <CdEsteponaArchitecture />
      <CdEsteponaEngineering />
      <CdEsteponaExperience />
      <CdEsteponaResults />
      <CdEsteponaPhilosophy />
    </>
  );
}
