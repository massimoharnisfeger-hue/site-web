import type { CoachsContent } from "@/lib/types";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/fx/Reveal";
import Photo from "@/components/ui/Photo";

/**
 * « Nos coachs » (adapté de « Team Member Cards », 21st.dev, @olewandowski1).
 * Grille de cartes dans la direction Tableau tactique. Par défaut, pas de
 * visage inventé : une pastille à l'initiale tant que le club n'a pas ajouté
 * de vraie photo (avec l'accord des personnes). Composant serveur.
 */
export default function Coachs({ content }: { content: CoachsContent }) {
  const items = content.items.filter((c) => c.name);
  if (items.length === 0) return null;

  return (
    <section id="coachs" aria-labelledby="coachs-titre" className="section">
      <div className="container-site">
        <SectionHead
          id="coachs-titre"
          eyebrow={content.eyebrow}
          title={content.title}
          intro={content.intro}
          aside={
            content.examples && content.examplesNote ? (
              <p className="inline-flex items-center gap-2 rounded-full border border-dashed border-ink/30 px-3.5 py-2 text-[13px] text-muted">
                <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full border border-ink/40" />
                {content.examplesNote}
              </p>
            ) : undefined
          }
        />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {items.map((c, i) => (
            <Reveal key={i} as="li" delay={(i % 3) * 0.06} className="flex flex-col rounded-lg border border-rule bg-card p-6 lg:p-7">
              <div className="flex items-center gap-4">
                {c.photo ? (
                  <Photo
                    src={c.photo}
                    alt={`Portrait de ${c.name}`}
                    sizes="64px"
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-turf/30 bg-glass/40 font-display text-[22px] font-medium text-turf"
                  >
                    {c.name.trim().charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <h3 className="font-display text-[19px] font-medium tracking-[-0.01em]">{c.name}</h3>
                  {c.role && <p className="mt-0.5 text-[14px] text-turf">{c.role}</p>}
                </div>
              </div>

              {c.bio && <p className="mt-4 text-[15px] leading-[1.6] text-muted">{c.bio}</p>}

              {c.tag && (
                <p className="mt-auto pt-5">
                  <span className="label inline-flex items-center gap-2 rounded-full border border-rule px-3 py-1.5 text-muted">
                    <span aria-hidden="true" className="h-[6px] w-[6px] rounded-full bg-ball" />
                    {c.tag}
                  </span>
                </p>
              )}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
