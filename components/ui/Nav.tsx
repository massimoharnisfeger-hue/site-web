"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Lenis from "lenis";
import type { AnnouncementContent, NavItem } from "@/lib/types";

export default function Nav({
  brand,
  ctaLabel,
  links,
  announcement,
}: {
  brand: string;
  ctaLabel: string;
  links: NavItem[];
  announcement?: AnnouncementContent;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const enteteRef = useRef<HTMLElement>(null);

  // La hauteur réelle de l'en-tête est publiée en variable CSS : le hero s'en
  // sert pour réserver la place. Un nombre écrit en dur serait faux dès que le
  // bandeau d'annonce est activé, ou que son texte passe sur deux lignes.
  useEffect(() => {
    const el = enteteRef.current;
    if (!el) return;
    const publier = () =>
      document.documentElement.style.setProperty(
        "--entete-h",
        `${Math.round(el.getBoundingClientRect().height)}px`
      );
    publier();
    const ro = new ResizeObserver(publier);
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty("--entete-h");
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    const el = document.querySelector(href);
    if (lenis && el) lenis.scrollTo(el as HTMLElement, { offset: -20 });
    else el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      ref={enteteRef}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-[9000]"
    >
      {/* Bandeau d'annonce : le groupe existait dans le back-office depuis le
          début, avec la promesse « Barre affichée tout en haut du site », mais
          n'était rendu nulle part. L'éditeur cochait la case sans rien voir
          changer. */}
      {announcement?.enabled && announcement.text && (
        <div className="bg-ink px-5 py-2 text-center font-sans text-sm text-white">
          <span>{announcement.text}</span>
          {announcement.linkLabel && announcement.linkTarget && (
            <a
              href={announcement.linkTarget}
              className="ml-2 inline-block min-h-[24px] font-medium text-lime underline underline-offset-4"
            >
              {announcement.linkLabel}
            </a>
          )}
        </div>
      )}

      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-500 md:px-8 ${
          scrolled ? "py-3" : "py-6"
        }`}
      >
        <button
          onClick={() => go("body")}
          data-cursor="hover"
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-ink"
        >
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-lime shadow-[0_0_12px_rgba(205,255,58,0.9)]" />
          {brand}
        </button>

        <nav
          className={`hidden items-center gap-1 rounded-full px-2 py-2 transition-all duration-500 md:flex ${
            scrolled ? "glass-strong" : "glass"
          }`}
        >
          {links.map((l) => (
            <button
              key={l.target}
              onClick={() => go(l.target)}
              data-cursor="hover"
              className="rounded-full px-4 py-2 font-sans text-sm text-ink/80 transition-colors duration-300 hover:bg-court/10 hover:text-court"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => go("#reservation")}
          data-cursor="hover"
          className="hidden rounded-full bg-court px-6 py-3 font-sans text-sm font-medium text-white shadow-[0_8px_30px_-8px_rgba(27,77,228,0.7)] transition-transform duration-300 hover:scale-[1.03] md:inline-flex"
        >
          {ctaLabel}
        </button>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
          className="flex h-11 w-11 items-center justify-center rounded-full glass md:hidden"
        >
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-5 bg-ink transition-transform duration-300 ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-ink transition-opacity duration-300 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-ink transition-transform duration-300 ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {/* La fermeture est animée en hauteur, pas en `display` : sans `inert`, les
          cinq commandes du menu replié restaient focalisables et annoncées, et
          une tabulation déclenchait un défilement inexpliqué. */}
      <motion.nav
        initial={false}
        inert={!open}
        aria-hidden={!open}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mx-5 mt-3 overflow-hidden rounded-3xl glass-strong md:hidden"
      >
        <div className="flex flex-col p-4">
          {links.map((l) => (
            <button
              key={l.target}
              onClick={() => go(l.target)}
              className="rounded-2xl px-4 py-3 text-left font-sans text-base text-ink/80 transition-colors hover:bg-court/10 hover:text-court"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => go("#reservation")}
            className="mt-2 rounded-2xl bg-court px-4 py-3 text-center font-sans font-medium text-white"
          >
            {ctaLabel}
          </button>
        </div>
      </motion.nav>
    </motion.header>
  );
}
