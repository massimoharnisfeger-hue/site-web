"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { FaqContent } from "@/lib/types";

function Row({
  item,
  open,
  onToggle,
  index,
}: {
  item: { question: string; answer: string };
  open: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div className="border-b border-ink/10">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`faq-reponse-${index}`}
          data-cursor="hover"
          // min-h-[56px] : au-dessus du seuil de 44 px des cibles tactiles.
          className="flex min-h-[56px] w-full items-center justify-between gap-6 py-5 text-left outline-none transition-colors hover:text-court focus-visible:ring-2 focus-visible:ring-court focus-visible:ring-offset-4 focus-visible:ring-offset-cloud"
        >
          <span className="font-display text-lg font-medium text-ink md:text-xl">
            {item.question}
          </span>
          <span
            aria-hidden
            className={`flex h-8 w-8 flex-none items-center justify-center rounded-full border border-ink/15 transition-transform duration-300 ${
              open ? "rotate-45 border-court bg-court text-white" : "text-ink/65"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
            </svg>
          </span>
        </button>
      </h3>

      <div
        id={`faq-reponse-${index}`}
        role="region"
        hidden={!open}
        className="pb-6 pr-12"
      >
        {/* text-ink/65 : plancher de contraste AA sur fond clair (5,13:1). */}
        <p className="max-w-[65ch] font-sans text-base leading-relaxed text-ink/65">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function Faq({ content }: { content: FaqContent }) {
  const [open, setOpen] = useState<number | null>(0);

  if (content.items.length === 0) return null;

  return (
    <section id="faq" className="relative bg-cloud py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 max-w-2xl"
        >
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-court">
            {content.eyebrow}
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink md:text-5xl">
            {content.title}
          </h2>
          {content.intro && (
            <p className="mt-5 max-w-[60ch] font-sans text-base leading-relaxed text-ink/65 md:text-lg">
              {content.intro}
            </p>
          )}
        </motion.div>

        <div>
          {content.items.map((item, i) => (
            <Row
              key={i}
              index={i}
              item={item}
              open={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
