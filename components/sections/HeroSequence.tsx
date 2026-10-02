"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroContent, SequenceContent } from "@/lib/types";
import type { PadelScene } from "@/components/three/scene";
import RacketPoster from "@/components/court/RacketPoster";
import CourtPlanSvg from "@/components/court/CourtPlanSvg";
import { scrollToTarget } from "@/lib/scroll";

type Mode = "pending" | "3d" | "static";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const remap = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Fenêtres d'affichage des légendes, en progression de la séquence. */
const WINDOWS: [number, number][] = [
  [0.13, 0.3],
  [0.3, 0.48],
  [0.48, 0.72],
  [0.8, 1.2],
];
const FADE = 0.035;

const SOFTWARE_GL = /swiftshader|llvmpipe|softpipe|software|basic render/i;

/**
 * Nom du moteur de rendu WebGL, lu dans un worker : créer un premier contexte
 * WebGL peut prendre près d'une seconde sans processeur graphique, et ne doit
 * pas bloquer la page. `null` : pas de WebGL dans un worker ; `undefined` :
 * test impossible (navigateur ancien, délai dépassé).
 */
function probeRenderer(): Promise<string | null | undefined> {
  return new Promise((resolve) => {
    try {
      const src =
        "try{var c=new OffscreenCanvas(1,1),g=c.getContext('webgl2')||c.getContext('webgl');" +
        "if(!g){postMessage(null)}else{var i=g.getExtension('WEBGL_debug_renderer_info');" +
        "postMessage(i?String(g.getParameter(i.UNMASKED_RENDERER_WEBGL)):'');" +
        "var l=g.getExtension('WEBGL_lose_context');l&&l.loseContext()}}catch(e){postMessage(undefined)}";
      const url = URL.createObjectURL(new Blob([src], { type: "text/javascript" }));
      const worker = new Worker(url);
      let settled = false;
      const done = (v: string | null | undefined) => {
        if (settled) return;
        settled = true;
        worker.terminate();
        URL.revokeObjectURL(url);
        resolve(v);
      };
      worker.onmessage = (e) => done(e.data);
      worker.onerror = () => done(undefined);
      setTimeout(() => done(undefined), 4000);
    } catch {
      resolve(undefined);
    }
  });
}

/** Même test sur le fil principal, quand le worker n'a pas pu répondre. */
function probeRendererHere(): string | null {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return null;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const name = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return name;
  } catch {
    return null;
  }
}

/**
 * WebGL disponible et accéléré par un vrai processeur graphique, sans mode
 * économie de données ni appareil très modeste. Un rendu logiciel
 * (SwiftShader, llvmpipe…) dessinerait une image par seconde : la page se
 * figerait.
 */
async function canRun3d() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) return false;
  const forced = (window as Window & { __forceSequence3d?: boolean }).__forceSequence3d === true;
  let name = await probeRenderer();
  if (typeof name !== "string") name = probeRendererHere();
  if (name === null) return false;
  return forced || !SOFTWARE_GL.test(name);
}

/** Attend un moment calme après le chargement, pour ne pas gêner le premier affichage. */
function whenIdle(timeout: number) {
  return new Promise<void>((resolve) => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => resolve(), { timeout });
    else setTimeout(resolve, 200);
  });
}

export default function HeroSequence({
  hero,
  sequence,
  brand,
}: {
  hero: HeroContent;
  sequence: SequenceContent;
  brand: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<SVGSVGElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLAnchorElement>(null);
  const captionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [mode, setMode] = useState<Mode>("pending");
  const [ready, setReady] = useState(false);

  const players = sequence.players
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const captions = [
    ...sequence.steps.slice(0, 3),
    { label: sequence.figureLabel, title: sequence.figureTitle, text: sequence.figureCaption },
  ];
  const dims = { length: sequence.dimLength, width: sequence.dimWidth, service: sequence.dimService };

  useEffect(() => {
    let cancelled = false;
    // Mouvement réduit : décidé tout de suite, sans rien tester.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMode("static");
      return;
    }
    // Le test du processeur graphique attend que la page soit affichée.
    whenIdle(1500)
      .then(canRun3d)
      .then((ok) => {
        if (cancelled) return;
        setMode(ok ? "3d" : "static");
        // Sans 3D, la séquence perd sa hauteur de défilement : une ancre visée
        // à l'arrivée (#reservation…) se retrouverait décalée.
        if (!ok && window.location.hash.length > 1) {
          requestAnimationFrame(() => {
            const el = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
            el?.scrollIntoView();
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (mode !== "3d") return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!section || !stage || !canvas) return;

    let disposed = false;
    let scene: PadelScene | null = null;
    let lastP = -1;
    let shown = false;
    const narrow = window.matchMedia("(max-width: 767px)");

    // Garde-fou : sans vrai processeur graphique (rendu logiciel, appareil à
    // bout de souffle), une image peut prendre une seconde et figer toute la
    // page. On mesure les premières images : trop lent, on allège ; encore
    // trop lent, on passe au plan statique.
    const forced = (window as Window & { __forceSequence3d?: boolean }).__forceSequence3d === true;
    let phase = forced ? 2 : 0; // 0 : mesure, 1 : mesure après allègement, 2 : terminé
    let frames = 0;
    let t0 = 0;
    let lastT = 0;
    let samples: number[] = [];
    const resetMeasure = () => {
      t0 = 0;
      lastT = 0;
      samples = [];
    };
    const measure = () => {
      if (phase === 2) return;
      const t = performance.now();
      // Les premières images compilent les shaders : elles ne comptent pas.
      if (++frames <= 3) return;
      // Une image de plus d'une demi-seconde après l'échauffement : aucun
      // allègement ne suffira, inutile d'attendre la suite de la mesure.
      if (lastT && t - lastT > 500) {
        phase = 2;
        setMode("static");
        return;
      }
      if (lastT) samples.push(t - lastT);
      lastT = t;
      if (!t0) t0 = t;
      if (samples.length < 24 && t - t0 < 2500) return;
      const sorted = [...samples].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)] ?? 0;
      resetMeasure();
      if (median > (phase === 0 ? 90 : 60)) {
        phase = 2;
        setMode("static");
      } else if (median > 40 && phase === 0) {
        phase = 1;
        scene?.degrade();
      } else {
        phase = 2;
      }
    };
    const onVisibility = () => resetMeasure();
    document.addEventListener("visibilitychange", onVisibility);

    const getProgress = () => {
      const r = section.getBoundingClientRect();
      const total = r.height - stage.offsetHeight;
      return total > 0 ? clamp01(-r.top / total) : 0;
    };

    const onFrame = (p: number) => {
      measure();
      if (!shown) {
        shown = true;
        setReady(true);
      }
      if (Math.abs(p - lastP) < 0.0004) return;
      lastP = p;

      const out = smooth(remap(p, 0.03, 0.11));
      const copy = copyRef.current;
      if (copy) {
        copy.style.opacity = (1 - out).toFixed(3);
        copy.style.transform = `translate3d(0, ${(-28 * out).toFixed(1)}px, 0)`;
        copy.style.visibility = out > 0.995 ? "hidden" : "visible";
      }
      if (hintRef.current) hintRef.current.style.opacity = (1 - smooth(remap(p, 0, 0.04))).toFixed(3);

      captionRefs.current.forEach((el, i) => {
        if (!el) return;
        const [a, b] = WINDOWS[i];
        const o = smooth(remap(p, a - FADE, a)) * (1 - smooth(remap(p, b - FADE, b)));
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translate3d(0, ${((1 - o) * 14).toFixed(1)}px, 0)`;
        el.style.visibility = o < 0.01 ? "hidden" : "visible";
      });

      // Le rail et le lien d'évitement s'effacent sur le plan final ; sur
      // téléphone, le lien n'apparaît qu'une fois le texte d'accueil parti.
      const tail = 1 - smooth(remap(p, 0.74, 0.8));
      const rail = railRef.current;
      if (rail) {
        rail.style.setProperty("--p", p.toFixed(4));
        rail.style.opacity = tail.toFixed(3);
        const active = WINDOWS.findIndex(([a, b]) => p >= a - FADE && p < b);
        rail.dataset.active = String(active);
      }
      const skip = skipRef.current;
      if (skip) {
        const o = narrow.matches ? smooth(remap(p, 0.08, 0.12)) * tail : tail;
        skip.style.opacity = o.toFixed(3);
        skip.style.visibility = o < 0.01 ? "hidden" : "visible";
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!scene) return;
        // Dernière entrée du lot : sur défilement rapide, l'observateur peut
        // livrer [entrée, sortie] d'un coup, et la plus récente fait foi.
        const entry = entries[entries.length - 1];
        if (entry.isIntersecting) scene.start();
        else {
          scene.stop();
          resetMeasure();
        }
      },
      { rootMargin: "120px 0px" }
    );
    const ro = new ResizeObserver(() => scene?.resize());

    const onPointer = (e: PointerEvent) => {
      if (!scene || e.pointerType !== "mouse") return;
      const r = stage.getBoundingClientRect();
      scene.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
    };

    (async () => {
      const css = getComputedStyle(document.documentElement);
      const display = css.getPropertyValue("--font-display").trim() || "sans-serif";
      const mono = css.getPropertyValue("--font-mono").trim() || "monospace";
      try {
        await Promise.all([document.fonts.load(`500 48px ${display}`), document.fonts.load(`24px ${mono}`)]);
      } catch {
        // Polices de secours : la texture de la raquette reste lisible.
      }
      const { createPadelScene } = await import("@/components/three/scene");
      if (disposed) return;
      const small = window.innerWidth < 768;
      const modest = (navigator.hardwareConcurrency ?? 8) <= 4;
      try {
        scene = await createPadelScene({
          canvas,
          overlay: overlayRef.current,
          quality: small || modest ? "low" : "high",
          fonts: { display, mono },
          brand,
          labels: { ...dims, players },
          getProgress,
          onFrame,
          onContextLost: () => setMode("static"),
        });
      } catch {
        setMode("static");
        return;
      }
      // Démonté pendant la construction : on libère aussitôt.
      if (disposed) {
        scene.dispose();
        scene = null;
        return;
      }
      io.observe(section);
      ro.observe(stage);
      stage.addEventListener("pointermove", onPointer);
      scene.start();
    })();

    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
      ro.disconnect();
      stage.removeEventListener("pointermove", onPointer);
      scene?.dispose();
      scene = null;
    };
    // Le contenu ne change pas pendant la vie de la page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const is3d = mode === "3d";

  return (
    <section
      ref={sectionRef}
      id="accueil"
      data-mode={mode}
      aria-label={`${hero.title1} ${hero.title2}`}
      className="seq relative"
    >
      <div ref={stageRef} className="seq-stage">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={`seq-canvas absolute inset-0 h-full w-full transition-opacity duration-700 ${
            is3d && ready ? "opacity-100" : "opacity-0"
          }`}
        />
        <svg ref={overlayRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-0" />

        {/* Illustration : avant la 3D, et à sa place quand elle est désactivée. */}
        <div
          aria-hidden="true"
          className={`seq-poster pointer-events-none transition-opacity duration-700 ${is3d && ready ? "opacity-0" : "opacity-100"}`}
        >
          <RacketPoster brand={brand} className="h-full w-auto" />
        </div>

        <div className="container-site seq-copy-wrap">
          <div ref={copyRef} className="seq-copy">
            <p className="label text-turf">{hero.eyebrow}</p>
            <h1 className="h1 mt-4">
              {hero.title1}
              <br />
              {hero.title2}
              <span className="ball-dot" aria-hidden="true" />
            </h1>
            <p className="lead mt-5">{hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href="#reservation"
                className="btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget("#reservation", undefined, true);
                }}
              >
                {hero.ctaPrimary}
              </a>
              <a
                href="#parcours"
                className="link-arrow"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget("#parcours", undefined, true);
                }}
              >
                {hero.ctaSecondary} <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Légendes de la séquence (3D). */}
        <ol className="seq-captions" aria-hidden={!is3d}>
          {captions.map((c, i) => (
            <li
              key={i}
              ref={(el) => {
                captionRefs.current[i] = el;
              }}
              className="seq-caption"
            >
              <p className="label text-turf">{c.label}</p>
              <p className="mt-2 font-display text-[20px] font-medium leading-tight tracking-[-0.015em]">{c.title}</p>
              <p className="mt-2 text-[15px] leading-[1.55] text-muted">{c.text}</p>
            </li>
          ))}
        </ol>

        <div ref={railRef} className="seq-rail" aria-hidden="true">
          {captions.map((c, i) => (
            <span key={i} className="seq-rail-item label" data-i={i}>
              {c.label.split("·")[0].trim()}
            </span>
          ))}
          <span className="seq-rail-ball" />
        </div>

        <div ref={hintRef} className="seq-hint" aria-hidden="true">
          <span className="label text-muted">{hero.scrollHint}</span>
          <span className="seq-hint-line" />
        </div>

        <a
          ref={skipRef}
          href="#offres"
          className="seq-skip label"
          onClick={(e) => {
            // Saute à la section qui suit la séquence, quelle qu'elle soit.
            e.preventDefault();
            const next = sectionRef.current?.nextElementSibling;
            scrollToTarget(next instanceof HTMLElement ? next : "#offres", undefined, true);
          }}
        >
          {hero.skipLabel} <span aria-hidden="true">↓</span>
        </a>
      </div>

      {/* Version statique : mouvement réduit, ou 3D indisponible. */}
      <div className="seq-static container-site pb-[88px] lg:pb-[120px]">
        <div className="grid gap-10 border-t border-rule pt-12 lg:grid-cols-12 lg:gap-14">
          <ol className="grid content-start gap-8 lg:col-span-5">
            {captions.map((c, i) => (
              <li key={i} className="border-t border-rule pt-5 first:border-t-0 first:pt-0">
                <p className="label text-turf">{c.label}</p>
                <p className="h3 mt-2">{c.title}</p>
                <p className="mt-2 text-[15px] text-muted">{c.text}</p>
              </li>
            ))}
          </ol>
          <figure className="m-0 lg:col-span-7">
            <CourtPlanSvg dims={dims} players={players} label={sequence.figureCaption} className="h-auto w-full" />
            <figcaption className="mt-3 flex items-baseline gap-3 text-[13px] text-muted">
              <span className="label shrink-0">{sequence.figureLabel}</span>
              <span>{sequence.figureCaption}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
