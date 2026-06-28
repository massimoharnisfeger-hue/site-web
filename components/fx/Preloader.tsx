"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Premium loading screen, light & sporty: an animated counter rising 0→100
 * with a progress line and a bouncing padel ball, then a curtain reveal.
 */
export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) {
      setProgress(100);
      const t = setTimeout(() => setDone(true), 200);
      return () => clearTimeout(t);
    }

    let current = 0;
    const tick = () => {
      const remaining = 100 - current;
      current += Math.max(1.6, remaining * 0.09 + Math.random() * 2);
      if (current >= 100) {
        current = 100;
        setProgress(100);
        setTimeout(() => setDone(true), 500);
        return;
      }
      setProgress(current);
      timer = window.setTimeout(tick, 45 + Math.random() * 45);
    };
    let timer = window.setTimeout(tick, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = done ? "" : "hidden";
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden bg-cloud"
          exit={{ y: "-100%" }}
          transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="font-sans text-xs uppercase tracking-[0.5em] text-court"
            >
              Padel House
            </motion.span>

            {/* Bouncing padel ball */}
            <motion.span
              className="h-6 w-6 rounded-full bg-lime shadow-[0_0_24px_6px_rgba(205,255,58,0.6)]"
              animate={{ y: [0, -18, 0] }}
              transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
            />

            <span className="font-display text-7xl font-semibold tabular-nums text-ink md:text-9xl">
              {Math.round(progress)}
              <span className="text-court">%</span>
            </span>

            {/* Progress line */}
            <div className="h-1 w-56 overflow-hidden rounded-full bg-haze">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-court to-teal"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
            <span className="font-sans text-sm tracking-wide text-ink/50">
              On prépare le terrain…
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
