// Défilement vers une ancre : fluide, instantané en mouvement réduit.

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToTarget(target: string): boolean {
  const id = target.replace(/^#/, "");
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  return true;
}

export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

/** Événement émis par une carte d'offre : la réservation présélectionne la formule. */
export const SELECT_OFFER_EVENT = "padel:select-offer";

export function selectOffer(index: number): void {
  window.dispatchEvent(new CustomEvent<number>(SELECT_OFFER_EVENT, { detail: index }));
}
