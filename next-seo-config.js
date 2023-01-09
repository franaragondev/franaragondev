const title = "Fran Aragón | Desarrollador Software y Diseñador Web";
const description =
  "Mi nombre es Fran y soy un joven desarrollador software y diseñador web nacido en Málaga (España).";

const SEO = {
  title,
  description,
  canonical: "https://franaragondev.com/",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://franaragondev.com/",
    title,
    description,
    images: [
      {
        url: "https://franaragondev.com/images/logo-landing2.png",
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    site_name: "Fran Aragón",
  },
};

export default SEO;