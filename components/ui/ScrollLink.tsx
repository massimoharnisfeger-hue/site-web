"use client";

import { scrollToTarget } from "@/lib/scroll";

/**
 * Lien vers une ancre de la page : défilement fluide (Lenis) et focus déplacé
 * sur la cible, comme un lien d'ancre natif. Toute autre adresse (« /#offres »
 * depuis une page légale, lien externe) suit le comportement normal.
 */
export default function ScrollLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        if (!href.startsWith("#") || !document.querySelector(href)) return;
        e.preventDefault();
        scrollToTarget(href, undefined, true);
      }}
    >
      {children}
    </a>
  );
}
