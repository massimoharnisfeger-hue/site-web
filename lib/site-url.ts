/**
 * Adresse publique du site, base des URL absolues (canonique, Open Graph,
 * sitemap, données structurées).
 *
 * `NEXT_PUBLIC_SITE_URL` permet de la fixer ; sinon Vercel fournit
 * `VERCEL_PROJECT_PRODUCTION_URL`. Sans l'une ni l'autre (en local), on
 * retombe sur localhost : mieux vaut une URL locale cohérente qu'une adresse
 * de production inventée.
 */
export function siteUrl(): URL {
  const brut =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000");
  try {
    return new URL(brut);
  } catch {
    return new URL("http://localhost:3000");
  }
}
