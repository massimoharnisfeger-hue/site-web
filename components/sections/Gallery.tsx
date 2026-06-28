"use client";

import { useRef, useState, MouseEvent } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import type { GalerieContent } from "@/lib/types";

// Masonry row-spans cycled by index (layout detail kept in code).
const spanPattern = ["row-span-2", "", "row-span-2", "", "", "row-span-2", "", ""];

const onImgError = (e: MouseEvent<HTMLImageElement>) => {
  (e.currentTarget as HTMLImageElement).style.display = "none";
};

function ParallaxTile({
  src,
  alt,
  span,
  index,
  onOpen,
}: {
  src: string;
  alt: string;
  span: string;
  index: number;
  onOpen: (src: string) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const dir = index % 2 === 0 ? 1 : -1;
  const y = useTransform(scrollYProgress, [0, 1], [`${18 * dir}%`, `${-18 * dir}%`]);

  return (
    <motion.button
      ref={ref}
      onClick={() => onOpen(src)}
      data-cursor="hover"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-court/30 to-teal/20 ${span}`}
    >
      <motion.div style={{ y }} className="h-[120%] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={onImgError}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-full glass-strong opacity-0 transition-all duration-500 group-hover:opacity-100">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
  const [active, setActive] = useState<string | null>(null);

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
          <p className="max-w-sm font-sans text-ink/55">{content.intro}</p>
        </div>

        <div className="grid auto-rows-[200px] grid-cols-2 gap-4 md:auto-rows-[240px] md:grid-cols-4">
          {content.items.map((img, i) => (
            <ParallaxTile
              key={i}
              src={img.src}
              alt={img.alt}
              span={spanPattern[i % spanPattern.length]}
              index={i}
              onOpen={setActive}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[9998] flex items-center justify-center bg-ink/70 p-6 backdrop-blur-xl"
          >
            <motion.img
              key={active}
              src={active}
              alt=""
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-[85vh] max-w-5xl rounded-2xl object-contain shadow-2xl"
            />
            <button
              onClick={() => setActive(null)}
              aria-label="Fermer"
              className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full glass-strong text-ink"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
