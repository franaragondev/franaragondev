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
 * Refined to eliminate trailing slash discrepancies and ensure
 * 100% alignment between canonical and hreflang tags.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

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

    // International SEO mapping (Hreflang strategy)
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        es: `${baseUrl}/es`,
        en: `${baseUrl}/en`,
        "x-default": `${baseUrl}/en`,
      },
    },

    // Open Graph config for high-fidelity social sharing previews
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "es_ES",
      url: `${baseUrl}/${locale}`,
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

    // Twitter Card optimization for B2B engagement
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
 * The foundational Server Component of the platform.
 * @param params - Handled as a Promise to comply with Next.js 15 asynchronous APIs.
 * Injects Semantic Web data (JSON-LD), handles GDPR compliance initialization,
 * and wraps the application tree in the i18n NextIntlClientProvider.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const { head } = messages;

  const urlObj = new URL(head.url);
  const baseUrl = urlObj.origin;

  /**
   * Structured Data (JSON-LD) - Knowledge Graph Optimization:
   * Translates professional trajectory into machine-readable entities.
   * Explicitly defining relationships with authoritative organizations (adidas, Solutia)
   * builds domain authority and signals trust to search algorithms.
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
      "https://twitter.com/franaragondev",
    ],
    knowsAbout: [
      "Software Architecture",
      "SaaS Development",
      "React",
      "Next.js",
      "TypeScript",
      "Swift",
      "Web Performance",
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
        {/* Analytics & Compliance Layer: Injects JSON-LD for Semantic SEO */}
        <ConsentScripts
          analyticsId="G-MGGZV5VBEV"
          jsonLd={[
            { id: "ld-person", data: personLd },
            { id: "ld-website", data: webSiteLd },
          ]}
        />

        {/* Global Application Shell */}
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
