import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import RevealObserver from "@/components/fx/RevealObserver";
import { display, mono, sans } from "./fonts";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: "Padel House — Club de padel",
  description:
    "Club de padel : réservez un terrain, prenez un cours, jouez vos tournois. Initiation, coaching, location de courts et événements.",
};

export const viewport: Viewport = {
  themeColor: "#F4F6F9",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a
          href="#contenu"
          className="sr-only z-[60] rounded-full bg-ink px-4 py-3 text-[14px] text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Aller au contenu
        </a>
        <SmoothScroll>{children}</SmoothScroll>
        <RevealObserver />
      </body>
    </html>
  );
}
