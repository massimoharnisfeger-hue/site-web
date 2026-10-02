"use client";

import { useEffect, useRef, useState } from "react";
import type { ParcoursContent, StoryStep } from "@/lib/types";
import SectionHead from "@/components/ui/SectionHead";
import Photo from "@/components/ui/Photo";
import { scrollToTarget } from "@/lib/scroll";

function Credit({ step }: { step: StoryStep }) {
  if (!step.credit) return null;
  return (
    <p className="mt-2 text-[12px] text-muted">
      Photo :{" "}
      {step.creditLink ? (
        <a href={step.creditLink} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">
          {step.credit}
        </a>
      ) : (
        step.credit
      )}
    </p>
  );
}

/**
 * Le club en quatre temps. Sur grand écran, la photo reste collée à gauche et
 * change avec l'étape lue à droite ; une balle marque l'étape en cours sur le
 * filet vertical. Sur téléphone, chaque étape porte sa propre photo.
 */
export default function Story({ content }: { content: ParcoursContent }) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const items = content.items;

  useEffect(() => {
    const els = stepRefs.current.filter(Boolean) as HTMLLIElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items.length]);

  if (items.length === 0) return null;
  const internal = content.ctaTarget.startsWith("#");

  return (
    <section id="parcours" aria-labelledby="parcours-titre" className="section">
      <div className="container-site">
        <SectionHead id="parcours-titre" eyebrow={content.eyebrow} title={content.title} intro={content.intro} />

        <div className="lg:grid lg:grid-cols-12 lg:gap-14">
          {/* Photo collante, grand écran uniquement. */}
          <div className="hidden lg:col-span-6 lg:block">
            <div className="sticky top-[calc(var(--header-h,64px)_+_32px)]">
              <div className="relative aspect-[4/5] max-h-[calc(100svh_-_var(--header-h,64px)_-_96px)] w-full overflow-hidden rounded-lg bg-glass/40">
                {items.map((s, i) => (
                  <Photo
                    key={i}
                    src={s.image}
                    alt={i === active ? s.imageAlt : ""}
                    sizes="(min-width: 1240px) 560px, 46vw"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                      i === active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
                <p className="label absolute bottom-3 left-3 rounded-full bg-card px-3 py-1.5 text-ink">
                  {items[active]?.step} · {items[active]?.title}
                </p>
              </div>
              <Credit step={items[active]} />
            </div>
          </div>

          <div className="lg:col-span-6">
            <ol className="relative">
              {/* Le filet vertical, et une balle par étape. */}
              <span aria-hidden="true" className="absolute bottom-2 left-[5px] top-2 w-px bg-rule" />
              {items.map((s, i) => (
                <li
                  key={i}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  data-i={i}
                  className="relative pb-14 pl-9 last:pb-0 lg:flex lg:min-h-[64svh] lg:flex-col lg:justify-center lg:pb-0"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-[6px] h-[11px] w-[11px] rounded-full border transition-colors duration-300 lg:top-1/2 lg:-mt-[5.5px] ${
                      i === active ? "border-ink/40 bg-ball" : "border-rule bg-paper"
                    }`}
                  />
                  <div className="mb-5 overflow-hidden rounded-lg bg-glass/40 lg:hidden">
                    <Photo
                      src={s.image}
                      alt={s.imageAlt}
                      sizes="(min-width: 768px) 700px, 100vw"
                      className="aspect-[3/2] h-auto w-full object-cover"
                    />
                  </div>
                  <p className="label text-turf">
                    {s.step} · {s.subtitle}
                  </p>
                  <h3 className="mt-3 font-display text-[28px] font-medium leading-[1.1] tracking-[-0.02em] lg:text-[32px]">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-[30rem] text-[16px] leading-[1.6] text-muted">{s.text}</p>
                  <div className="lg:hidden">
                    <Credit step={s} />
                  </div>
                </li>
              ))}
            </ol>

            {content.ctaLabel && content.ctaTarget && (
              <div className="mt-12 pl-9 lg:mt-4">
                <a
                  href={content.ctaTarget}
                  onClick={(e) => {
                    if (!internal) return;
                    e.preventDefault();
                    scrollToTarget(content.ctaTarget, undefined, true);
                  }}
                  className="btn-primary"
                >
                  {content.ctaLabel}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
