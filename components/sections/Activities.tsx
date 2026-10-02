import type { Activity, OffresContent } from "@/lib/types";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/fx/Reveal";
import Photo from "@/components/ui/Photo";
import PlayersPictogram from "@/components/court/PlayersPictogram";
import OfferButton from "@/components/sections/OfferButton";

// Cadrage choisi dans le back-office : tiers haut, centre ou tiers bas de la photo.
const FOCUS = { top: "object-[50%_15%]", center: "object-center", bottom: "object-[50%_80%]" } as const;

function playersLabel(a: Activity) {
  const n = a.playersLeft + a.playersRight;
  const joueurs = `${n} joueur${n > 1 ? "s" : ""}`;
  return a.coach ? `${joueurs} et un coach` : joueurs;
}

/**
 * Largeur de chaque fiche sur la grille de six colonnes : des rangées de
 * trois, et les deux ou quatre dernières fiches en rangées de deux pour ne
 * jamais laisser une fiche seule au bout d'une ligne.
 */
function spanFor(i: number, n: number) {
  const r = n % 3;
  if (n === 1) return "lg:col-span-6";
  if (r === 2 && i >= n - 2) return "lg:col-span-3";
  if (r === 1 && i >= n - 4) return "lg:col-span-3";
  return "lg:col-span-2";
}

export default function Activities({ content }: { content: OffresContent }) {
  const n = content.items.length;
  if (n === 0) return null;

  return (
    <section id="offres" aria-labelledby="offres-titre" className="section">
      <div className="container-site">
        <SectionHead id="offres-titre" eyebrow={content.eyebrow} title={content.title} intro={content.intro} />

        <ul className="grid gap-4 lg:grid-cols-6 lg:gap-5">
          {content.items.map((a, i) => (
            <Reveal
              key={i}
              as="li"
              delay={(i % 3) * 0.06}
              className={`group relative flex flex-col overflow-hidden rounded-lg border border-rule bg-card transition-colors duration-200 hover:border-turf/40 md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:flex ${spanFor(i, n)}`}
            >
              {/* Même hauteur de photo sur toute la grille : les deux rangées
                  restent alignées quelle que soit la largeur des fiches. */}
              <div className="relative aspect-[4/3] overflow-hidden bg-glass/40 md:aspect-auto md:min-h-[260px] lg:h-[232px] lg:min-h-0">
                <Photo
                  src={a.image}
                  alt={a.imageAlt}
                  sizes="(min-width: 1024px) 580px, (min-width: 768px) 300px, 100vw"
                  className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] ${FOCUS[a.imageFocus]}`}
                />
                {a.badge && (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-rule bg-card px-3 py-1.5 text-[12px] font-medium leading-none">
                    <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full bg-ball shadow-[inset_0_0_0_1px_rgba(13,27,42,0.3)]" />
                    {a.badge}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5 lg:p-6">
                <p className="label text-muted">
                  {String(i + 1).padStart(2, "0")}
                  {[a.duration, a.level].filter(Boolean).map((t) => ` · ${t}`)}
                </p>

                <h3 className="h3 mt-4">{a.name}</h3>
                {a.tagline && <p className="mt-1 text-[15px] font-medium text-turf">{a.tagline}</p>}
                <p className="mt-3 text-[15px] leading-[1.6] text-muted">{a.description}</p>

                <div className="mt-auto pt-6">
                  <div className="flex items-center justify-between gap-4 border-t border-dashed border-rule pt-4">
                    <p className="font-display text-[19px] font-medium tracking-[-0.01em]">{a.price}</p>
                    <PlayersPictogram left={a.playersLeft} right={a.playersRight} coach={a.coach} label={playersLabel(a)} />
                  </div>
                  {/* Le bouton s'étend à toute la fiche : un seul élément
                      interactif, annoncé avec son libellé. */}
                  <OfferButton index={i} label={a.ctaLabel} />
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
