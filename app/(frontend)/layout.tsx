import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import CustomCursor from "@/components/fx/CustomCursor";
import Preloader from "@/components/fx/Preloader";
import { getHome } from "@/lib/content";

/**
 * Base de résolution des URL de métadonnées.
 *
 * Sans elle, une image Open Graph téléversée depuis le back-office est servie
 * sous une URL relative que Next résout contre `http://localhost:3000` : aucun
 * aperçu ne s'affiche au partage, alors que c'est le premier canal d'un club
 * de sport local. `VERCEL_PROJECT_PRODUCTION_URL` est fournie automatiquement
 * par Vercel ; `NEXT_PUBLIC_SITE_URL` permet de la surcharger.
 */
function baseMetadonnees(): URL | undefined {
  const brut =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "");
  if (!brut) return undefined;
  try {
    return new URL(brut);
  } catch {
    return undefined;
  }
}

export const metadata: Metadata = {
  metadataBase: baseMetadonnees(),
  title: "Padel House — Le jeu commence ici",
  description:
    "Club de padel nouvelle génération. Réservez un terrain, prenez un cours, jouez vos tournois. Initiation, coaching, location de courts et événements.",
};

export const viewport: Viewport = {
  themeColor: "#1B4DE4",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { brand } = await getHome();

  return (
    <html lang="fr">
      <head>
        {/* Les fichiers de police sont servis par cdn.fontshare.com : on ouvre
            les deux connexions avant même que la feuille ne soit analysée. */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=general-sans@400,500,600&display=swap"
        />
      </head>
      <body className="grain antialiased">
        {/* Le nom du club était écrit en dur ici : le renommer depuis le
            back-office laissait l'ancien nom sur l'écran de chargement.
            `getHome` est mémoïsée, cette lecture ne coûte donc rien de plus
            que celle déjà faite par la page. */}
        <Preloader brand={brand} />
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
