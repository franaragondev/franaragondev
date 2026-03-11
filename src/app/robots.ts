import { MetadataRoute } from "next";

/**
 * Dynamic Robots configuration
 * * Enforces centralized crawling and points directly to the native sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://www.franaragondev.com/sitemap.xml",
    host: "https://www.franaragondev.com",
  };
}