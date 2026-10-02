import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useReduceMotion } from "../../hooks/useMediaQuery";

export const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

type Tag = "div" | "li" | "article" | "figure" | "section" | "header" | "p";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: Tag;
};

/** Apparition : fondu + montée de 12 px, une seule fois. Rien en mouvement réduit. */
export function Reveal({ children, delay = 0, className, as = "div" }: Props) {
  const reduce = useReduceMotion();
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, ease: EASE_SOFT, delay }}
    >
      {children}
    </MotionTag>
  );
}
