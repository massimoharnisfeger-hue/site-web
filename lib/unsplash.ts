/**
 * Recherche de photos via l'API Unsplash.
 *
 * Côté serveur uniquement : la clé n'est jamais exposée au navigateur.
 * Sans clé, sans réseau ou en cas d'erreur, chaque fonction renvoie null et
 * l'appelant retombe sur la photo par défaut — le site ne doit jamais se
 * retrouver sans image (principe II de la constitution).
 */

const API = "https://api.unsplash.com";

// Les conditions d'Unsplash imposent que les liens d'attribution portent des
// paramètres UTM identifiant l'application.
const UTM = "utm_source=padel_house&utm_medium=referral";

// Durée de mise en cache d'une recherche, en secondes. Le quota Unsplash est de
// 50 requêtes/heure en démo et 5000/heure en production : sans ce cache, une
// page rendue à chaque requête l'épuiserait en quelques minutes.
const CACHE_SECONDS = 86_400;

// Une page publique ne doit jamais attendre une API tierce.
const TIMEOUT_MS = 4_000;

export type UnsplashPhoto = {
  url: string;
  alt: string;
  creditName: string;
  creditLink: string;
};

type UnsplashUser = { name?: string; links?: { html?: string } };
type UnsplashResult = {
  urls?: { raw?: string };
  alt_description?: string | null;
  user?: UnsplashUser;
  links?: { download_location?: string };
};

function authHeaders(key: string) {
  return { Authorization: `Client-ID ${key}`, "Accept-Version": "v1" };
}

/**
 * Unsplash demande de signaler chaque utilisation d'une photo en appelant son
 * `download_location`. Appel au mieux : son échec ne doit rien casser.
 */
async function reportUse(downloadLocation: string, key: string) {
  try {
    await fetch(downloadLocation, {
      headers: authHeaders(key),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: CACHE_SECONDS },
    });
  } catch {
    // sans conséquence pour l'affichage
  }
}

/** Première photo verticale correspondant à la recherche, ou null. */
export async function searchPhoto(query: string): Promise<UnsplashPhoto | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key || !query.trim()) return null;

  const url =
    `${API}/search/photos?query=${encodeURIComponent(query)}` +
    `&orientation=portrait&per_page=1&content_filter=high`;

  try {
    const res = await fetch(url, {
      headers: authHeaders(key),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: CACHE_SECONDS },
    });

    if (!res.ok) {
      console.warn(`[unsplash] "${query}" : HTTP ${res.status}, repli sur la photo par défaut`);
      return null;
    }

    const data = (await res.json()) as { results?: UnsplashResult[] };
    const photo = data.results?.[0];
    const raw = photo?.urls?.raw;
    if (!photo || !raw) return null;

    if (photo.links?.download_location) {
      await reportUse(photo.links.download_location, key);
    }

    const name = photo.user?.name || "Unsplash";
    const profile = photo.user?.links?.html || "https://unsplash.com";

    return {
      // `raw` est une URL Imgix : on y ajoute nos paramètres de rendu.
      url: `${raw}&w=1400&q=80&auto=format&fit=crop`,
      alt: photo.alt_description || query,
      creditName: name,
      creditLink: `${profile}?${UTM}`,
    };
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.warn(`[unsplash] "${query}" indisponible (${reason}), repli sur la photo par défaut`);
    return null;
  }
}

/** Résout plusieurs recherches en parallèle. Les entrées vides donnent null. */
export async function searchPhotos(queries: string[]): Promise<(UnsplashPhoto | null)[]> {
  return Promise.all(queries.map((q) => (q ? searchPhoto(q) : Promise.resolve(null))));
}

/** Lien vers Unsplash exigé à côté du nom du photographe. */
export const UNSPLASH_LINK = `https://unsplash.com?${UTM}`;
