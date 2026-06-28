"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { Stat, ChiffresContent } from "@/lib/types";

function Counter({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      setValue(stat.value);
      return;
    }
    const duration = 1800;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(stat.value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, stat.value]);

  const display = Number.isInteger(stat.value)
    ? Math.round(value).toLocaleString("fr-FR")
    : value.toFixed(1).replace(".", ",");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="relative rounded-3xl border border-white/15 bg-white/5 p-8 text-center backdrop-blur-md"
    >
      <div className="font-display text-5xl font-semibold tabular-nums text-white md:text-6xl">
        {display}
        <span className="text-lime">{stat.suffix}</span>
      </div>
      <div className="mt-3 font-sans text-sm uppercase tracking-[0.2em] text-white/70">
        {stat.label}
      </div>
    </motion.div>
  );
}

export default function Stats({ content }: { content: ChiffresContent }) {
  return (
    <section className="relative overflow-hidden bg-court py-28">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-1/4 top-1/2 h-72 w-72 rounded-full bg-teal/50 blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-lime/30 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-14 text-center font-display text-3xl font-semibold text-white md:text-5xl"
        >
          {content.title}
        </motion.h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {content.items.map((s, i) => (
            <Counter key={i} stat={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
