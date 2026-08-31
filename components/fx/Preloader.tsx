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

    // Durée fixe et courte. L'ancienne version avançait par incréments
    // aléatoires et retenait le contenu 6,5 s : c'est du temps volé au
    // visiteur, et le principal poste d'abandon sur mobile.
    const DURATION = 1100;
    const HOLD = 200;
    let raf = 0;
    let hold = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // Décélération cubique : la barre part vite puis s'apaise.
      setProgress(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      hold = window.setTimeout(() => setDone(true), HOLD);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hold);
    };
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
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
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
