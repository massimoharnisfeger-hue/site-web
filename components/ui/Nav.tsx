"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lenis from "lenis";

const links = [
  { label: "Offres", href: "#offres" },
  { label: "Le club", href: "#parcours" },
  { label: "Galerie", href: "#galerie" },
  { label: "Avis", href: "#avis" },
];

export default function Nav({
  brand,
  ctaLabel,
}: {
  brand: string;
  ctaLabel: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-[9000] transition-all duration-500 ${
        scrolled ? "py-3" : "py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
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
              key={l.href}
              onClick={() => go(l.href)}
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
      <motion.nav
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mx-5 mt-3 overflow-hidden rounded-3xl glass-strong md:hidden"
      >
        <div className="flex flex-col p-4">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
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
