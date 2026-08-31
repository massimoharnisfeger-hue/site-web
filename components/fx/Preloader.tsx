"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Premium loading screen, light & sporty: an animated counter rising 0→100
 * with a progress line and a bouncing padel ball, then a curtain reveal.
 */
export default function Preloader({ brand }: { brand: string }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Déjà vu pendant cette session de navigation : le rideau n'apprend plus
    // rien au visiteur et ne fait que retarder l'affichage. Le stockage de
    // session peut lever en navigation privée, d'où le try.
    let dejaVu = false;
    try {
      dejaVu = sessionStorage.getItem("ph-preloader") === "1";
    } catch {
      dejaVu = false;
    }

    if (reduced || dejaVu) {
      setProgress(100);
      const t = setTimeout(() => setDone(true), reduced ? 200 : 0);
      return () => clearTimeout(t);
    }

    try {
      sessionStorage.setItem("ph-preloader", "1");
    } catch {
      // Sans stockage, le rideau se réaffichera : sans gravité.
    }

    // 1100 ms était une durée *fixe* : le rideau retenait le contenu même
    // lorsque la page était prête en 300 ms, ce qui plaçait un plancher
    // artificiel sur le LCP mesuré par Google. C'est désormais un plafond. Le
    // rideau se lève dès que le document est prêt, sans descendre sous MINIMUM,
    // le temps que l'animation soit lisible plutôt que clignotante.
    const PLAFOND = 1100;
    const MINIMUM = 450;
    const HOLD = 200;

    let raf = 0;
    let hold = 0;
    let fini = false;
    const start = performance.now();

    const terminer = () => {
      if (fini) return;
      fini = true;
      hold = window.setTimeout(() => setDone(true), HOLD);
    };

    const tick = (now: number) => {
      const ecoule = now - start;
      // « interactive » et non « complete » : `complete` attend toutes les
      // sous-ressources, y compris la feuille de police servie par un tiers.
      // Si ce tiers rame ou est bloqué, le rideau restait jusqu'au plafond
      // alors que la page était utilisable depuis longtemps.
      const pret = document.readyState !== "loading";
      const t = Math.min(1, ecoule / PLAFOND);
      // Décélération cubique : la barre part vite puis s'apaise.
      setProgress(Math.round((1 - Math.pow(1 - t, 3)) * 100));

      if (t >= 1 || (pret && ecoule >= MINIMUM)) {
        setProgress(100);
        terminer();
        return;
      }
      raf = requestAnimationFrame(tick);
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
              {brand}
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
            <span className="font-sans text-sm tracking-wide text-ink/65">
              On prépare le terrain…
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
