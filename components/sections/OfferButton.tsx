"use client";

import { scrollToTarget } from "@/lib/scroll";

/**
 * Bouton d'une fiche d'offre : ouvre le formulaire de réservation sur cette
 * formule. Un événement plutôt qu'un état partagé : les deux sections restent
 * indépendantes. Le bouton s'étend à toute la fiche (pseudo-élément).
 */
export default function OfferButton({ index, label }: { index: number; label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new CustomEvent("padel:select-offer", { detail: index }));
        scrollToTarget("#reservation");
      }}
      className="btn-quiet mt-4 w-full justify-between after:absolute after:inset-0 after:content-[''] group-hover:border-turf group-hover:text-turf"
    >
      {label}
      <span aria-hidden="true">→</span>
    </button>
  );
}
