import Link from "next/link";
import type { LegalPage as LegalPageContent } from "@/lib/types";

/**
 * Gabarit commun aux pages légales. Volontairement sobre : le visiteur
 * cherche une information précise, pas une expérience.
 */
export default function LegalPage({ page }: { page: LegalPageContent }) {
  return (
    <main id="contenu" className="container-site pb-24 pt-[calc(var(--header-h,64px)_+_48px)] lg:pb-32">
      <div className="mx-auto max-w-[44rem]">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center gap-1.5 text-[14px] text-muted transition-colors hover:text-ink"
        >
          <span aria-hidden="true">←</span> Retour à l&apos;accueil
        </Link>

        <h1 className="h2 mt-6">{page.title}</h1>

        {/* Le contenu vient du back-office : les lignes vides séparent les
            blocs, une ligne seule et courte sans point final fait office de
            sous-titre. */}
        <div className="mt-10 space-y-5 border-t border-rule pt-8">
          {page.body.split(/\n\s*\n/).map((bloc, i) => {
            const texte = bloc.trim();
            if (!texte) return null;
            const estTitre = !texte.includes("\n") && texte.length < 60 && !texte.endsWith(".");
            return estTitre ? (
              <h2 key={i} className="pt-5 font-display text-[20px] font-medium tracking-[-0.01em] first:pt-0">
                {texte}
              </h2>
            ) : (
              <p key={i} className="whitespace-pre-line text-[16px] leading-[1.7] text-ink/80">
                {texte}
              </p>
            );
          })}
        </div>
      </div>
    </main>
  );
}
