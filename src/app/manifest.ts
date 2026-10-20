import { MetadataRoute } from "next";

/**
 * Web App Manifest
 * Served at /manifest.webmanifest. Favicon, SVG icon and Apple touch icon
 * come from the file conventions in src/app (favicon.ico, icon.svg,
 * apple-icon.png); these entries cover Android and installable PWAs.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fran Aragón — Software Engineer",
    short_name: "Fran Aragón",
    description:
      "Independent Software Engineer based in Prague. Specializing in scalable SaaS architectures, enterprise-grade web platforms, and high-performance digital products for global partners.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
