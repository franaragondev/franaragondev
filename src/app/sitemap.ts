import { MetadataRoute } from "next";

/**
 * Native App Router Sitemap
 * * Dynamically generates a flat XML structure for optimal Googlebot crawling.
 * * Synchronized with 'Zero Trailing Slash' policy to ensure 100/100 SEO score.
 * * Prioritizes high-value engineering projects over legal utility pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.franaragondev.com";

  return [
    // Core Business Routes (Highest Priority)
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/es`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },

    // Legal & Compliance Routes (Priority 0.3 - Lower to focus Crawl Budget)
    {
      url: `${baseUrl}/en/privacidad`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/es/privacidad`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/en/cookies`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/es/cookies`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
