import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, EASE_SOFT } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { IconPlus } from "../ui/Icons";
import { useReduceMotion } from "../../hooks/useMediaQuery";
import { fr } from "../../lib/typo";
import type { Site } from "../../types";

type Props = { faq: Site["faq"] };

export function Faq({ faq }: Props) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReduceMotion();

  return (
    <Section id="faq" labelledBy="faq-title">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow text-turf">{fr(faq.eyebrow)}</p>
          <h2 id="faq-title" className="mt-3">
            {fr(faq.title)}
          </h2>
          <p className="lede mt-5">{fr(faq.intro)}</p>
        </Reveal>

        <Reveal delay={0.06} className="lg:col-span-7">
          <div className="border-t border-rule">
            {faq.items.map((item, index) => {
              const isOpen = open === index;
              const buttonId = `faq-button-${index}`;
              const panelId = `faq-panel-${index}`;
              return (
                <div key={item.question} className="border-b border-rule">
                  <h3 className="font-sans text-[17px] font-medium leading-snug tracking-normal">
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : index)}
                      className="flex min-h-16 w-full items-center justify-between gap-6 py-3 text-left"
                    >
                      <span>{fr(item.question)}</span>
                      <span
                        aria-hidden="true"
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-[transform,border-color,color] duration-300 ease-soft ${
                          isOpen ? "rotate-45 border-turf text-turf" : "border-rule text-ink"
                        }`}
                      >
                        <IconPlus />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        key="panel"
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduce ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.3, ease: EASE_SOFT }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[62ch] pb-6 text-muted">{fr(item.answer)}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
