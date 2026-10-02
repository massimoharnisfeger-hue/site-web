"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { AnnouncementContent, NavItem } from "@/lib/types";
import CourtIcon from "@/components/court/CourtIcon";
import { lockScroll, scrollToTarget } from "@/lib/scroll";

/**
 * En-tête fixe. Fond plein et sans flou : un `backdrop-filter` posé sur la
 * scène 3D obligerait le navigateur à recalculer le flou à chaque image.
 *
 * Sur la page d'accueil, les liens font défiler jusqu'à leur section et la
 * section en cours est marquée d'une balle. Sur les pages légales
 * (`onHome={false}`), ils ramènent vers l'accueil.
 */
export default function Nav({
  brand,
  ctaLabel,
  links,
  announcement,
  onHome = true,
}: {
  brand: string;
  ctaLabel: string;
  links: NavItem[];
  announcement?: AnnouncementContent;
  onHome?: boolean;
}) {
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const panelId = useId();

  const href = (target: string) => (onHome || !target.startsWith("#") ? target : `/${target}`);

  const go = (e: React.MouseEvent, target: string) => {
    const wasOpen = open;
    setOpen(false);
    if (!onHome || !target.startsWith("#")) return;
    e.preventDefault();
    // Lenis ignore un défilement demandé pendant qu'il est à l'arrêt.
    if (wasOpen) lockScroll(false);
    scrollToTarget(target, undefined, true);
  };

  // Hauteur réelle publiée pour les ancres et le défilement programmé.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const publish = () =>
      document.documentElement.style.setProperty("--header-h", `${Math.round(el.getBoundingClientRect().height)}px`);
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Section en cours : celle qui traverse le milieu de l'écran.
  useEffect(() => {
    if (!onHome) return;
    const targets = new Set(links.map((l) => l.target));
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const t = `#${e.target.id}`;
          setActive(targets.has(t) ? t : null);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [links, onHome]);

  // Menu ouvert : page figée, Échap pour fermer, tabulation contenue.
  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const first = panelRef.current?.querySelector<HTMLElement>("a");
    first?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const items = [
        toggleRef.current,
        ...Array.from(panelRef.current?.querySelectorAll<HTMLElement>("a") ?? []),
      ].filter(Boolean) as HTMLElement[];
      const i = items.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : i === items.length - 1 ? 0 : i + 1;
      e.preventDefault();
      items[next]?.focus();
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      lockScroll(false);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const showBar = Boolean(announcement?.enabled && announcement.text);

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
      {showBar && announcement && (
        <div className="bg-ink text-white">
          <p className="container-site flex min-h-[36px] flex-wrap items-center justify-center gap-x-3 py-1.5 text-center text-[13px]">
            <span>{announcement.text}</span>
            {announcement.linkLabel && announcement.linkTarget && (
              <a
                href={href(announcement.linkTarget)}
                onClick={(e) => go(e, announcement.linkTarget)}
                className="inline-flex min-h-[24px] items-center font-medium underline underline-offset-4 hover:no-underline"
              >
                {announcement.linkLabel}
              </a>
            )}
          </p>
        </div>
      )}

      <div
        className={`border-b bg-paper/[0.96] transition-colors duration-200 ${
          scrolled || open ? "border-rule" : "border-transparent"
        }`}
      >
        <div className="container-site flex h-16 items-center gap-2 sm:gap-4">
          <a
            href={onHome ? "#accueil" : "/"}
            onClick={(e) => go(e, "#accueil")}
            className="-ml-1 flex min-h-[44px] items-center gap-2.5 rounded px-1"
          >
            <CourtIcon />
            <span className="font-display text-[17px] font-medium tracking-[-0.01em]">{brand}</span>
          </a>

          <nav aria-label="Navigation principale" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-1">
              {links.map((l) => {
                const current = active === l.target;
                return (
                  <li key={l.target}>
                    <a
                      href={href(l.target)}
                      onClick={(e) => go(e, l.target)}
                      aria-current={current ? "true" : undefined}
                      className={`inline-flex min-h-[44px] items-center gap-2 rounded px-3 text-[14px] transition-colors duration-200 hover:text-ink ${
                        current ? "text-ink" : "text-muted"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`h-[7px] w-[7px] rounded-full bg-ball shadow-[inset_0_0_0_1px_rgba(13,27,42,0.3)] transition-[opacity,transform] duration-300 ${
                          current ? "scale-100 opacity-100" : "scale-50 opacity-0"
                        }`}
                      />
                      {l.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <a
            href={href("#reservation")}
            onClick={(e) => go(e, "#reservation")}
            className="btn-primary ml-auto hidden min-h-[40px] px-4 text-[13px] min-[380px]:inline-flex sm:min-h-[44px] sm:px-5 sm:text-[14px] lg:ml-3"
          >
            {ctaLabel}
          </a>

          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((o) => !o)}
            className="relative -mr-2 ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full min-[380px]:ml-0 lg:hidden"
          >
            <span
              aria-hidden="true"
              className={`absolute h-[1.5px] w-5 bg-ink transition-transform duration-200 ${
                open ? "rotate-45" : "-translate-y-[4px]"
              }`}
            />
            <span
              aria-hidden="true"
              className={`absolute h-[1.5px] w-5 bg-ink transition-transform duration-200 ${
                open ? "-rotate-45" : "translate-y-[4px]"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Menu téléphone et tablette : une feuille sous l'en-tête. */}
      <div
        ref={panelRef}
        id={panelId}
        inert={!open}
        // La visibilité bascule d'un coup à l'ouverture (le premier lien doit
        // pouvoir recevoir le focus aussitôt) et seulement après le fondu à la
        // fermeture.
        style={{ transition: open ? "opacity .2s, visibility 0s" : "opacity .2s, visibility 0s linear .2s" }}
        className={`fixed inset-x-0 bottom-0 top-[var(--header-h,64px)] overflow-y-auto bg-paper lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="Navigation principale" className="container-site pb-10 pt-4">
          <ul className="border-t border-rule">
            {links.map((l, i) => (
              <li key={l.target} className="border-b border-rule">
                <a
                  href={href(l.target)}
                  onClick={(e) => go(e, l.target)}
                  className="flex min-h-[60px] items-center gap-4"
                >
                  <span className="label w-6 text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-[22px] font-medium tracking-[-0.015em]">{l.label}</span>
                  <span aria-hidden="true" className="ml-auto text-muted">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={href("#reservation")}
            onClick={(e) => go(e, "#reservation")}
            className="btn-primary mt-8 w-full"
          >
            {ctaLabel}
          </a>
        </nav>
      </div>
    </header>
  );
}
