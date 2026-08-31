"use client";

import { MouseEvent, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import type { Activity, OffresContent } from "@/lib/types";
import Reveal from "@/components/fx/Reveal";
import Photo from "@/components/ui/Photo";

// Themed accent gradients cycled by index (kept in code, not in the CMS).
const accents = [
  "from-court/30 to-teal/10",
  "from-teal/30 to-court/10",
  "from-lime/30 to-court/10",
  "from-court/30 to-lime/10",
  "from-teal/30 to-lime/10",
];

function TiltCard({ activity, index }: { activity: Activity; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [10, -10]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-12, 12]), {
    stiffness: 150,
    damping: 18,
  });
  const glareX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(my, [0, 1], ["0%", "100%"]);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  /**
   * Emmène le visiteur au tunnel de réservation avec cette formule déjà
   * sélectionnée. Un événement plutôt qu'un état partagé : les deux sections
   * sont indépendantes et le site suit déjà ce motif avec window.__lenis.
   */
  const selectOffer = (i: number) => {
    window.dispatchEvent(new CustomEvent("padel:select-offer", { detail: i }));
    const el = document.querySelector("#reservation");
    const lenis = (window as unknown as { __lenis?: { scrollTo: (e: HTMLElement, o?: unknown) => void } }).__lenis;
    if (lenis && el) lenis.scrollTo(el as HTMLElement, { offset: -20 });
    else el?.scrollIntoView({ behavior: "smooth" });
  };

  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <Reveal delay={index * 0.08} className="[perspective:1200px]">
      <motion.article
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={() => selectOffer(index)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectOffer(index);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Réserver : ${activity.name}`}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        data-cursor="hover"
        className="group relative h-[26rem] cursor-pointer overflow-hidden rounded-[1.75rem] glass-strong p-1 outline-none transition-shadow duration-500 hover:shadow-[0_36px_90px_-24px_rgba(27,77,228,0.45)] focus-visible:ring-2 focus-visible:ring-court focus-visible:ring-offset-2"
      >
        <div
          className={`relative h-full w-full overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${
            accents[index % accents.length]
          }`}
        >
          <Photo
            src={activity.image}
            alt=""
            // La carte fait 82vw sur mobile, la moitié de la grille à partir de
            // 640 px, le tiers à partir de 1024, et se fige à 390 px au-delà de
            // la largeur maximale du conteneur.
            sizes="(min-width: 1280px) 390px, (min-width: 1024px) 31vw, (min-width: 640px) calc(50vw - 40px), 82vw"
            className="absolute inset-0 h-full w-full object-cover object-[center_35%] transition-transform duration-700 group-hover:scale-110"
            style={{ transform: "translateZ(0)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

          <motion.div
            className="pointer-events-none absolute -inset-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(220px circle at ${glareX} ${glareY}, rgba(255,255,255,0.32), transparent 60%)`,
            }}
          />

          <div
            className="absolute inset-0 flex flex-col justify-end p-6"
            style={{ transform: "translateZ(50px)" }}
          >
            {activity.badge && (
              <span className="absolute right-5 top-5 rounded-full bg-lime px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-ink shadow-[0_6px_20px_-6px_rgba(0,0,0,0.6)]">
                {activity.badge}
              </span>
            )}
            <span className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-md">
              {activity.level} · {activity.duration}
            </span>
            <h3 className="font-display text-2xl font-semibold text-white">
              {activity.name}
            </h3>
            <p className="mt-1 font-sans text-sm text-white/75">
              {activity.tagline}
            </p>
            {/* Le survol n'existe pas sur un écran tactile : la description
                était donc simplement invisible sur téléphone. Elle y est
                maintenant affichée d'emblée, tronquée à deux lignes, et reste
                une révélation au survol sur les pointeurs fins. */}
            <p className="mt-3 line-clamp-2 font-sans text-sm leading-relaxed text-white/85 transition-all duration-500 md:line-clamp-none md:max-h-0 md:overflow-hidden md:opacity-0 md:group-hover:max-h-32 md:group-hover:opacity-100">
              {activity.description}
            </p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="shrink-0 font-display text-lg font-medium text-lime">
                {activity.price}
              </span>
              <span className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-white/85">
                {activity.ctaLabel}
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lime text-ink transition-transform duration-300 group-hover:rotate-45">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M7 17L17 7M9 7h8v8"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}

export default function Activities({ content }: { content: OffresContent }) {
  return (
    <section
      id="offres"
      className="relative overflow-hidden bg-cloud py-28 md:py-36"
    >
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-court/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-lime/20 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="mb-16 max-w-2xl">
          <span className="font-sans text-xs uppercase tracking-[0.35em] text-court">
            {content.eyebrow}
          </span>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink md:text-6xl">
            {content.title}
          </h2>
          <p className="mt-5 font-sans text-base text-ink/65 md:text-lg">
            {content.intro}
          </p>
        </Reveal>

        {/*
          Sous 640 px, cinq cartes empilees produisaient une section de 2710 px,
          soit plus de trois ecrans de defilement pour un seul bloc. On passe en
          rail horizontal a aimantation : la section tient en un ecran et le
          visiteur compare les formules d'un geste. Grille inchangee au-dela.
        */}
        <div
          role="group"
          aria-label={content.title}
          className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
        >
          {content.items.map((a, i) => (
            <div key={i} className="w-[82vw] flex-none snap-center sm:w-auto">
              <TiltCard activity={a} index={i} />
            </div>
          ))}
        </div>

        {/* Repere de defilement, mobile seulement */}
        <p className="mt-3 text-center font-sans text-xs text-ink/65 sm:hidden">
          Faites glisser pour voir les {content.items.length} formules
        </p>
      </div>
    </section>
  );
}
