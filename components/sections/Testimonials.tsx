import type { AvisContent } from "@/lib/types";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/fx/Reveal";

/** Note sur cinq, en balles : pleine pour un point, au trait sinon. */
function BallRating({ rating }: { rating: number }) {
  const r = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span role="img" aria-label={`${r} sur 5`} className="flex gap-1.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`h-[10px] w-[10px] rounded-full ${
            i < r ? "bg-ball shadow-[inset_0_0_0_1px_rgba(13,27,42,0.3)]" : "border border-ink/25"
          }`}
        />
      ))}
    </span>
  );
}

/**
 * Les avis, présentés comme une feuille de match. Tant que ce sont des avis
 * d'exemple, la section le dit en clair ; la date et la source ne s'affichent
 * que si elles sont renseignées.
 */
export default function Testimonials({ content }: { content: AvisContent }) {
  const items = content.items.filter((t) => t.quote.trim());
  if (items.length === 0) return null;

  return (
    <section id="avis" aria-labelledby="avis-titre" className="section">
      <div className="container-site">
        <SectionHead
          id="avis-titre"
          eyebrow={content.eyebrow}
          title={content.title}
          aside={
            content.examples && content.examplesNote ? (
              <p className="inline-flex items-center gap-2 rounded-full border border-dashed border-ink/30 px-3.5 py-2 text-[13px] text-muted">
                <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full border border-ink/40" />
                {content.examplesNote}
              </p>
            ) : undefined
          }
        />

        <ul className="grid gap-px overflow-hidden rounded-lg border border-rule bg-rule md:grid-cols-2">
          {items.map((t, i) => (
            <Reveal key={i} as="li" delay={(i % 2) * 0.06} className="flex bg-card">
              <figure className="flex w-full flex-col p-6 lg:p-8">
                <div className="flex items-center justify-between gap-4">
                  <BallRating rating={t.rating} />
                  {t.role && <p className="label text-right text-muted">{t.role}</p>}
                </div>
                <blockquote className="mt-5 font-display text-[19px] leading-[1.45] tracking-[-0.01em] lg:text-[20px]">
                  <p>«&nbsp;{t.quote}&nbsp;»</p>
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3 pt-7">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-turf/40 font-mono text-[13px] text-turf"
                  >
                    {t.name.trim().charAt(0).toUpperCase()}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-[15px] font-medium">{t.name}</span>
                    {(t.source || t.date) && (
                      <span className="text-[13px] text-muted">{[t.source, t.date].filter(Boolean).join(" · ")}</span>
                    )}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
