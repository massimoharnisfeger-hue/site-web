"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SplitText from "@/components/fx/SplitText";
import MagneticButton from "@/components/ui/MagneticButton";
import Lenis from "lenis";
import type { HeroContent } from "@/lib/types";

const WebGLBackdrop = dynamic(() => import("@/components/fx/WebGLBackdrop"), {
  ssr: false,
});

// Extract a YouTube video id from common URL formats.
function youtubeId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/
  );
  return m ? m[1] : null;
}

export default function Hero({ content }: { content: HeroContent }) {
  const ytId = youtubeId(content.videoUrl);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const scrollDown = () => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    const el = document.querySelector("#offres");
    if (lenis && el) lenis.scrollTo(el as HTMLElement);
    else el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      className="relative h-[100svh] w-full overflow-hidden bg-cloud"
    >
      {ytId ? (
        <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
          <iframe
            title="Vidéo de fond"
            className="absolute left-1/2 top-1/2 h-[110vh] w-[195vh] -translate-x-1/2 -translate-y-1/2"
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&modestbranding=1&playsinline=1&rel=0`}
            allow="autoplay; encrypted-media"
            frameBorder="0"
          />
          <div className="absolute inset-0 bg-cloud/55" />
        </div>
      ) : (
        <WebGLBackdrop />
      )}

      {/* Soft light wash for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cloud/40 via-transparent to-cloud/70" />

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-5 text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full glass px-5 py-2 font-sans text-xs uppercase tracking-[0.3em] text-court"
        >
          <span className="h-1.5 w-1.5 animate-bounce-ball rounded-full bg-lime" />
          {content.eyebrow}
        </motion.span>

        <h1 className="font-display text-[14vw] font-semibold leading-[0.92] tracking-tightest text-ink display-shadow md:text-[8.5rem]">
          <SplitText text={content.title1} delay={0.9} className="block" />
          <span className="block text-court">
            <SplitText text={content.title2} delay={1.4} />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 1 }}
          className="mt-8 max-w-xl font-sans text-base text-ink/70 md:text-lg"
        >
          {content.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3, duration: 1 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <MagneticButton href="#reservation">
            {content.ctaPrimary}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </MagneticButton>
          <MagneticButton href="#parcours" variant="ghost">
            {content.ctaSecondary}
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.button
        onClick={scrollDown}
        aria-label="Défiler vers le bas"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.7, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        data-cursor="hover"
      >
        <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-ink/50">
          C'est parti
        </span>
        <span className="flex h-10 w-6 justify-center rounded-full border border-ink/30 p-1">
          <motion.span
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-2 w-1 rounded-full bg-court"
          />
        </span>
      </motion.button>
    </section>
  );
}
