"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
export type CoverflowItem = {
  tag?: string;
  titleLine1: string;
  titleLine2?: string;
  desc?: string;
  img: string;
  imgAlt?: string;
  /** Photographe à créditer, exigé par les conditions d'Unsplash. */
  credit?: string;
  creditLink?: string;
  ctaText?: string;
  ctaUrl?: string;
};

const ChevronLeft = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const ArrowRight = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

/**
 * Préférence système de mouvement réduit. Même idiome que Stats, Preloader ou
 * SmoothScroll : matchMedia direct, avec suivi des changements. Faux au premier
 * rendu (pas de window côté serveur), corrigé dès le montage.
 */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * Signed distance from the active card, taking the shortest way around the
 * ring. Keeps the layout symmetric whatever the number of cards.
 */
function ringOffset(index: number, active: number, total: number) {
  let d = index - active;
  if (d > total / 2) d -= total;
  if (d < -total / 2) d += total;
  return d;
}

export default function CoverflowCarousel({
  items,
  sectionLabel,
  autoplayDelay = 5500,
  unsplashLink,
}: {
  items: CoverflowItem[];
  sectionLabel?: string;
  autoplayDelay?: number;
  /** Lien d'attribution, fourni par le serveur pour ne pas dupliquer ses UTM. */
  unsplashLink?: string;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [compact, setCompact] = useState(false);
  const touchStartX = useRef(0);
  const reduced = usePrefersReducedMotion();
  const total = items.length;

  const next = useCallback(() => setActive((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setActive((i) => (i - 1 + total) % total), [total]);

  // Le décalage des cartes latérales est en pixels : sans adaptation elles
  // débordent sur mobile. En dessous de 768px on resserre et on masque le
  // second rang.
  useEffect(() => {
    const onResize = () => setCompact(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Défilement automatique. Suspendu au survol et au focus clavier (WCAG 2.2.2),
  // et jamais démarré si le visiteur demande un mouvement réduit.
  useEffect(() => {
    if (reduced || paused || total <= 1) return;
    const id = setInterval(next, autoplayDelay);
    return () => clearInterval(id);
  }, [reduced, paused, total, next, autoplayDelay]);

  if (total === 0) return null;

  const cardW = compact ? 250 : 330;
  const cardH = compact ? 400 : 500;
  const nearX = compact ? 168 : 285;
  const farX = compact ? 300 : 510;

  // Les flèches du clavier sont écoutées sur la section, pas sur window :
  // un écouteur global confisquerait les flèches sur toute la page.
  const onKeyDown = (e: ReactKeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  const onTouchEnd = (e: ReactTouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 45) (diff < 0 ? next : prev)();
  };

  const transition = reduced
    ? "opacity 200ms ease"
    : "transform 800ms cubic-bezier(0.25, 1, 0.5, 1), opacity 800ms ease, filter 800ms ease";

  return (
    <section
      id="parcours"
      tabIndex={0}
      aria-roledescription="carrousel"
      aria-label={sectionLabel}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={onTouchEnd}
      className="relative flex min-h-[760px] w-full select-none items-center justify-center overflow-hidden bg-ink py-16 text-white outline-none"
    >
      {/* Ambiance : la photo active, floutée, en fond */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={items[active]?.img}
          alt=""
          aria-hidden
          className="h-full w-full scale-110 object-cover"
          style={{ filter: "brightness(0.25) blur(32px)", transition: "opacity 1000ms ease" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(11,27,58,0.35) 0%, rgba(11,27,58,0.94) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-4">
        {sectionLabel && (
          <div className="mb-10 flex items-center gap-3">
            <span className="h-px w-9 bg-gradient-to-r from-transparent to-lime" />
            <h2 className="m-0 font-sans text-xs font-bold uppercase tracking-[0.3em] text-lime">
              {sectionLabel}
            </h2>
            <span className="h-px w-9 bg-gradient-to-r from-lime to-transparent" />
          </div>
        )}

        <div
          className="relative mb-10 flex w-full items-center justify-center"
          style={{ height: cardH + 20, perspective: reduced ? undefined : "1400px" }}
        >
          {items.map((item, idx) => {
            const d = ringOffset(idx, active, total);
            const far = Math.abs(d) >= 2;
            const hidden = far && compact;
            const isCenter = d === 0;

            const x = d === 0 ? 0 : Math.sign(d) * (Math.abs(d) === 1 ? nearX : farX);
            const scale = isCenter ? 1 : Math.abs(d) === 1 ? 0.84 : 0.68;
            const rotate = reduced ? 0 : -Math.sign(d) * (Math.abs(d) === 1 ? 24 : 38);

            return (
              <article
                key={idx}
                aria-hidden={!isCenter}
                onClick={() => !isCenter && setActive(idx)}
                className="absolute overflow-hidden rounded-[18px] border border-white/12 bg-[#08142B]"
                style={{
                  width: cardW,
                  height: cardH,
                  transform: `translateX(${x}px) scale(${scale}) rotateY(${rotate}deg)`,
                  opacity: hidden ? 0 : isCenter ? 1 : Math.abs(d) === 1 ? 0.65 : 0.35,
                  zIndex: 30 - Math.abs(d) * 10,
                  filter: isCenter ? "brightness(1)" : `brightness(${Math.abs(d) === 1 ? 0.75 : 0.55})`,
                  transition,
                  cursor: isCenter || hidden ? "default" : "pointer",
                  pointerEvents: hidden ? "none" : "auto",
                  boxShadow: isCenter
                    ? "0 25px 60px rgba(0,0,0,0.75), 0 0 35px rgba(205,255,58,0.22)"
                    : "0 15px 35px rgba(0,0,0,0.45)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.img}
                  alt={item.imgAlt || item.titleLine1}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-0 z-10"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(11,27,58,0.45) 0%, rgba(11,27,58,0.1) 25%, rgba(11,27,58,0.7) 60%, rgba(11,27,58,0.97) 100%)",
                  }}
                />

                <div
                  className="relative z-20 flex h-full flex-col justify-between px-5 pb-6 pt-5 text-center"
                  style={{
                    opacity: isCenter ? 1 : 0,
                    transform: isCenter || reduced ? "none" : "translateY(16px)",
                    transition: reduced ? "opacity 200ms ease" : "opacity 500ms ease, transform 500ms ease",
                    pointerEvents: isCenter ? "auto" : "none",
                  }}
                >
                  {item.tag && (
                    <div className="w-full text-right">
                      <span className="font-display text-3xl font-bold leading-none text-lime drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                        {item.tag}
                      </span>
                    </div>
                  )}

                  <div className="mt-auto flex flex-col items-center gap-1">
                    <h3 className="m-0 font-display text-2xl font-bold uppercase leading-tight tracking-[0.02em] text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)]">
                      {item.titleLine1}
                    </h3>

                    {item.titleLine2 && (
                      <span className="font-sans text-base font-semibold uppercase leading-tight tracking-[0.06em] text-cloud drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]">
                        {item.titleLine2}
                      </span>
                    )}

                    <span className="my-2 h-0.5 w-9 rounded-full bg-lime shadow-[0_0_8px_rgba(205,255,58,0.7)]" />

                    {item.desc && (
                      <p className="mb-3 max-w-[280px] font-sans text-sm leading-snug text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        {item.desc}
                      </p>
                    )}

                    {item.credit && (
                      <p className="mb-2 font-sans text-[10px] leading-tight text-white/55">
                        Photo :{" "}
                        <a
                          href={item.creditLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={isCenter ? 0 : -1}
                          className="underline underline-offset-2 hover:text-lime"
                        >
                          {item.credit}
                        </a>{" "}
                        sur{" "}
                        <a
                          href={unsplashLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={isCenter ? 0 : -1}
                          className="underline underline-offset-2 hover:text-lime"
                        >
                          Unsplash
                        </a>
                      </p>
                    )}

                    {item.ctaText && (
                      <a
                        href={item.ctaUrl || "#reservation"}
                        tabIndex={isCenter ? 0 : -1}
                        data-cursor="hover"
                        className="inline-flex items-center gap-1.5 rounded-full bg-lime px-5 py-2 font-sans text-xs font-bold uppercase tracking-[0.14em] text-ink shadow-[0_4px_14px_rgba(0,0,0,0.4)] transition-transform duration-200 hover:scale-105"
                      >
                        <span>{item.ctaText}</span>
                        <ArrowRight />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <button
          onClick={prev}
          aria-label="Étape précédente"
          data-cursor="hover"
          className="absolute left-2 top-1/2 z-40 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75 md:left-6"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={next}
          aria-label="Étape suivante"
          data-cursor="hover"
          className="absolute right-2 top-1/2 z-40 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75 md:right-6"
        >
          <ChevronRight />
        </button>

        <div className="z-30 flex items-center justify-center gap-2">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              aria-label={`Aller à l'étape ${idx + 1} : ${item.titleLine1}`}
              aria-current={idx === active}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: idx === active ? 28 : 8,
                backgroundColor: idx === active ? "#CDFF3A" : "rgba(255,255,255,0.25)",
                boxShadow: idx === active ? "0 0 10px rgba(205,255,58,0.7)" : "none",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
