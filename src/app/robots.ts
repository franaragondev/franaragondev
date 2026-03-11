import { MetadataRoute } from "next";

/**
 * Dynamic Robots Configuration
 * * Enforces centralized crawling and ensures the host matches
 * the canonical origin to prevent "duplicate content" flags.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.franaragondev.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
