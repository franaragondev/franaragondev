import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

type Locale = "es" | "en" | "fr";

const validLocales = routing.locales as unknown as Locale[];

/**
 * Shared social preview image (public/og-image.png, 1200x630).
 * Used for both Open Graph and Twitter cards across every locale.
 */
export function getOgImage(baseUrl: string) {
  return {
    url: `${baseUrl}/og-image.png`,
    width: 1200,
    height: 630,
    alt: "Fran Aragón - Software Engineer",
  };
}

export async function getCommonMetadata(
  locale: string,
  pagePath = "",
): Promise<Metadata | object> {
  if (!validLocales.includes(locale as Locale)) {
    return {};
  }

  const typedLocale = locale as Locale;
  try {
    const messages = (await import(`../../messages/${typedLocale}.json`))
      .default;
    const { head } = messages;

    const urlObj = new URL(head.url);
    const baseUrl = urlObj.origin; // https://www.franaragondev.com

    const normalizedPath =
      pagePath && pagePath !== "/"
        ? pagePath.startsWith("/")
          ? pagePath
          : `/${pagePath}`
        : "";

    const canonicalUrl =
      typedLocale === "en"
        ? `${baseUrl}${normalizedPath}`
        : `${baseUrl}/${typedLocale}${normalizedPath}`;

    return {
      metadataBase: new URL(baseUrl),
      title: head.title,
      description: head.description,
      keywords: head.keywords,

      alternates: {
        canonical: canonicalUrl,
        languages: {
          en: `${baseUrl}${normalizedPath}`,
          es: `${baseUrl}/es${normalizedPath}`,
          fr: `${baseUrl}/fr${normalizedPath}`,
          "x-default": `${baseUrl}${normalizedPath}`,
        },
      },
      openGraph: {
        type: "website",
        title: head.title,
        description: head.description,
        url: canonicalUrl,
        images: [getOgImage(baseUrl)],
      },
      twitter: {
        card: "summary_large_image",
        title: head.title,
        description: head.description,
        images: [getOgImage(baseUrl)],
      },
    };
  } catch (error) {
    console.error(`Error loading messages for locale: ${typedLocale}`, error);
    return {};
  }
}
