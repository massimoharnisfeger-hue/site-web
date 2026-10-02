"use client";

import { useId, useState } from "react";
import type { FaqContent } from "@/lib/types";
import Reveal from "@/components/fx/Reveal";

/**
 * Questions fréquentes. Plusieurs réponses peuvent rester ouvertes. La réponse
 * repliée reste dans le HTML (lisible par les moteurs) mais sort de l'arbre
 * d'accessibilité et de la tabulation grâce à `inert`.
 */
export default function Faq({ content }: { content: FaqContent }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const base = useId();
  const items = content.items.filter((it) => it.question.trim());
  if (items.length === 0) return null;

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section id="faq" aria-labelledby="faq-titre" className="section">
      <div className="container-site lg:grid lg:grid-cols-12 lg:gap-14">
        <Reveal className="mb-10 lg:col-span-5 lg:mb-0">
          <div className="lg:sticky lg:top-[calc(var(--header-h,64px)_+_40px)]">
            <p className="label text-turf">{content.eyebrow}</p>
            <h2 id="faq-titre" className="h2 mt-3">
              {content.title}
            </h2>
            {content.intro && <p className="mt-4 max-w-[28rem] text-[16px] text-muted">{content.intro}</p>}
          </div>
        </Reveal>

        <ul className="border-t border-rule lg:col-span-7">
          {items.map((it, i) => {
            const isOpen = open.has(i);
            const btn = `${base}-q${i}`;
            const panel = `${base}-a${i}`;
            return (
              <li key={i} className="border-b border-rule">
                <h3>
                  <button
                    id={btn}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panel}
                    onClick={() => toggle(i)}
                    className="group flex min-h-[64px] w-full items-center justify-between gap-6 py-4 text-left"
                  >
                    <span className="text-[17px] font-medium leading-snug transition-colors duration-200 group-hover:text-turf">
                      {it.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                        isOpen ? "border-turf bg-turf text-white" : "border-rule text-ink"
                      }`}
                    >
                      <span className="absolute h-[1.5px] w-3 bg-current" />
                      <span
                        className={`absolute h-3 w-[1.5px] bg-current transition-transform duration-200 ${
                          isOpen ? "scale-y-0" : "scale-y-100"
                        }`}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  id={panel}
                  role="region"
                  aria-labelledby={btn}
                  inert={!isOpen}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[40rem] pb-6 pr-12 text-[16px] leading-[1.65] text-muted">{it.answer}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
