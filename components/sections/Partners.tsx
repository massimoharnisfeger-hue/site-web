import type { PartenairesContent } from "@/lib/types";
import Photo from "@/components/ui/Photo";

/**
 * Bande de partenaires défilante (adaptée de « Logo Cloud Marquee », 21st.dev,
 * @olewandowski1). Réécrite dans la direction Tableau tactique : marquee en CSS
 * pur (aucune dépendance), fondu des bords, pause au survol, neutralisée en
 * mouvement réduit. Un logo téléversé s'affiche ; sinon le nom en toutes
 * lettres. Composant serveur : rien à hydrater.
 */
export default function Partners({ content }: { content: PartenairesContent }) {
  const items = content.items.filter((p) => p.name || p.logo);
  if (items.length === 0) return null;

  // Piste dupliquée pour une boucle sans couture ; la copie est cachée aux
  // lecteurs d'écran.
  const track = [...items, ...items];

  return (
    <section aria-labelledby="partenaires-titre" className="border-t border-rule bg-card">
      <div className="container-site py-10 lg:py-12">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 id="partenaires-titre" className="label text-muted">
            {content.title}
          </h2>
          {content.examples && content.examplesNote && (
            <p className="text-[12px] text-muted">{content.examplesNote}</p>
          )}
        </div>

        <div className="partner-mask relative mt-7 overflow-hidden">
          <ul className="partner-track flex w-max items-center">
            {track.map((p, i) => {
              const dup = i >= items.length;
              const body = p.logo ? (
                <Photo
                  src={p.logo}
                  alt={dup ? "" : p.name}
                  sizes="160px"
                  className="h-7 w-auto object-contain opacity-70 transition-opacity duration-200 hover:opacity-100 lg:h-8"
                />
              ) : (
                <span className="whitespace-nowrap font-display text-[18px] font-medium tracking-[-0.01em] text-muted transition-colors duration-200 hover:text-ink lg:text-[20px]">
                  {p.name}
                </span>
              );
              return (
                <li key={i} className="flex shrink-0 items-center px-7 lg:px-10" aria-hidden={dup || undefined}>
                  {p.url && !dup ? (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                      {body}
                      <span className="sr-only"> (nouvel onglet)</span>
                    </a>
                  ) : (
                    body
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
