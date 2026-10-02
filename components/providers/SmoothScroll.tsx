"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Défilement fluide (Lenis), coupé quand le visiteur demande un mouvement
 * réduit. L'instance est exposée sur `window.__lenis` : les liens d'ancre, le
 * menu mobile et la visionneuse s'en servent pour défiler, s'arrêter et
 * reprendre.
 *
 * Lenis tourne sur sa propre boucle d'animation (`autoRaf`) : GSAP n'était là
 * que pour lui fournir un ticker, il n'est plus chargé.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: true,
    });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      lenis.destroy();
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
    };
  }, []);

  return <>{children}</>;
}
