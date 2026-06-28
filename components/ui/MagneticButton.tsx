"use client";

import { useRef, MouseEvent } from "react";
import { motion } from "framer-motion";

/**
 * Magnetic CTA: the button gently follows the cursor when hovered, then springs
 * back. A classic Awwwards micro-interaction. Falls back gracefully on touch.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  const handleMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0px, 0px)";
  };

  const base =
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 font-sans text-sm font-medium tracking-wide transition-[transform,box-shadow] duration-300 ease-out will-change-transform";
  const styles =
    variant === "primary"
      ? "bg-court text-white shadow-[0_12px_40px_-10px_rgba(27,77,228,0.6)] hover:shadow-[0_18px_55px_-8px_rgba(27,77,228,0.85)]"
      : "glass text-ink hover:text-court";

  const inner = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span className="absolute inset-0 -z-0 translate-y-full bg-white/20 transition-transform duration-500 ease-out group-hover:translate-y-0" />
    </>
  );

  const shared = {
    ref,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    className: `${base} ${styles} ${className}`,
    "data-cursor": "hover",
  } as const;

  if (href) {
    return (
      <motion.a href={href} onClick={onClick} {...shared}>
        {inner}
      </motion.a>
    );
  }
  return (
    <motion.button type="button" onClick={onClick} {...shared}>
      {inner}
    </motion.button>
  );
}
