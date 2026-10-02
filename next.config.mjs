import { withPayload } from "@payloadcms/next/withPayload";

/**
 * Politique de sécurité du site public. Les scripts en ligne restent permis :
 * Next.js en a besoin pour hydrater la page, et les données structurées en
 * sont. Tout le reste est limité au site lui-même, aux banques d'images
 * utilisées par le contenu et à la barre d'outils Vercel des prévisualisations.
 */
const csp = [
  "default-src 'self'",
  // En développement, le rechargement à chaud de Next.js a besoin d'eval.
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'"} https://vercel.live`,
  "style-src 'self' 'unsafe-inline' https://vercel.live",
  "img-src 'self' data: blob: https://images.pexels.com https://images.unsplash.com https://*.public.blob.vercel-storage.com https://vercel.live https://vercel.com",
  "font-src 'self' https://vercel.live https://assets.vercel.com",
  "connect-src 'self' https://vercel.live wss://ws-us3.pusher.com",
  "frame-src https://vercel.live",
  // Le test du processeur graphique tourne dans un worker créé à la volée.
  "worker-src 'self' blob:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Métadonnées (titre, description, Open Graph) toujours écrites dans <head>,
  // pour tous les visiteurs et tous les outils d'analyse. La page attend déjà
  // le contenu avant de s'afficher : les diffuser en différé ne gagnait rien.
  htmlLimitedBots: /.*/,
  images: {
    remotePatterns: [
      // Photos de démo
      { protocol: "https", hostname: "images.unsplash.com" },
      // Images uploadées dans Payload et stockées sur Vercel Blob
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Le site public seulement : le back-office garde ses propres besoins.
      {
        source: "/((?!admin|api).*)",
        headers: [{ key: "Content-Security-Policy", value: csp }],
      },
    ];
  },
};

// withPayload branche le back-office Payload sur Next.js
const config = withPayload(nextConfig);
const payloadHeaders = config.headers;

export default {
  ...config,
  /**
   * Payload ajoute à toutes les routes des indices clients (`Critical-CH`)
   * qui ne servent qu'au thème du back-office. Sur le site public, `Critical-CH`
   * oblige Chrome à recharger la page une seconde fois à la première visite :
   * on les réserve à /admin.
   */
  async headers() {
    const rules = await payloadHeaders();
    return rules.map((rule) =>
      rule.source === "/:path*" && rule.headers.some((h) => h.key === "Critical-CH")
        ? { ...rule, source: "/admin/:path*" }
        : rule
    );
  },
};
