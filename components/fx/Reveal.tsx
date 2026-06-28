"use client";

import { motion } from "framer-motion";

/**
 * Generic scroll-reveal wrapper. Sections fade/slide in once when entering the
 * viewport. Direction and delay are configurable for staggered compositions.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 40,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
