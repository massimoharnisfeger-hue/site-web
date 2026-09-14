import { withPayload } from "@payloadcms/next/withPayload";

/**
 * Politique de sécurité du contenu.
 *
 * Elle couvre le site public ET le back-office : une CSP par route ouvrirait
 * la porte à un oubli le jour où une route est ajoutée.
 *
 * Deux permissivités sont assumées, et il faut savoir pourquoi :
 *   - `'unsafe-inline'` sur les scripts : Next.js hydrate la page avec des
 *     scripts en ligne, et `app/(frontend)/page.tsx` injecte deux blocs
 *     JSON-LD qui portent le référencement local (O4). Les interdire
 *     viderait la fiche d'établissement lue par Google.
 *   - `'unsafe-eval'` : l'administration Payload en a besoin.
 * Ce qui reste bloqué, et c'est l'essentiel : tout script venant d'un domaine
 * tiers, l'encadrement par un site externe, les objets embarqués, et la
 * réécriture de l'URL de base.
 */
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  // Équivaut à X-Frame-Options: SAMEORIGIN, pour les navigateurs récents.
  // Payload affiche l'aperçu du site dans une iframe de même origine.
  "frame-ancestors 'self'",
  "frame-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  // La feuille de police vient de Fontshare (déjà inscrit en dette technique).
  "style-src 'self' 'unsafe-inline' https://api.fontshare.com",
  "font-src 'self' data: https://cdn.fontshare.com",
  // Photos de démo Unsplash, et médias téléversés sur Vercel Blob.
  "img-src 'self' data: blob: https://images.unsplash.com https://*.public.blob.vercel-storage.com",
  "media-src 'self' blob: https://*.public.blob.vercel-storage.com",
  "connect-src 'self' https://*.public.blob.vercel-storage.com",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");

/**
 * En-têtes appliqués à toutes les routes.
 * `Strict-Transport-Security` n'est pas posé ici : Vercel le sert déjà, et
 * l'imposer depuis le code enfermerait un déploiement local en HTTPS.
 */
const ENTETES_SECURITE = [
  { key: "Content-Security-Policy", value: CSP },
  // Empêche le navigateur de deviner un type MIME et d'exécuter une image
  // téléversée comme du script.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Sans lui, /admin peut être encadré par un site tiers (détournement de clic).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Ne fuite pas le chemin complet vers les sites tiers.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Le site n'a besoin d'aucune de ces permissions.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Photos de démo
      { protocol: "https", hostname: "images.unsplash.com" },
      // Images uploadées dans Payload et stockées sur Vercel Blob
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: ENTETES_SECURITE }];
  },
};

// withPayload branche le back-office Payload sur Next.js
export default withPayload(nextConfig);
