"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import type { FooterContent } from "@/lib/types";

// SVG glyph per supported social network (looked up by name from the CMS).
const socialPaths: Record<string, string> = {
  Instagram:
    "M12 2.2c3.2 0 3.6 0 4.9.07 3.3.15 4.8 1.7 4.95 4.95.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.15 3.25-1.65 4.8-4.95 4.95-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-3.3-.15-4.8-1.7-4.95-4.95C2.08 15.6 2.07 15.2 2.07 12s0-3.6.07-4.9C2.29 3.85 3.79 2.3 7.1 2.15 8.4 2.09 8.8 2.08 12 2.08zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zM17.8 5.6a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z",
  TikTok:
    "M16.5 3c.3 2.1 1.5 3.6 3.5 3.9V10c-1.4.1-2.7-.3-3.9-1v5.6c0 4-3.4 6.7-7 5.7-2.8-.8-4-4-2.8-6.6.9-2 3.2-3.1 5.3-2.6v3.2c-.4-.1-.8-.2-1.2-.1-1 .1-1.7 1-1.6 2 .1 1 1 1.7 2 1.6 1-.1 1.7-1 1.7-2V3h3z",
  YouTube:
    "M23 12s0-3.2-.4-4.7c-.2-.9-.9-1.5-1.7-1.7C19.4 5.2 12 5.2 12 5.2s-7.4 0-8.9.4c-.8.2-1.5.8-1.7 1.7C1 8.8 1 12 1 12s0 3.2.4 4.7c.2.9.9 1.5 1.7 1.7 1.5.4 8.9.4 8.9.4s7.4 0 8.9-.4c.8-.2 1.5-.8 1.7-1.7.4-1.5.4-4.7.4-4.7zM9.8 15.2V8.8l5.4 3.2-5.4 3.2z",
};

export default function Footer({
  content,
  brand,
}: {
  content: FooterContent;
  brand: string;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <footer className="relative overflow-hidden bg-ink pt-28 text-white">
      {/* Animated energy background */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute inset-0 animate-gradient-pan bg-[length:200%_200%] bg-gradient-to-tr from-ink via-court to-teal opacity-40" />
        <svg
          viewBox="0 0 1440 320"
          className="absolute bottom-0 w-full opacity-25"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,160 C320,260 720,60 1440,160 L1440,320 L0,320 Z"
            initial={{ d: "M0,160 C320,260 720,60 1440,160 L1440,320 L0,320 Z" }}
            animate={{
              d: [
                "M0,160 C320,260 720,60 1440,160 L1440,320 L0,320 Z",
                "M0,180 C320,80 720,240 1440,140 L1440,320 L0,320 Z",
                "M0,160 C320,260 720,60 1440,160 L1440,320 L0,320 Z",
              ],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            fill="#CDFF3A"
            opacity="0.18"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        {/* CTA band */}
        <div className="mb-20 flex flex-col items-center gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md md:p-16">
          <h2 className="max-w-2xl font-display text-3xl font-semibold leading-tight text-white md:text-5xl">
            {content.ctaTitle}
          </h2>
          <MagneticButton href="#reservation">
            {content.ctaButton}
          </MagneticButton>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Club courts map */}
          <div>
            <h3 className="mb-5 font-display text-xl font-semibold text-white">
              {content.mapTitle}
            </h3>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-court/40 to-ink" />
              {/* stylized court lines */}
              <svg viewBox="0 0 100 75" className="absolute inset-0 h-full w-full opacity-40">
                <rect x="14" y="12" width="72" height="51" rx="2" fill="none" stroke="#CDFF3A" strokeWidth="0.5" />
                <line x1="50" y1="12" x2="50" y2="63" stroke="#CDFF3A" strokeWidth="0.5" />
                <line x1="14" y1="37.5" x2="86" y2="37.5" stroke="#CDFF3A" strokeWidth="0.3" />
                <line x1="30" y1="12" x2="30" y2="63" stroke="#CDFF3A" strokeWidth="0.3" />
                <line x1="70" y1="12" x2="70" y2="63" stroke="#CDFF3A" strokeWidth="0.3" />
              </svg>
              {content.courts.map((s) => (
                <button
                  key={s.name}
                  onMouseEnter={() => setHovered(s.name)}
                  onMouseLeave={() => setHovered(null)}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${s.x}%`, top: `${s.y}%` }}
                  aria-label={s.name}
                >
                  <span className="block h-3 w-3 rounded-full bg-lime shadow-[0_0_12px_rgba(205,255,58,0.9)]">
                    <span className="absolute inset-0 animate-ping rounded-full bg-lime/60" />
                  </span>
                  <span
                    className={`absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1 font-sans text-xs text-ink transition-opacity duration-300 ${
                      hovered === s.name ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {s.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Links + contact */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h4 className="mb-4 font-sans text-xs uppercase tracking-[0.2em] text-white/50">
                Le club
              </h4>
              <ul className="space-y-3 font-sans text-sm text-white/80">
                <li><a href="#offres" className="hover:text-lime">Offres</a></li>
                <li><a href="#parcours" className="hover:text-lime">Le parcours</a></li>
                <li><a href="#galerie" className="hover:text-lime">Galerie</a></li>
                <li><a href="#avis" className="hover:text-lime">Avis</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-sans text-xs uppercase tracking-[0.2em] text-white/50">
                Contact
              </h4>
              <ul className="space-y-3 font-sans text-sm text-white/80">
                <li>{content.email}</li>
                <li>{content.phone}</li>
                <li>{content.hours}</li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h4 className="mb-4 font-sans text-xs uppercase tracking-[0.2em] text-white/50">
                Suivez-nous
              </h4>
              <div className="flex gap-3">
                {content.socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    data-cursor="hover"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all duration-300 hover:scale-110 hover:bg-lime hover:text-ink"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d={socialPaths[s.name] || socialPaths.Instagram} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 md:flex-row">
          <div className="flex items-center gap-2 font-display text-lg font-semibold text-white">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-lime" />
            {brand}
          </div>
          <p className="font-sans text-xs text-white/50">
            © {new Date().getFullYear()} {brand}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
