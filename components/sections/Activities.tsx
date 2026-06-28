"use client";

import { MouseEvent, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import type { Activity, OffresContent } from "@/lib/types";
import Reveal from "@/components/fx/Reveal";

// Themed accent gradients cycled by index (kept in code, not in the CMS).
const accents = [
  "from-court/30 to-teal/10",
  "from-teal/30 to-court/10",
  "from-lime/30 to-court/10",
  "from-court/30 to-lime/10",
  "from-teal/30 to-lime/10",
];

// Hide a broken image so its themed gradient parent shows instead.
const onImgError = (e: MouseEvent<HTMLImageElement>) => {
  (e.currentTarget as HTMLImageElement).style.display = "none";
};

function TiltCard({ activity, index }: { activity: Activity; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [10, -10]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-12, 12]), {
    stiffness: 150,
    damping: 18,
  });
  const glareX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(my, [0, 1], ["0%", "100%"]);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <Reveal delay={index * 0.08} className="[perspective:1200px]">
      <motion.article
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        data-cursor="hover"
        className="group relative h-[26rem] overflow-hidden rounded-[1.75rem] glass-strong p-1 transition-shadow duration-500 hover:shadow-[0_36px_90px_-24px_rgba(27,77,228,0.45)]"
      >
        <div
          className={`relative h-full w-full overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${
            accents[index % accents.length]
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activity.image}
            alt={activity.name}
            loading="lazy"
            onError={onImgError}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            style={{ transform: "translateZ(0)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

          <motion.div
            className="pointer-events-none absolute -inset-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(220px circle at ${glareX} ${glareY}, rgba(255,255,255,0.32), transparent 60%)`,
            }}
          />

          <div
            className="absolute inset-0 flex flex-col justify-end p-6"
            style={{ transform: "translateZ(50px)" }}
          >
            <span className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-md">
              {activity.level} · {activity.duration}
            </span>
            <h3 className="font-display text-2xl font-semibold text-white">
              {activity.name}
            </h3>
            <p className="mt-1 font-sans text-sm text-white/75">
              {activity.tagline}
            </p>
            <p className="mt-3 max-h-0 overflow-hidden font-sans text-sm leading-relaxed text-white/85 opacity-0 transition-all duration-500 group-hover:max-h-32 group-hover:opacity-100">
              {activity.description}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-display text-lg font-medium text-lime">
                {activity.price}
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lime text-ink transition-transform duration-300 group-hover:rotate-45">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 17L17 7M9 7h8v8"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}

export default function Activities({ content }: { content: OffresContent }) {
  return (
    <section
      id="offres"
      className="relative overflow-hidden bg-cloud py-28 md:py-36"
    >
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-court/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-lime/20 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="mb-16 max-w-2xl">
          <span className="font-sans text-xs uppercase tracking-[0.35em] text-court">
            {content.eyebrow}
          </span>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink md:text-6xl">
            {content.title}
          </h2>
          <p className="mt-5 font-sans text-base text-ink/65 md:text-lg">
            {content.intro}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((a, i) => (
            <TiltCard key={i} activity={a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
