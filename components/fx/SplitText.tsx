"use client";

import { motion } from "framer-motion";

/**
 * Reveals text character-by-character (per word groups kept intact for wrapping).
 * Honors reduced-motion automatically via Framer Motion's reduced-motion support.
 */
export default function SplitText({
  text,
  className = "",
  delay = 0,
  stagger = 0.035,
  as = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "span" | "h1" | "h2";
}) {
  const words = text.split(" ");
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      animate="visible"
      aria-label={text}
      variants={{
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden>
          {word.split("").map((char, ci) => (
            <motion.span
              key={ci}
              className="char"
              variants={{
                hidden: { y: "1.1em", opacity: 0, rotateZ: 6 },
                visible: {
                  y: "0em",
                  opacity: 1,
                  rotateZ: 0,
                  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              {char}
            </motion.span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </MotionTag>
  );
}
