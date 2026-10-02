import type Lenis from "lenis";

type LenisWindow = Window & { __lenis?: Lenis };

/** Hauteur réelle de l'en-tête fixe, publiée par l'en-tête dans `--header-h`. */
function headerHeight() {
  const h = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h"));
  return Number.isFinite(h) ? h : 64;
}

/**
 * Fait défiler jusqu'à une cible. Passe par Lenis quand il tourne, pour que le
 * mouvement reste continu ; sinon par le navigateur, instantané en mouvement
 * réduit. `resize()` remet Lenis à jour : la hauteur de la page change quand
 * la séquence du héros se monte ou que les images arrivent.
 *
 * La cible s'arrête sous l'en-tête : à sa marge d'ancre (`scroll-margin-top`)
 * si elle en a une, sinon à la hauteur de l'en-tête plus 8 px. `offset`
 * impose un autre écart.
 */
export function scrollToTarget(target: string | HTMLElement, offset?: number, moveFocus = false) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  const gap = offset !== undefined ? -offset : margin > 0 ? margin : headerHeight() + 8;

  // Comme un lien d'ancre natif : la tabulation suivante repart de la cible.
  if (moveFocus) {
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }

  const lenis = (window as LenisWindow).__lenis;
  if (lenis) {
    lenis.resize();
    // Lenis retranche déjà la marge d'ancre : on ne lui passe que le reste.
    lenis.scrollTo(el, { offset: margin - gap });
    return;
  }
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = el.getBoundingClientRect().top + window.scrollY - gap;
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
}

/** Suspend le défilement de la page (menu ouvert, visionneuse). */
export function lockScroll(locked: boolean) {
  const lenis = (window as LenisWindow).__lenis;
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
