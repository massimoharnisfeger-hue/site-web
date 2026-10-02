"use client";

import { useEffect, useRef, useState } from "react";

function format(n: number, decimals: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

/**
 * Chiffre qui se compte à son arrivée à l'écran. Le HTML serveur porte déjà
 * la valeur finale ; le compteur ne repart de zéro que pour un chiffre encore
 * hors de l'écran, et jamais en mouvement réduit. Les lecteurs d'écran lisent
 * la valeur finale, pas le défilement.
 */
export default function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  const decimals = (String(value).split(".")[1] ?? "").length;

  useEffect(() => {
    const el = ref.current;
    if (!el || value === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return;

    setShown(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const k = Math.min(1, (t - t0) / 900);
          setShown(value * (1 - Math.pow(1 - k, 3)));
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <>
      <span className="sr-only">
        {format(value, decimals)}
        {suffix}
      </span>
      <span ref={ref} aria-hidden="true">
        {format(Number(shown.toFixed(decimals)), decimals)}
        {suffix}
      </span>
    </>
  );
}
