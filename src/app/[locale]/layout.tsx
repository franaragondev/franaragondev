import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClientParallaxProvider from "@/components/providers/ClientParallaxProvider";
import CookieBanner from "@/components/consent/CookieBanner";
import ConsentScripts from "@/components/consent/ConsentScripts";

import "@/app/globals.css";
import { Montserrat } from "next/font/google";

/**
 * Typography Architecture:
 * Leverages Next.js font optimization to serve Montserrat via CSS variables.
 * This guarantees zero Cumulative Layout Shift (CLS) and sub-setting for optimal 
 * payload size and rendering performance.
 */
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-montserrat",
});

/**
 * Viewport & Progressive Web App (PWA) Config:
 * The #000000 theme color ensures the iOS/Safari status bar blends seamlessly 
 * with the application's dark-mode aesthetics, providing a native-app-like immersion.
 */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000", 
};

/**
 * Dynamic Metadata Generator (Technical SEO & Social Graph):
 * * Orchestrates localized metadata to ensure perfect search engine indexing.
 * * Implements Canonical URLs and hreflang alternatives to prevent duplicate 
 * content penalties across the en/es routes.
 * * Configures Open Graph and Twitter Cards for high-conversion social sharing previews.
 */
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
    metadataBase: new URL(baseUrl),
    title: {
      default: head.title,
      template: "%s | Fran Aragón",
    },
    description: head.description,
    keywords: head.keywords,
    authors: [{ name: "Fran Aragón", url: baseUrl }],
    creator: "Fran Aragón",
    publisher: "Fran Aragón",
    
    // Strict crawler directives ensuring optimal indexation of high-value assets
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    
    // International SEO mapping
    alternates: {
      canonical: head.url,
      languages: {
        es: `${baseUrl}/es`,
        en: `${baseUrl}/en`,
        "x-default": `${baseUrl}/en`,
      },
    },
    
    // Open Graph config for LinkedIn/iMessage rich previews
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "es_ES",
      url: head.url,
      siteName: "Fran Aragón — Software Engineer",
      title: head.title,
      description: head.description,
      images: [
        {
          url: head.image,
          width: 1200,
          height: 630,
          alt: "Fran Aragón - Software Engineer & Frontend Lead",
        },
      ],
    },
    
    // Twitter Card optimization
    twitter: {
      card: "summary_large_image",
      title: head.title,
      description: head.description,
      creator: "@franaragondev",
      images: [head.image],
    },
    icons: { 
      icon: "/logo.png",
      apple: "/logo.png", 
    },
  };
}

/**
 * Root Locale Layout:
 * * The foundational Server Component of the platform.
 * * Injects Semantic Web data (JSON-LD), handles GDPR compliance initialization, 
 * and wraps the application tree in necessary context providers.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const { head } = messages;

  const urlObj = new URL(head.url);
  const baseUrl = urlObj.origin;

  /**
   * Structured Data (JSON-LD) - Knowledge Graph Optimization:
   * Translates the professional trajectory into machine-readable entities.
   * Explicitly defining relationships with authoritative organizations (adidas, Solutia)
   * instantly builds domain authority and trust signals for search algorithms.
   */
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}/#person`,
    name: "Fran Aragón",
    jobTitle: "Software Engineer & Frontend Lead", 
    worksFor: {
      "@type": "Organization",
      name: "Solutia s.r.o.",
    },
    alumniOf: {
      "@type": "Organization",
      name: "adidas",
    },
    url: baseUrl,
    image: head.image,
    sameAs: [
      "https://www.linkedin.com/in/fran-aragon-simon/",
      "https://github.com/franaragondev",
      "https://twitter.com/franaragondev"
    ],
    knowsAbout: [
      "Software Architecture",
      "SaaS Development",
      "React",
      "Next.js",
      "TypeScript",
      "Swift",
      "Web Performance"
    ],
  };

  const webSiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: "Fran Aragón — Software Engineer",
    inLanguage: locale,
  };

  return (
    <html lang={locale} className={`${montserrat.variable}`}>
      <body>
        {/* Analytics & Legal Compliance Layer */}
        <ConsentScripts
          analyticsId="G-MGGZV5VBEV"
          jsonLd={[
            { id: "ld-person", data: personLd },
            { id: "ld-website", data: webSiteLd },
          ]}
        />

        {/* Global Application State & UI Shell */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <ClientParallaxProvider>
            <main>{children}</main>
            <CookieBanner />
          </ClientParallaxProvider>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}