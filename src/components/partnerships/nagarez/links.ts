/** Public destinations for the Nagarez Visuals case study, verified against the live sites. */
export const NAGAREZ_WEBSITE_URL = "https://www.nagarezvisuals.com";
export const HAVN_URL = "https://havnplatform.com";

/** Both sites prefix every locale, so the visitor lands on their own language. */
export function nagarezWebsiteUrl(locale: string): string {
  return `${NAGAREZ_WEBSITE_URL}/${locale}`;
}

export function havnUrl(locale: string): string {
  return `${HAVN_URL}/${locale}`;
}
