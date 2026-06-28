"use client";

import { motion } from "framer-motion";
import type { AvisContent } from "@/lib/types";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < rating ? "#1B4DE4" : "none"}
          stroke="#1B4DE4"
          strokeWidth="1.5"
        >
          <path d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.4 6.8L12 18l-6 3.5 1.4-6.8L2.3 9l6.9-.7L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials({ content }: { content: AvisContent }) {
  return (
    <section
      id="avis"
      className="relative overflow-hidden bg-haze py-28 md:py-36"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-0 opacity-50">
        <svg viewBox="0 0 1440 200" className="w-full" preserveAspectRatio="none">
          <motion.path
            d="M0,100 C360,40 720,160 1440,100 L1440,200 L0,200 Z"
            initial={{ d: "M0,100 C360,40 720,160 1440,100 L1440,200 L0,200 Z" }}
            animate={{
              d: [
                "M0,100 C360,40 720,160 1440,100 L1440,200 L0,200 Z",
                "M0,120 C360,160 720,40 1440,120 L1440,200 L0,200 Z",
                "M0,100 C360,40 720,160 1440,100 L1440,200 L0,200 Z",
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            fill="#1B4DE4"
            opacity="0.1"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 max-w-2xl"
        >
          <span className="font-sans text-xs uppercase tracking-[0.35em] text-court">
            {content.eyebrow}
          </span>
          <h2 className="mt-4 font-display text-4xl font-semibold text-ink md:text-6xl">
            {content.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {content.items.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="animate-float rounded-3xl bg-white p-6 shadow-[0_20px_50px_-24px_rgba(11,27,58,0.35)]"
              style={{ animationDelay: `${i * 0.6}s` }}
            >
              <Stars rating={t.rating} />
              <blockquote className="mt-4 font-sans text-base leading-relaxed text-ink/85">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-court font-display text-sm font-semibold text-white">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <div className="font-sans text-sm font-medium text-ink">
                    {t.name}
                  </div>
                  <div className="font-sans text-xs text-ink/55">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
