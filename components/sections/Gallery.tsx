"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import type { GalerieContent, GalleryItem } from "@/lib/types";
import Photo from "@/components/ui/Photo";

// Masonry row-spans cycled by index (layout detail kept in code).
// Sous 640 px les tuiles hautes sont neutralisées : une photo de terrain en
// 900×600 tenue dans un cadre 167×416 perdait 73 % de sa largeur au recadrage.
const spanPattern = ["sm:row-span-2", "", "sm:row-span-2", "", "", "sm:row-span-2", "", ""];

// Largeur d'affichage réelle d'une vignette, pour le choix de la source.
const TILE_SIZES =
  "(min-width: 1280px) 292px, (min-width: 768px) 25vw, calc(50vw - 28px)";

function ParallaxTile({
  item,
  span,
  index,
  onOpen,
  onFailed,
}: {
  item: GalleryItem;
  span: string;
  index: number;
  onOpen: (item: GalleryItem) => void;
  onFailed: (src: string) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const dir = index % 2 === 0 ? 1 : -1;
  // Décalage exprimé en pixels, et non en pourcentage de l'enveloppe : en
  // pourcentage, l'amplitude (±43 px sur une tuile de 200) dépassait la marge
  // de recouvrement et découvrait une bande de dégradé en haut ou en bas.
  const y = useTransform(scrollYProgress, [0, 1], [22 * dir, -22 * dir]);

  return (
    <motion.button
      ref={ref}
      onClick={() => onOpen(item)}
      // La photo est décorative à l'intérieur du bouton : c'est le bouton qui
      // porte le nom, sinon une image masquée par `onError` laisserait une
      // commande sans intitulé.
      aria-label={`Agrandir : ${item.alt}`}
      data-cursor="hover"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-court/30 to-teal/20 ${span}`}
    >
      <motion.div
        style={{ y }}
        className="absolute -inset-y-8 inset-x-0"
      >
        <Photo
          src={item.src}
          alt=""
          sizes={TILE_SIZES}
          onFailed={onFailed}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-full glass-strong opacity-0 transition-all duration-500 group-hover:opacity-100">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M21 21l-4.3-4.3M11 19a8 8 0 100-16 8 8 0 000 16zM11 8v6M8 11h6"
            stroke="#0B1B3A"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </motion.button>
  );
}

export default function Gallery({ content }: { content: GalerieContent }) {
  const [active, setActive] = useState<GalleryItem | null>(null);

  // Une photo qui ne se charge pas laissait un rectangle de dégradé vide au
  // milieu de la mosaïque — un trou qui se lit comme un site cassé, alors qu'un
  // simple lien Unsplash périmé suffit à le provoquer. La tuile est retirée :
  // la grille se referme, et rien ne trahit l'absence.
  const [sourcesEnEchec, setSourcesEnEchec] = useState<string[]>([]);
  const signalerEchec = useCallback((src: string) => {
    setSourcesEnEchec((liste) => (liste.includes(src) ? liste : [...liste, src]));
  }, []);

  const tuiles = content.items.filter(
    (i) => i.src && !sourcesEnEchec.includes(i.src)
  );
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((item: GalleryItem) => {
    openerRef.current = document.activeElement as HTMLElement | null;
    setActive(item);
  }, []);

  const close = useCallback(() => {
    setActive(null);
    openerRef.current?.focus();
  }, []);

  // La visionneuse est une vraie boîte de dialogue : Échap la ferme, le focus y
  // entre puis revient à la vignette d'origine, et le défilement de la page en
  // arrière-plan est arrêté — Lenis continuait sinon à faire défiler dessous.
  useEffect(() => {
    if (!active) return;

    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } })
      .__lenis;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [active, close]);

  return (
    <section id="galerie" className="relative bg-cloud py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <span className="font-sans text-xs uppercase tracking-[0.35em] text-court">
              {content.eyebrow}
            </span>
            <h2 className="mt-4 font-display text-4xl font-semibold text-ink md:text-6xl">
              {content.title}
            </h2>
          </motion.div>
          <p className="max-w-sm font-sans text-ink/65">{content.intro}</p>
        </div>

        <div className="grid auto-rows-[200px] grid-cols-2 gap-4 md:auto-rows-[240px] md:grid-cols-4">
          {tuiles.map((img, i) => (
            <ParallaxTile
              key={img.src}
              item={img}
              span={spanPattern[i % spanPattern.length]}
              index={i}
              onOpen={open}
              onFailed={signalerEchec}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={active.alt || content.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[9998] flex items-center justify-center bg-ink/70 p-6 backdrop-blur-xl"
          >
            <motion.img
              key={active.src}
              src={active.src}
              alt={active.alt}
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              // `max-w-5xl` seul ne suffisait pas : en élément flex, la largeur
              // minimale automatique valait la largeur intrinsèque de la photo,
              // qui débordait donc de 255 px de chaque côté sur un écran de
              // 390 px. `min-w-0` + `max-w-full` la laissent rétrécir.
              className="max-h-[85vh] w-auto min-w-0 max-w-full rounded-2xl object-contain shadow-2xl md:max-w-5xl"
            />
            <button
              ref={closeRef}
              onClick={close}
              aria-label="Fermer"
              className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full glass-strong text-ink"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
