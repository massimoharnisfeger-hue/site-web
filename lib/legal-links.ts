import type { HomeContent } from "@/lib/content";

/** Liens du bas de page vers les pages légales, titrés depuis le back-office. */
export function legalLinks(home: HomeContent) {
  return [
    { href: "/mentions-legales", label: home.legal.mentions.title },
    { href: "/confidentialite", label: home.legal.privacy.title },
  ];
}
