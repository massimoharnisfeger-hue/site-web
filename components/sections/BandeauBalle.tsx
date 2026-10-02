"use client";

import { useEffect, useRef } from "react";
import type { BandeauContent } from "@/lib/types";

/**
 * Bandeau défilant (adapté de « Scroll Text Marquee », 21st.dev,
 * @uilayout.contact). Réécrit sans dépendance : une boucle `requestAnimationFrame`
 * translate la piste, et la vitesse de défilement de la page accélère et oriente
 * le mouvement. En mouvement réduit, le bandeau est fixe et centré ; hors écran,
 * la boucle est mise en pause.
 */
export default function BandeauBalle({ content }: { content: BandeauContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let offset = 0;
    let half = track.scrollWidth / 2;
    let lastScroll = window.scrollY;
    let boost = 0;
    let running = false;
    let last = performance.now();

    const onResize = () => {
      half = track.scrollWidth / 2;
    };
    const onScroll = () => {
      const y = window.scrollY;
      // Vitesse de la page → impulsion sur le défilement du bandeau.
      boost += (y - lastScroll) * 0.35;
      lastScroll = y;
    };

    const frame = (now: number) => {
      const dt = Math.min(64, now - last) / 16.67;
      last = now;
      boost *= 0.9; // l'impulsion retombe
      offset += (1.1 + boost) * dt; // 1.1 px/frame de base, vers la gauche
      // Repli de la piste sur elle-même, dans les deux sens.
      if (half > 0) offset = ((offset % half) + half) % half;
      track.style.transform = `translate3d(${-offset}px,0,0)`;
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: "100px 0px" });
    io.observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (!content.enabled || content.words.length === 0) return null;
  const words = [...content.words, ...content.words];

  return (
    <section ref={sectionRef} aria-hidden="true" className="overflow-hidden bg-ink py-4 text-white lg:py-5">
      <div ref={trackRef} className="bandeau-track flex w-max items-center will-change-transform">
        {words.map((w, i) => (
          <span key={i} className="flex items-center">
            <span className="px-5 font-display text-[18px] font-medium tracking-[-0.01em] lg:px-7 lg:text-[22px]">{w}</span>
            <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-ball" />
          </span>
        ))}
      </div>
    </section>
  );
}
