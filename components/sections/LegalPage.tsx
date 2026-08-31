import Link from "next/link";
import type { LegalPage as LegalPageContent } from "@/lib/types";

/**
 * Gabarit commun aux pages légales. Volontairement sobre : ici le visiteur
 * cherche une information précise, pas une expérience.
 */
export default function LegalPage({
  page,
  brand,
}: {
  page: LegalPageContent;
  brand: string;
}) {
  return (
    <main className="min-h-screen bg-cloud px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center font-sans text-sm text-court underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-court"
        >
          ← Retour au site
        </Link>

        <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
          {page.title}
        </h1>

        {/* Le contenu vient du back-office : les lignes vides séparent les blocs,
            une ligne seule suivie d'un blanc fait office de sous-titre. */}
        <div className="mt-10 space-y-6">
          {page.body.split(/\n\s*\n/).map((bloc, i) => {
            const texte = bloc.trim();
            if (!texte) return null;
            const estTitre = !texte.includes("\n") && texte.length < 60 && !texte.endsWith(".");
            return estTitre ? (
              <h2 key={i} className="pt-4 font-display text-xl font-semibold text-ink">
                {texte}
              </h2>
            ) : (
              <p key={i} className="whitespace-pre-line font-sans leading-relaxed text-ink/80">
                {texte}
              </p>
            );
          })}
        </div>

        <p className="mt-16 border-t border-ink/10 pt-6 font-sans text-xs text-ink/65">
          {brand}
        </p>
      </div>
    </main>
  );
}
