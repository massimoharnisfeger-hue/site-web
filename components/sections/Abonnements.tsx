"use client";

import { useId, useState } from "react";
import type { AbonnementsContent } from "@/lib/types";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/fx/Reveal";
import { scrollToTarget } from "@/lib/scroll";

/**
 * Abonnements (adapté de « Pricing with billing toggle », 21st.dev, @uiable).
 * Réécrit dans la direction Tableau tactique : bascule mensuel/annuel, carte
 * mise en avant, liste d'avantages. Les forfaits n'ont pas de paiement en
 * ligne : le bouton mène à la demande de réservation, comme le reste du site.
 */
export default function Abonnements({ content }: { content: AbonnementsContent }) {
  const items = content.items.filter((p) => p.name);
  const uid = useId();
  const [yearly, setYearly] = useState(false);
  if (items.length === 0) return null;

  const hasYearly = items.some((p) => p.priceYearly.trim());

  return (
    <section id="abonnements" aria-labelledby="abonnements-titre" className="section">
      <div className="container-site">
        <SectionHead
          id="abonnements-titre"
          eyebrow={content.eyebrow}
          title={content.title}
          intro={content.intro}
          aside={
            content.examples && content.examplesNote ? (
              <p className="inline-flex items-center gap-2 rounded-full border border-dashed border-ink/30 px-3.5 py-2 text-[13px] text-muted">
                <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full border border-ink/40" />
                {content.examplesNote}
              </p>
            ) : undefined
          }
        />

        {/* Bascule mensuel / annuel */}
        {hasYearly && (
          <Reveal className="mb-10 flex flex-col items-center gap-2">
            <div role="group" aria-label="Période de facturation" className="inline-flex rounded-full border border-rule bg-card p-1">
              {[
                { key: false, label: content.monthlyLabel || "Au mois" },
                { key: true, label: content.yearlyLabel || "À l'année" },
              ].map((opt) => (
                <button
                  key={String(opt.key)}
                  type="button"
                  aria-pressed={yearly === opt.key}
                  onClick={() => setYearly(opt.key)}
                  className={`min-h-[40px] rounded-full px-4 text-[14px] font-medium transition-colors duration-200 ${
                    yearly === opt.key ? "bg-turf text-white" : "text-muted hover:text-ink"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {yearly && content.yearlyNote && <p className="text-[13px] text-turf">{content.yearlyNote}</p>}
          </Reveal>
        )}

        <ul className="grid items-stretch gap-4 lg:grid-cols-3 lg:gap-5">
          {items.map((p, i) => {
            const price = yearly && p.priceYearly.trim() ? p.priceYearly : p.priceMonthly;
            return (
              <Reveal
                key={i}
                as="li"
                delay={(i % 3) * 0.06}
                className={`relative flex flex-col rounded-lg border bg-card p-6 lg:p-7 ${
                  p.featured ? "border-turf shadow-[0_1px_0_#1F55A8,inset_0_0_0_1px_#1F55A8]" : "border-rule"
                }`}
              >
                {p.featured && p.badge && (
                  <span className="absolute -top-3 left-6 inline-flex items-center gap-2 rounded-full bg-turf px-3 py-1 text-[12px] font-medium leading-none text-white">
                    <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full bg-ball" />
                    {p.badge}
                  </span>
                )}
                <h3 className="h3">{p.name}</h3>
                {p.tagline && <p className="mt-1 text-[14px] text-muted">{p.tagline}</p>}

                <p className="mt-5 flex items-baseline gap-1.5">
                  <span className="font-display text-[34px] font-medium tracking-[-0.03em] tabular-nums">{price}</span>
                  {p.priceNote && <span className="text-[14px] text-muted">{p.priceNote}</span>}
                </p>

                {p.features.length > 0 && (
                  <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                    {p.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-[15px]">
                        <svg
                          viewBox="0 0 20 20"
                          className="mt-[3px] h-4 w-4 shrink-0 text-turf"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M4 10.5l4 4 8-9" />
                        </svg>
                        <span className="text-ink/85">{f}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  type="button"
                  onClick={() => scrollToTarget("#reservation")}
                  aria-describedby={`${uid}-note`}
                  className={`mt-7 w-full justify-center ${p.featured ? "btn-primary" : "btn-quiet"}`}
                >
                  {p.ctaLabel || "Choisir"}
                </button>
              </Reveal>
            );
          })}
        </ul>

        <p id={`${uid}-note`} className="mt-6 text-center text-[13px] text-muted">
          Aucun paiement en ligne : votre demande part au club, qui vous recontacte pour finaliser l&apos;abonnement.
        </p>
      </div>
    </section>
  );
}
