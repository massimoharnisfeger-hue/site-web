import type { AvisContent, Testimonial } from "@/lib/types";
import SectionHead from "@/components/ui/SectionHead";

/** Note sur cinq, en balles : pleine pour un point, au trait sinon. */
function BallRating({ rating }: { rating: number }) {
  const r = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span role="img" aria-label={`${r} sur 5`} className="flex gap-1.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`h-[9px] w-[9px] rounded-full ${
            i < r ? "bg-ball shadow-[inset_0_0_0_1px_rgba(13,27,42,0.3)]" : "border border-ink/25"
          }`}
        />
      ))}
    </span>
  );
}

function Card({ t, hidden }: { t: Testimonial; hidden?: boolean }) {
  return (
    <figure
      aria-hidden={hidden || undefined}
      className="flex w-[300px] shrink-0 flex-col rounded-lg border border-rule bg-card p-6 sm:w-[360px]"
    >
      <div className="flex items-center justify-between gap-4">
        <BallRating rating={t.rating} />
        {t.role && <span className="label text-muted">{t.role}</span>}
      </div>
      <blockquote className="mt-4 text-[16px] leading-[1.5]">
        <p>«&nbsp;{t.quote}&nbsp;»</p>
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3 pt-6">
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
  );
}

/**
 * Avis en bandeau défilant (adapté de « Testimonials with Marquee », 21st.dev,
 * @serafimcloud). Deux rangées en sens inverse, pause au survol, fondu des
 * bords, en CSS pur. En mouvement réduit, les avis s'affichent en grille fixe.
 * Données et mention « exemples » inchangées.
 */
export default function Testimonials({ content }: { content: AvisContent }) {
  const items = content.items.filter((t) => t.quote.trim());
  if (items.length === 0) return null;

  // Deux rangées : on alterne pour les équilibrer, puis on duplique chacune
  // pour une boucle sans couture.
  const rowA = items.filter((_, i) => i % 2 === 0);
  const rowB = items.filter((_, i) => i % 2 === 1);
  const rows = [rowA, rowB.length > 0 ? rowB : rowA];

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
      </div>

      {/* Les avis sont lus une fois pour l'accessibilité, puis la version
          défilante (dupliquée) est masquée aux lecteurs d'écran. */}
      <ul className="sr-only">
        {items.map((t, i) => (
          <li key={i}>
            {t.name}, {t.role} : «&nbsp;{t.quote}&nbsp;» — {t.rating} sur 5
          </li>
        ))}
      </ul>

      <div aria-hidden="true" className="avis-rows mt-2 flex flex-col gap-4 lg:gap-5">
        {rows.map((row, r) => (
          <div key={r} className="avis-mask relative overflow-hidden">
            <div className={`avis-track flex w-max gap-4 lg:gap-5 ${r === 1 ? "avis-track-rev" : ""}`}>
              {[...row, ...row].map((t, i) => (
                <Card key={i} t={t} hidden />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Repli mouvement réduit : grille fixe, lisible, sans animation. */}
      <div className="avis-static container-site mt-2 hidden grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <Card key={i} t={t} />
        ))}
      </div>
    </section>
  );
}
