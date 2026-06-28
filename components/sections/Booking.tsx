"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Activity, ReservationContent } from "@/lib/types";

const steps = ["Formule", "Créneau", "Coordonnées", "Confirmation"];
const timeSlots = [
  "09:00",
  "10:30",
  "12:00",
  "14:00",
  "17:30",
  "19:00",
  "20:30",
  "22:00",
];

function MiniCalendar({
  selected,
  onSelect,
}: {
  selected: Date | null;
  onSelect: (d: Date) => void;
}) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const { days, label } = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const startDay = (first.getDay() + 6) % 7;
    const total = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(new Date(year, month, d));
    return {
      days: cells,
      label: cursor.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      }),
    };
  }, [cursor]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="rounded-2xl border border-ink/10 bg-cloud p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          aria-label="Mois précédent"
          onClick={() =>
            setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
          }
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink hover:bg-ink/5"
        >
          ‹
        </button>
        <span className="font-sans text-sm font-medium capitalize text-ink">
          {label}
        </span>
        <button
          type="button"
          aria-label="Mois suivant"
          onClick={() =>
            setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
          }
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink hover:bg-ink/5"
        >
          ›
        </button>
      </div>
      <div className="mb-2 grid grid-cols-7 gap-1 text-center font-sans text-[10px] uppercase text-ink/40">
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          if (!d) return <span key={i} />;
          const past = d < today;
          const isSel =
            selected && d.toDateString() === selected.toDateString();
          return (
            <button
              key={i}
              type="button"
              disabled={past}
              onClick={() => onSelect(d)}
              className={`aspect-square rounded-lg font-sans text-sm transition-all duration-200 ${
                past
                  ? "cursor-not-allowed text-ink/25"
                  : isSel
                    ? "bg-court font-semibold text-white"
                    : "text-ink/80 hover:bg-court/10"
              }`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Booking({
  content,
  activities,
}: {
  content: ReservationContent;
  activities: Activity[];
}) {
  const [step, setStep] = useState(0);
  const [activityIdx, setActivityIdx] = useState(
    Math.min(2, activities.length - 1)
  );
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [players, setPlayers] = useState(4);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [processing, setProcessing] = useState(false);

  const activity = activities[activityIdx];

  const canNext =
    step === 0 ||
    (step === 1 && !!date && !!slot) ||
    (step === 2 && /.+@.+\..+/.test(email) && name.trim().length > 1);

  const next = () => {
    if (step === 2) {
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        setStep(3);
      }, 1600);
      return;
    }
    setStep((s) => Math.min(steps.length - 1, s + 1));
  };

  return (
    <section
      id="reservation"
      className="relative overflow-hidden bg-cloud py-28 md:py-36"
    >
      <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-court/15 blur-[130px]" />
      <div className="pointer-events-none absolute -left-32 bottom-10 h-96 w-96 rounded-full bg-lime/20 blur-[130px]" />
      <div className="relative mx-auto max-w-4xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <span className="font-sans text-xs uppercase tracking-[0.35em] text-court">
            {content.eyebrow}
          </span>
          <h2 className="mt-4 font-display text-4xl font-semibold text-ink md:text-6xl">
            {content.title}
          </h2>
        </motion.div>

        {/* Step indicator */}
        <div className="mb-10 flex items-center justify-center gap-2 md:gap-4">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2 md:gap-4">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full font-sans text-sm font-semibold transition-all duration-500 ${
                    i <= step
                      ? "bg-court text-white"
                      : "border border-ink/15 text-ink/40"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <span className="hidden font-sans text-[11px] text-ink/55 sm:block">
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="h-px w-6 bg-ink/15 md:w-16">
                  <div
                    className="h-full bg-court transition-all duration-500"
                    style={{ width: i < step ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-[0_30px_80px_-40px_rgba(11,27,58,0.4)] md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {activities.map((a, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActivityIdx(i)}
                      className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all duration-300 ${
                        activityIdx === i
                          ? "border-court bg-court/5"
                          : "border-ink/10 hover:border-court/40"
                      }`}
                    >
                      <div>
                        <div className="font-sans font-medium text-ink">
                          {a.name}
                        </div>
                        <div className="font-sans text-xs text-ink/55">
                          {a.duration} · {a.level}
                        </div>
                      </div>
                      <span className="font-display text-court">{a.price}</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 1 && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <MiniCalendar selected={date} onSelect={setDate} />
                  <div className="flex flex-col gap-6">
                    <div>
                      <label className="font-sans text-sm text-ink/65">
                        Créneau
                      </label>
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {timeSlots.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSlot(s)}
                            className={`rounded-xl border py-2 font-sans text-sm transition-all duration-200 ${
                              slot === s
                                ? "border-court bg-court text-white"
                                : "border-ink/10 text-ink/80 hover:border-court/40"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="font-sans text-sm text-ink/65">
                        Joueurs
                      </label>
                      <div className="mt-3 flex items-center gap-4">
                        <button
                          type="button"
                          aria-label="Retirer un joueur"
                          onClick={() => setPlayers((p) => Math.max(1, p - 1))}
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-xl text-ink hover:bg-ink/5"
                        >
                          −
                        </button>
                        <span className="w-12 text-center font-display text-3xl font-semibold tabular-nums text-ink">
                          {players}
                        </span>
                        <button
                          type="button"
                          aria-label="Ajouter un joueur"
                          onClick={() => setPlayers((p) => Math.min(8, p + 1))}
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-xl text-ink hover:bg-ink/5"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="font-sans text-sm text-ink/65">
                      Nom complet
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      placeholder="Camille Rivière"
                      className="mt-2 w-full rounded-xl border border-ink/15 bg-cloud px-4 py-3 font-sans text-ink placeholder:text-ink/35 focus:border-court focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-sm text-ink/65">
                      E-mail
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      autoComplete="email"
                      placeholder="camille@email.com"
                      className="mt-2 w-full rounded-xl border border-ink/15 bg-cloud px-4 py-3 font-sans text-ink placeholder:text-ink/35 focus:border-court focus:outline-none"
                    />
                  </div>
                  <div className="rounded-xl border border-ink/10 bg-cloud px-4 py-3 font-sans text-xs text-ink/50">
                    Paiement sécurisé simulé pour la démo — branchez Stripe
                    Checkout ici pour encaisser réellement.
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col items-center py-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-court text-white"
                  >
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                  <h3 className="mt-6 font-display text-2xl font-semibold text-ink">
                    Terrain réservé&nbsp;!
                  </h3>
                  <p className="mt-3 max-w-md font-sans text-ink/65">
                    {name}, votre {activity.name.toLowerCase()} pour {players}{" "}
                    joueur{players > 1 ? "s" : ""}
                    {date
                      ? ` le ${date.toLocaleDateString("fr-FR")}`
                      : ""}
                    {slot ? ` à ${slot}` : ""} est confirmé. Un récapitulatif part
                    vers {email}. À très vite sur le court&nbsp;🎾
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step < 3 && (
            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="font-sans text-sm text-ink/50 transition-colors hover:text-ink disabled:opacity-0"
              >
                ← Retour
              </button>
              <button
                type="button"
                onClick={next}
                disabled={!canNext || processing}
                className="inline-flex items-center gap-2 rounded-full bg-court px-7 py-3 font-sans text-sm font-medium text-white transition-all duration-300 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {processing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Paiement…
                  </>
                ) : step === 2 ? (
                  "Confirmer & payer"
                ) : (
                  "Continuer"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
