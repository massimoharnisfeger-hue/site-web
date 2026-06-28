"use client";

import { useEffect, useRef } from "react";

/**
 * Premium custom cursor: a soft glowing dot with a trailing "water" ring,
 * plus a canvas ripple trail that follows the pointer. Disabled on touch
 * devices and when reduced-motion is requested.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)")
      .matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    if (!canHover) return;

    document.body.classList.add("has-custom-cursor");

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const pointer = { x: w / 2, y: h / 2 };
    const ringPos = { x: w / 2, y: h / 2 };
    let lastX = pointer.x;
    let lastY = pointer.y;

    type Ripple = { x: number; y: number; r: number; alpha: number };
    const ripples: Ripple[] = [];

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

      // Spawn ripples based on movement speed.
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const speed = Math.hypot(dx, dy);
      if (!reduced && speed > 6 && ripples.length < 40) {
        ripples.push({ x: e.clientX, y: e.clientY, r: 2, alpha: 0.5 });
      }
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    // Grow the ring on interactive elements.
    const onOver = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, [data-cursor='hover'], input, select")) {
        ring.dataset.state = "hover";
      } else {
        ring.dataset.state = "default";
      }
    };

    let raf = 0;
    const render = () => {
      // Ring follows with easing.
      ringPos.x += (pointer.x - ringPos.x) * 0.18;
      ringPos.y += (pointer.y - ringPos.y) * 0.18;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;

      ctx.clearRect(0, 0, w, h);
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 1.4;
        rp.alpha -= 0.012;
        if (rp.alpha <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(27, 77, 228, ${rp.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      raf = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointerover", onOver);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointerover", onOver);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9995] hidden md:block"
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9997] hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-court shadow-[0_0_12px_4px_rgba(27,77,228,0.5)] md:block"
        style={{ marginLeft: -4, marginTop: -4 }}
      />
      <div
        ref={ringRef}
        data-state="default"
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9996] hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-court/50 transition-[width,height,opacity] duration-300 data-[state=hover]:h-16 data-[state=hover]:w-16 data-[state=hover]:border-teal/80 md:block"
        style={{ marginLeft: -20, marginTop: -20 }}
      />
    </>
  );
}
