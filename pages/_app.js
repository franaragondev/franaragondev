import "../styles/globals.css";
import Head from "next/head";
import { DefaultSeo } from "next-seo";
import SEO from "../next-seo-config";
import '../i18n'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/ico" href="/images/logo.png" />
        <link rel="apple-touch-icon" type="image/ico" href="/images/logo.png" />
        <meta name="viewport" content="viewport-fit=cover" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      </Head>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
