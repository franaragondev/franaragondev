import { NextIntlClientProvider, hasLocale } from "next-intl";
import Script from "next/script";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClientParallaxProvider from "@/components/providers/ClientParallaxProvider";
import CookieBanner from "@/components/consent/CookieBanner";
import ConsentScripts from "@/components/consent/ConsentScripts";
import Head from "next/head";

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
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

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
      canonical: head.url,
      languages: {
        es: `${baseUrl}/es`,
        en: `${baseUrl}/en`,
        "x-default": `${baseUrl}/en`,
      },
    },
    openGraph: {
      type: "website",
      title: head.title,
      description: head.description,
      url: head.url,
      images: head.image,
    },
    twitter: {
      card: "summary_large_image",
      title: head.title,
      description: head.description,
      images: head.image,
    },
    metadataBase: new URL(baseUrl),
    icons: {
      icon: "/logo.png",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const { head } = messages;
  const urlObj = new URL(head.url);
  const baseUrl = urlObj.origin;

  // URLs hreflang
  const hreflangUrls = {
    es: `${baseUrl}/es${urlObj.pathname.replace(/^\/(es|en)/, "")}`,
    en: `${baseUrl}/en${urlObj.pathname.replace(/^\/(es|en)/, "")}`,
  };

  return (
    <html lang={locale} className={`${montserrat.variable}`}>
      <Head>
        {/* Canonical */}
        <link rel="canonical" href={head.url} />

        {/* Hreflang for each language */}
        {Object.entries(hreflangUrls).map(([lang, href]) => (
          <link key={lang} rel="alternate" hrefLang={lang} href={href} />
        ))}

        {/* x-default */}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${baseUrl}/es${urlObj.pathname.replace(/^\/(es|en)/, "")}`}
        />
      </Head>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MKN4Y24X76"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-MKN4Y24X76');
          `}
        </Script>

        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <ClientParallaxProvider>
            <main>{children}</main>
            <ConsentScripts />
            <CookieBanner />
          </ClientParallaxProvider>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
