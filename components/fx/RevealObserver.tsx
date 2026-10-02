"use client";

import { useEffect } from "react";

/**
 * Observateur unique des blocs `.reveal` (voir Reveal.tsx) : un seul
 * IntersectionObserver plutôt qu'un composant client par bloc, ce qui allège
 * l'hydratation.
 *
 * Avant son montage, tout est visible : l'état masqué n'existe que sous la
 * classe `reveal-ready`, posée sur <html> une fois les blocs déjà à l'écran
 * marqués comme vus — rien ne clignote. Les blocs ajoutés plus tard
 * (navigation entre pages) sont suivis par un MutationObserver.
 */
export default function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    const watch = (root: ParentNode) =>
      root.querySelectorAll(".reveal:not(.is-in)").forEach((el) => io.observe(el));

    const vh = window.innerHeight;
    document.querySelectorAll(".reveal:not(.is-in)").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.classList.add("is-in");
      else io.observe(el);
    });
    document.documentElement.classList.add("reveal-ready");

    const mo = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.matches(".reveal:not(.is-in)")) io.observe(n);
          watch(n);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
