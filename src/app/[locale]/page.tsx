import type { Metadata } from "next";
import { getCommonMetadata } from "@/utils/getCommonMetadata";
import AppHero from "@/components/layout/AppHero";

export const revalidate = 60;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMetadata(ctx: any): Promise<Metadata> {
  const locale = ctx.params.locale;
  return await getCommonMetadata(locale);
}

export default function Home() {
  return (
    <>
      <AppHero />
    </>
  );
}
