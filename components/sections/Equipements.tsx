import type { EquipementsContent } from "@/lib/types";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/fx/Reveal";
import EquipIcon from "@/components/court/EquipIcon";

/**
 * « Le club » en bento (adapté de « Bento Grid », 21st.dev, @kokonutd).
 * Grille six colonnes, cartes de deux largeurs, pictogramme au trait. Réécrit
 * dans la direction Tableau tactique, contenu éditable, sans dépendance.
 */
export default function Equipements({ content }: { content: EquipementsContent }) {
  const items = content.items.filter((it) => it.title);
  if (items.length === 0) return null;

  return (
    <section id="club" aria-labelledby="club-titre" className="section">
      <div className="container-site">
        <SectionHead id="club-titre" eyebrow={content.eyebrow} title={content.title} intro={content.intro} />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5">
          {items.map((it, i) => (
            <Reveal
              key={i}
              as="li"
              delay={(i % 3) * 0.05}
              className={`group flex flex-col rounded-lg border border-rule bg-card p-6 transition-colors duration-200 hover:border-turf/40 lg:p-7 ${
                it.wide ? "lg:col-span-4" : "lg:col-span-2"
              }`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-rule text-turf transition-colors duration-200 group-hover:border-turf/50">
                <EquipIcon name={it.icon} />
              </span>
              <h3 className="mt-5 font-display text-[20px] font-medium tracking-[-0.015em]">{it.title}</h3>
              {it.text && <p className="mt-2 max-w-[42ch] text-[15px] leading-[1.6] text-muted">{it.text}</p>}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
