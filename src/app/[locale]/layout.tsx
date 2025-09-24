import { NextIntlClientProvider, hasLocale } from "next-intl";
import Head from "./head";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClientParallaxProvider from "@/components/providers/ClientParallaxProvider";
import CookieBanner from "@/components/consent/CookieBanner";
import ConsentScripts from "@/components/consent/ConsentScripts";

import "@/app/globals.css";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-montserrat",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFFF",
};

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const awaitedParams = await Promise.resolve(params);
  const locale = awaitedParams.locale;

  if (!hasLocale(routing.locales, locale)) return {};

  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const { head } = messages;

  const urlObj = new URL(head.url);
  const baseUrl = urlObj.origin;

  return {
    title: head.title,
    description: head.description,
    keywords: head.keywords,
    authors: [{ name: "Fran Aragón" }],
    alternates: {
      canonical: head.url.replace("/es", ""),
      languages: {
        es: `${baseUrl}`,
        en: `${baseUrl}/en`,
        "x-default": `${baseUrl}`,
      },
    },
    openGraph: {
      type: "website",
      title: head.title,
      description: head.description,
      url: head.url,
      images: [{ url: head.image }],
    },
    twitter: {
      card: "summary_large_image",
      title: head.title,
      description: head.description,
      images: [head.image],
    },
    metadataBase: new URL(baseUrl),
    icons: { icon: "/logo.png" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const { head } = messages;

  const urlObj = new URL(head.url);
  const baseUrl = urlObj.origin;

  // --- JSON-LD objects ---
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}/#person`,
    name: "Fran Aragón",
    alternateName: "Francisco José Aragón Simón",
    jobTitle: "Frontend Developer",
    url: head.url,
    image: head.image,
    sameAs: [
      "https://www.linkedin.com/in/fran-aragon-simon/",
      "https://github.com/franaragondev",
    ],
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Frontend Development",
      "UX/UI",
    ],
  };

  const webSiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: head.title,
    inLanguage: locale,
  };

  const profilePageLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${head.url}#profile`,
    url: head.url,
    inLanguage: locale,
    isPartOf: { "@id": `${baseUrl}/#website` },
    about: { "@id": `${baseUrl}/#person` },
    name: head.title,
    description: head.description,
  };

  return (
    <html lang={locale} className={`${montserrat.variable}`}>
      <Head />
      <body>
        {/* <ConsentScripts
          analyticsId="G-MGGZV5VBEV"
          jsonLd={[
            { id: "ld-person", data: personLd },
            { id: "ld-website", data: webSiteLd },
            { id: "ld-profilepage", data: profilePageLd },
          ]}
        /> */}

        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <ClientParallaxProvider>
            <main>{children}</main>
            {/* <CookieBanner /> */}
          </ClientParallaxProvider>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
