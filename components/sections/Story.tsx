"use client";

import { useRef, MouseEvent } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { StoryStep, ParcoursContent } from "@/lib/types";

const onImgError = (e: MouseEvent<HTMLImageElement>) => {
  (e.currentTarget as HTMLImageElement).style.display = "none";
};

function Panel({ item, index }: { item: StoryStep; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [0, 1, 1, 0]
  );

  const reversed = index % 2 === 1;

  return (
    <div
      ref={ref}
      className="relative flex min-h-[85vh] items-center overflow-hidden"
    >
      <motion.div
        style={{ y: imgY, scale }}
        className="absolute inset-0 -z-10 bg-court"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          onError={onImgError}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/65 to-ink/10" />
      </motion.div>

      <motion.div
        style={{ y: textY, opacity }}
        className={`mx-auto w-full max-w-7xl px-5 md:px-8 ${
          reversed ? "text-right" : "text-left"
        }`}
      >
        <div className={`max-w-xl ${reversed ? "ml-auto" : ""}`}>
          <span className="font-display text-7xl font-semibold text-lime/80 md:text-9xl">
            {item.step}
          </span>
          <h3 className="-mt-8 font-display text-4xl font-semibold text-white md:text-6xl">
            {item.title}
          </h3>
          <p className="mt-5 font-sans text-lg leading-relaxed text-white/80">
            {item.text}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function Story({ content }: { content: ParcoursContent }) {
  return (
    <section id="parcours" className="relative bg-ink">
      <div className="sticky top-0 z-10 flex justify-center pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="pointer-events-none absolute top-10 text-center"
        >
          <span className="font-sans text-xs uppercase tracking-[0.35em] text-lime">
            {content.eyebrow}
          </span>
        </motion.div>
      </div>
      {content.items.map((s, i) => (
        <Panel key={i} item={s} index={i} />
      ))}
    </section>
  );
}
