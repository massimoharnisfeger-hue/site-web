"use client";

import { useState } from "react";
import type { Court } from "@/lib/types";

/**
 * Plan du club vu de dessus : chaque court est un bouton, son nom s'affiche
 * sous le plan. Les positions viennent du back-office, en % d'un plan 2:1.
 */
export default function ClubPlan({ courts, title }: { courts: Court[]; title: string }) {
  const [selected, setSelected] = useState(0);
  if (courts.length === 0) return null;
  const current = courts[Math.min(selected, courts.length - 1)];

  return (
    <div>
      <p className="label text-white/60">{title}</p>
      <div className="relative mt-4 aspect-[2/1] w-full overflow-hidden rounded-lg border border-white/15 bg-white/[0.04]">
        {/* Allée centrale */}
        <span aria-hidden="true" className="absolute inset-x-[3%] top-1/2 h-px border-t border-dashed border-white/20" />
        {courts.map((c, i) => {
          const isSel = i === selected;
          return (
            <button
              key={i}
              type="button"
              aria-pressed={isSel}
              aria-label={c.name}
              onClick={() => setSelected(i)}
              onMouseEnter={() => setSelected(i)}
              onFocus={() => setSelected(i)}
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
              className={`absolute flex h-[19%] w-[19%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[3px] border transition-colors duration-200 ${
                isSel ? "border-white bg-turf" : "border-white/35 bg-white/[0.06] hover:border-white/70"
              }`}
            >
              {/* Lignes du court : filet et lignes de service. */}
              <span aria-hidden="true" className="absolute inset-y-[12%] left-1/2 w-px bg-white/60" />
              <span aria-hidden="true" className="absolute inset-y-[12%] left-[16%] w-px bg-white/30" />
              <span aria-hidden="true" className="absolute inset-y-[12%] right-[16%] w-px bg-white/30" />
              <span aria-hidden="true" className="absolute left-[16%] right-[16%] top-1/2 h-px bg-white/30" />
              {isSel && (
                <span
                  aria-hidden="true"
                  className="absolute h-[7px] w-[7px] rounded-full bg-ball shadow-[inset_0_0_0_1px_rgba(13,27,42,0.3)]"
                  style={{ left: "30%", top: "34%" }}
                />
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-3 flex items-center gap-2 text-[14px]" aria-live="polite">
        <span aria-hidden="true" className="label text-white/60">
          {String(selected + 1).padStart(2, "0")}
        </span>
        {current.name}
      </p>
    </div>
  );
}
