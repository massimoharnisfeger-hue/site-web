import { Fragment_Mono, Funnel_Display, Host_Grotesk } from "next/font/google";

/**
 * Les trois familles de la direction « Tableau tactique », auto-hébergées par
 * next/font : les fichiers sont servis par le site lui-même, sans requête vers
 * Google au chargement de la page.
 *
 * Elles remplacent Clash Display et General Sans, servies par Fontshare : un
 * seul lien demandait les deux familles, et l'API Fontshare n'en renvoie que la
 * première — General Sans ne s'affichait donc jamais.
 */
export const display = Funnel_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const sans = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const mono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono",
  display: "swap",
});
