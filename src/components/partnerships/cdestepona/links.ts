/** Public destinations for the CD Estepona Fans case study, verified against the live listings. */
export const CDESTEPONA_WEBSITE_URL = "https://www.cdesteponafans.com";
export const CDESTEPONA_APP_STORE_URL =
  "https://apps.apple.com/app/cd-estepona-fans/id6811055482";

/** The site's default locale (Spanish) has no prefix, matching its routing. */
export function cdesteponaWebsiteUrl(locale: string): string {
  return locale === "es" ? CDESTEPONA_WEBSITE_URL : `${CDESTEPONA_WEBSITE_URL}/${locale}`;
}
