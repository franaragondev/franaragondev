/** @type {import('next-sitemap').IConfig} */
const siteUrl = "https://www.franaragondev.com";

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 0.7,
  additionalPaths: async () => {
    const locales = ["es", "en"];
    const staticPages = [
      "", // Home
      "privacidad",
      "cookies",
    ];

    const urls = [];
    for (const locale of locales) {
      for (const page of staticPages) {
        urls.push({
          loc: `${siteUrl}/${locale}${page ? `/${page}` : ""}`,
          changefreq: "daily",
          priority: 0.7,
        });
      }
    }

    return urls;
  },
};
