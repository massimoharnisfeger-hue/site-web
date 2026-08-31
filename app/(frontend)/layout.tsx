import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import CustomCursor from "@/components/fx/CustomCursor";
import Preloader from "@/components/fx/Preloader";

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <Preloader />
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
