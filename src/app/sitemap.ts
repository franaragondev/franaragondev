import { MetadataRoute } from "next";

/**
 * Native App Router Sitemap
 * * Dynamically generates a flat XML structure for optimal Googlebot crawling.
 * * Prioritizes core business pages (1.0) over legal/utility pages (0.5) 
 * to guide the 'crawl budget' effectively.
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
    // Legal & Compliance Routes (Lower Priority)
    {
      url: `${baseUrl}/en/privacidad`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/es/privacidad`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/en/cookies`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/es/cookies`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}