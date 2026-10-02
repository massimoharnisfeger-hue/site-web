import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

/**
 * Seule la page d'accueil est indexable : les pages légales portent un
 * `noindex` et n'ont donc rien à faire dans le plan du site.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: new URL("/", siteUrl()).toString(), changeFrequency: "weekly", priority: 1 }];
}
