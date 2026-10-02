import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { MiniCourt } from "../court/MiniCourt";
import { AnchorLink } from "../ui/AnchorLink";
import { IconClose, IconMenu } from "../ui/Icons";
import { useActiveSection } from "../../hooks/useActiveSection";
import { fr } from "../../lib/typo";
import { scrollToTop } from "../../lib/scroll";
import type { Site } from "../../types";

type Props = {
  clubName: string;
  nav: Site["nav"];
  navLabel: string;
  cta: string;
  ctaShort: string;
  menuLabel: string;
  closeLabel: string;
  announcement: Site["announcement"];
};

export function Header({ clubName, nav, navLabel, cta, ctaShort, menuLabel, closeLabel, announcement }: Props) {
  const { pathname } = useLocation();
  const onHome = pathname === "/";
  const sectionIds = onHome ? nav.map((item) => item.target.replace(/^#/, "")) : [];
  const active = useActiveSection(sectionIds);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Échap ferme le menu et rend le focus au bouton.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const onLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (onHome) {
      event.preventDefault();
      scrollToTop();
    }
  };

  return (
    <header className="sticky top-0 z-40">
      {announcement.enabled ? (
        <div className="bg-turf text-white">
          <div className="container-site flex h-10 items-center justify-center gap-3 text-[13px]">
            <span className="truncate">{fr(announcement.text)}</span>
            <AnchorLink target={announcement.linkTarget} className="shrink-0 font-medium underline underline-offset-2">
              {fr(announcement.linkLabel)}
            </AnchorLink>
          </div>
        </div>
      ) : null}

      <div className="relative border-b border-rule bg-paper/88 backdrop-blur-[12px]">
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <Link to="/" onClick={onLogoClick} className="flex min-h-11 items-center gap-3 text-ink">
            <MiniCourt className="text-turf" />
            <span className="font-display text-[18px] font-medium leading-none">{clubName}</span>
          </Link>

          <nav aria-label={navLabel} className="hidden items-center gap-7 lg:flex">
            {nav.map((item) => {
              const isActive = active === item.target.replace(/^#/, "");
              return (
                <AnchorLink
                  key={item.target}
                  target={item.target}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative flex h-16 min-w-11 items-center justify-center text-sm transition-colors duration-200 hover:text-ink ${
                    isActive ? "text-ink" : "text-muted"
                  }`}
                >
                  {fr(item.label)}
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-[17px] left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-ball transition-opacity duration-200 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </AnchorLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <AnchorLink target="#reservation" className="btn btn-primary">
              <span className="hidden lg:inline">{fr(cta)}</span>
              <span className="lg:hidden">{fr(ctaShort)}</span>
            </AnchorLink>
            <button
              ref={menuButtonRef}
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-rule text-ink transition-colors hover:border-turf lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? closeLabel : menuLabel}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>

        {/* Panneau mobile : inert quand il est fermé */}
        <div
          id="menu-mobile"
          inert={!open}
          className={`absolute inset-x-0 top-full border-b border-rule bg-card transition-opacity duration-200 lg:hidden ${
            open ? "visible opacity-100" : "invisible opacity-0"
          }`}
        >
          <ul className="container-site py-2">
            {nav.map((item) => (
              <li key={item.target} className="border-b border-rule last:border-b-0">
                <AnchorLink
                  target={item.target}
                  onNavigate={() => setOpen(false)}
                  className="flex min-h-14 items-center text-[18px] font-medium text-ink"
                >
                  {fr(item.label)}
                </AnchorLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
