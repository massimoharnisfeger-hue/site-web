"use client";

import { useEffect, useRef, useState } from "react";
import type { GalerieContent } from "@/lib/types";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/fx/Reveal";
import Photo from "@/components/ui/Photo";
import { lockScroll } from "@/lib/scroll";

const fig = (i: number) => `Fig. ${String(i + 1).padStart(2, "0")}`;

/**
 * Galerie en accordéon (adapté de « Hover Expand Gallery », 21st.dev,
 * @kedhareswer). Sur grand écran, une rangée de panneaux à label vertical : le
 * panneau survolé ou ciblé au clavier s'agrandit pour révéler la photo. Sur
 * téléphone, les photos s'empilent. Un clic ouvre la visionneuse (<dialog>
 * natif) reprise de la version précédente : focus piégé, flèches, Échap.
 */
export default function Gallery({ content }: { content: GalerieContent }) {
  const items = content.items.filter((it) => it.src);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const [index, setIndex] = useState<number | null>(null);
  const swipe = useRef<number | null>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (index === null || !d || d.open) return;
    d.showModal();
    lockScroll(true);
  }, [index]);

  // Filet de sécurité : libère le verrou si la galerie est démontée ouverte.
  useEffect(() => () => lockScroll(false), []);

  if (items.length === 0) return null;
  const n = items.length;
  const step = (d: number) => setIndex((i) => (i === null ? i : (i + d + n) % n));
  const current = index === null ? null : items[index];

  return (
    <section id="galerie" aria-labelledby="galerie-titre" className="section">
      <div className="container-site">
        <SectionHead id="galerie-titre" eyebrow={content.eyebrow} title={content.title} intro={content.intro} />

        {/* Grand écran : accordéon horizontal « hover expand ». */}
        <Reveal className="hidden lg:block">
          <ul className="flex h-[460px] gap-2">
            {items.map((it, i) => (
              <li key={i} className="group h-full flex-[1] basis-0 transition-[flex-grow] duration-500 ease-out hover:flex-[7] focus-within:flex-[7]">
                <button
                  ref={(el) => {
                    triggers.current[i] = el;
                  }}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Agrandir la photo : ${it.alt || it.caption || fig(i)}`}
                  className="relative block h-full w-full overflow-hidden rounded-lg bg-glass/40"
                >
                  <Photo
                    src={it.src}
                    alt=""
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {/* Label vertical quand le panneau est replié. */}
                  <span className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="label absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-white [writing-mode:vertical-rl] rotate-180 transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0">
                    {it.caption || fig(i)}
                  </span>
                  <span className="label absolute bottom-4 left-4 flex items-center gap-2 text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100">
                    {fig(i)}
                    {it.caption && <span className="normal-case tracking-normal">· {it.caption}</span>}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Téléphone et tablette : photos empilées. */}
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
          {items.map((it, i) => (
            <Reveal key={i} as="li" delay={(i % 2) * 0.05} className={i % 3 === 0 ? "col-span-2" : "col-span-1"}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Agrandir la photo : ${it.alt || it.caption || fig(i)}`}
                className="group relative block w-full overflow-hidden rounded-lg bg-glass/40"
              >
                <Photo
                  src={it.src}
                  alt=""
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className={`w-full object-cover ${i % 3 === 0 ? "aspect-[16/9]" : "aspect-[4/5]"}`}
                />
                <span className="label absolute bottom-2.5 left-2.5 max-w-[calc(100%_-_20px)] truncate rounded-full bg-card px-2.5 py-1 text-ink">
                  {fig(i)}
                  {it.caption && <span className="hidden sm:inline"> · {it.caption}</span>}
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={current ? `${fig(index ?? 0)} ${current.caption}` : undefined}
        onClose={() => {
          lockScroll(false);
          if (index !== null) triggers.current[index]?.focus({ preventScroll: true });
          setIndex(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none border-0 bg-ink p-0 text-white backdrop:bg-ink/80"
      >
        {current && index !== null && (
          <div
            className="flex h-full flex-col"
            onClick={(e) => {
              if (e.target === e.currentTarget) dialogRef.current?.close();
            }}
          >
            <div className="container-site flex h-16 shrink-0 items-center justify-between">
              <p className="label text-white/70" aria-live="polite">
                {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
              </p>
              <button
                type="button"
                autoFocus
                onClick={() => dialogRef.current?.close()}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/25 px-4 text-[14px] hover:border-white"
              >
                Fermer <span aria-hidden="true">×</span>
              </button>
            </div>

            <div
              className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-4 md:px-20"
              onClick={(e) => {
                if (e.target === e.currentTarget) dialogRef.current?.close();
              }}
              onPointerDown={(e) => {
                swipe.current = e.clientX;
              }}
              onPointerUp={(e) => {
                if (swipe.current === null) return;
                const dx = e.clientX - swipe.current;
                swipe.current = null;
                if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
              }}
            >
              <Photo
                key={current.src}
                src={current.src}
                alt={current.alt}
                sizes="100vw"
                className="max-h-full max-w-full select-none rounded object-contain"
              />
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Photo précédente"
                className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 hover:border-white md:flex"
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Photo suivante"
                className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 hover:border-white md:flex"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <div className="container-site flex min-h-[72px] shrink-0 items-center justify-between gap-4 py-3">
              <p className="text-[14px] text-white/85">
                <span className="label mr-2 text-white/60">{fig(index)}</span>
                {current.caption}
              </p>
              <div className="flex gap-2 md:hidden">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Photo précédente"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25"
                >
                  <span aria-hidden="true">←</span>
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Photo suivante"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25"
                >
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
