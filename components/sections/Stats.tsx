import type { ChiffresContent } from "@/lib/types";
import CountUp from "@/components/ui/CountUp";

/** Fiche technique du club : quatre faits vérifiables, sans promesse. */
export default function Stats({ content }: { content: ChiffresContent }) {
  if (content.items.length === 0) return null;

  return (
    <section id="chiffres" aria-labelledby="chiffres-titre" className="border-t border-rule bg-card">
      <div className="container-site py-10 lg:py-14">
        <h2 id="chiffres-titre" className="label text-muted">
          {content.title}
        </h2>
        <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-rule bg-rule lg:grid-cols-4">
          {content.items.map((it, i) => (
            <div key={i} className="flex flex-col bg-card p-5 lg:p-6">
              <dt className="order-2 mt-4 text-[15px] font-medium leading-snug">{it.label}</dt>
              <dd className="order-1 font-display text-[40px] font-medium leading-none tracking-[-0.03em] tabular-nums lg:text-[48px]">
                <CountUp value={it.value} suffix={it.suffix} />
              </dd>
              {it.caption && <dd className="order-3 mt-1 text-[13px] leading-snug text-muted">{it.caption}</dd>}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
