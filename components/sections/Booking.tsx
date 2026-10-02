"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { Activity, ReservationContent } from "@/lib/types";
import { buildBookingMessage } from "@/lib/booking-message";
import Reveal from "@/components/fx/Reveal";
import { scrollToTarget } from "@/lib/scroll";

/**
 * Le tunnel a quatre écrans écrits en dur. Se borner sur `content.steps`
 * rendait l'écran final inatteignable dès que l'éditeur supprimait une étape
 * du back-office : le nombre d'écrans réels est la seule borne juste, les
 * libellés restent éditables.
 */
const LAST = 3;
const MAX_PLAYERS = 8;

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
const longDate = (d: Date) => d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

function Calendar({ selected, onSelect }: { selected: Date | null; onSelect: (d: Date) => void }) {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const atFirstMonth = cursor.getFullYear() === today.getFullYear() && cursor.getMonth() === today.getMonth();

  const cells = useMemo(() => {
    const y = cursor.getFullYear();
    const m = cursor.getMonth();
    const offset = (new Date(y, m, 1).getDay() + 6) % 7;
    const total = new Date(y, m + 1, 0).getDate();
    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from({ length: total }, (_, i) => new Date(y, m, i + 1)),
    ];
  }, [cursor]);

  const month = cursor.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const shift = (d: number) => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + d, 1));

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Mois précédent"
          disabled={atFirstMonth}
          onClick={() => shift(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-rule transition-colors hover:border-turf disabled:invisible"
        >
          <span aria-hidden="true">←</span>
        </button>
        <p className="text-[15px] font-medium capitalize" aria-live="polite">
          {month}
        </p>
        <button
          type="button"
          aria-label="Mois suivant"
          onClick={() => shift(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-rule transition-colors hover:border-turf"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center" aria-hidden="true">
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <span key={i} className="label text-muted">
            {d}
          </span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <span key={i} />;
          const past = d < today;
          const isSel = !!selected && sameDay(d, selected);
          const isToday = sameDay(d, today);
          return (
            <button
              key={i}
              type="button"
              disabled={past}
              aria-pressed={isSel}
              aria-label={longDate(d)}
              onClick={() => onSelect(d)}
              className={`relative flex h-10 items-center justify-center rounded-md text-[14px] tabular-nums transition-colors duration-150 ${
                past
                  ? "cursor-not-allowed text-ink/25"
                  : isSel
                    ? "bg-turf font-medium text-white"
                    : "hover:bg-turf/10"
              }`}
            >
              {d.getDate()}
              {isToday && !isSel && (
                <span aria-hidden="true" className="absolute bottom-1 h-1 w-1 rounded-full bg-turf" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-[14px] font-medium">
        {label}
      </label>
      {children}
      <p id={`${id}-err`} className="mt-1.5 min-h-[20px] text-[13px] text-danger" aria-live="polite">
        {error ?? ""}
      </p>
    </div>
  );
}

const inputClass =
  "mt-2 block min-h-[48px] w-full rounded-md border bg-card px-4 text-[16px] text-ink transition-colors placeholder:text-muted/70 focus:border-turf focus:outline-none focus:ring-2 focus:ring-turf/25";

export default function Booking({
  content,
  activities,
  clubEmail,
  clubPhone,
}: {
  content: ReservationContent;
  activities: Activity[];
  clubEmail: string;
  clubPhone: string;
}) {
  const uid = useId();
  const [step, setStep] = useState(0);
  const [activityIdx, setActivityIdx] = useState(() => Math.max(0, Math.min(2, activities.length - 1)));
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [players, setPlayers] = useState(4);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [touched, setTouched] = useState({ name: false, email: false, phone: false });
  const [slotError, setSlotError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [focusReq, setFocusReq] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const copyTimer = useRef<number | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const activity = activities[activityIdx];
  const labels = Array.from({ length: LAST + 1 }, (_, i) => content.steps[i] ?? "");

  // Validation permissive : un faux négatif coûte une demande perdue.
  const valid = {
    name: name.trim().length > 1,
    email: /.+@.+\..+/.test(email.trim()),
    phone: phone.replace(/[^0-9]/g, "").length >= 8,
  };
  const errors = {
    name: touched.name && !valid.name ? "Indiquez votre nom complet." : undefined,
    email: touched.email && !valid.email ? "Cette adresse e-mail semble incomplète." : undefined,
    phone: touched.phone && !valid.phone ? "Ce numéro semble trop court." : undefined,
  };

  /** Un créneau du jour même déjà écoulé ne peut pas être demandé. */
  const slotPassed = (time: string) => {
    if (!date) return false;
    const now = new Date();
    if (!sameDay(date, now)) return false;
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m <= now.getHours() * 60 + now.getMinutes();
  };

  const message = buildBookingMessage(
    {
      formule: activity?.name ?? "",
      date: date ? date.toLocaleDateString("fr-FR") : "",
      creneau: slot ?? "",
      joueurs: players,
      nom: name.trim(),
      email: email.trim(),
      telephone: phone.trim(),
    },
    clubEmail
  );

  const goTo = (s: number) => {
    setStep(s);
    setFocusReq((n) => n + 1);
  };

  const next = () => {
    if (step === 1 && (!date || !slot)) {
      setSlotError(true);
      return;
    }
    if (step === 2 && !(valid.name && valid.email && valid.phone)) {
      setTouched({ name: true, email: true, phone: true });
      const first = !valid.name ? nameRef : !valid.email ? emailRef : phoneRef;
      first.current?.focus();
      return;
    }
    goTo(Math.min(LAST, step + 1));
  };

  // Une fiche de la section Offres a été choisie : le tunnel s'ouvre dessus.
  useEffect(() => {
    const onSelect = (e: Event) => {
      const i = (e as CustomEvent<number>).detail;
      if (typeof i !== "number" || i < 0 || i >= activities.length) return;
      setActivityIdx(i);
      setStep(0);
      setFocusReq((n) => n + 1);
    };
    window.addEventListener("padel:select-offer", onSelect);
    return () => window.removeEventListener("padel:select-offer", onSelect);
  }, [activities.length]);

  // Changement d'étape : le titre de l'étape reçoit le focus (il est annoncé),
  // et la carte remonte à l'écran si son haut est passé sous l'en-tête.
  useEffect(() => {
    if (focusReq === 0) return;
    headingRef.current?.focus({ preventScroll: true });
    const card = cardRef.current;
    if (card && card.getBoundingClientRect().top < 72) scrollToTarget(card);
  }, [focusReq]);

  // Un créneau devenu invalide après changement de date ne reste pas choisi.
  useEffect(() => {
    if (slot && slotPassed(slot)) setSlot(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  useEffect(
    () => () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    },
    []
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.corps);
      setCopied(true);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Presse-papiers indisponible : le texte reste sélectionnable à l'écran.
    }
  };

  const tel = clubPhone.replace(/[^\d+]/g, "");
  const summary: [string, string][] = [
    ["Formule", activity?.name ?? "—"],
    ["Date", date ? longDate(date) : "—"],
    ["Créneau", slot ?? "—"],
    ["Joueurs", String(players)],
  ];

  if (activities.length === 0) return null;

  return (
    <section id="reservation" aria-labelledby="reservation-titre" className="section">
      <div className="container-site lg:grid lg:grid-cols-12 lg:gap-14">
        <div className="mb-10 lg:col-span-5 lg:mb-0">
          <Reveal className="lg:sticky lg:top-[calc(var(--header-h,64px)_+_40px)]">
            <p className="label text-turf">{content.eyebrow}</p>
            <h2 id="reservation-titre" className="h2 mt-3">
              {content.title}
            </h2>
            {content.intro && <p className="mt-4 max-w-[28rem] text-[16px] text-muted">{content.intro}</p>}

            {/* Récapitulatif en direct, grand écran. */}
            <div className="mt-10 hidden rounded-lg border border-rule bg-card lg:block">
              <p className="label border-b border-dashed border-rule px-5 py-3 text-muted">Votre demande</p>
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 px-5 py-4 text-[14px]">
                {summary.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-muted">{k}</dt>
                    <dd className="text-right font-medium first-letter:uppercase">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="mt-4 hidden text-[13px] text-muted lg:block">{content.paymentNote}</p>
          </Reveal>
        </div>

        <div ref={cardRef} className="rounded-lg border border-rule bg-card lg:col-span-7">
          {/* Progression */}
          <div className="border-b border-rule px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-baseline justify-between gap-4">
              <p className="label text-muted">
                Étape {step + 1} / {LAST + 1}
              </p>
              <ol className="hidden gap-5 sm:flex">
                {labels.map((l, i) => (
                  <li
                    key={i}
                    aria-current={i === step ? "step" : undefined}
                    className={`label flex items-center gap-1.5 ${i === step ? "text-ink" : i < step ? "text-turf" : "text-muted"}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-[7px] w-[7px] rounded-full ${
                        i === step ? "bg-ball shadow-[inset_0_0_0_1px_rgba(13,27,42,0.3)]" : i < step ? "bg-turf" : "border border-ink/25"
                      }`}
                    />
                    {l}
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-rule">
              <div
                className="h-full rounded-full bg-turf transition-[width] duration-500 ease-out"
                style={{ width: `${((step + 1) / (LAST + 1)) * 100}%` }}
              />
            </div>
          </div>

          <div key={step} className="step-in px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {step === 0 && (
              <div>
                <h3 id={`${uid}-etape0`} ref={headingRef} tabIndex={-1} className="h3">
                  {labels[0]}
                </h3>
                <fieldset aria-labelledby={`${uid}-etape0`} className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {activities.map((a, i) => {
                    const sel = i === activityIdx;
                    return (
                      <label
                        key={i}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors duration-150 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-turf ${
                          sel ? "border-turf bg-turf/[0.04] shadow-[inset_0_0_0_1px_#1F55A8]" : "border-rule hover:border-turf/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`${uid}-formule`}
                          checked={sel}
                          onChange={() => setActivityIdx(i)}
                          className="sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={`mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            sel ? "border-turf" : "border-ink/30"
                          }`}
                        >
                          {sel && <span className="h-2 w-2 rounded-full bg-turf" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[15px] font-medium leading-snug">{a.name}</span>
                          <span className="mt-0.5 block text-[13px] text-muted">
                            {[a.duration, a.level].filter(Boolean).join(" · ")}
                          </span>
                          <span className="mt-2 block text-[14px] font-medium text-turf">{a.price}</span>
                        </span>
                      </label>
                    );
                  })}
                </fieldset>
              </div>
            )}

            {step === 1 && (
              <div>
                <h3 ref={headingRef} tabIndex={-1} className="h3">
                  {labels[1]}
                </h3>
                <div className="mt-5 grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
                  <Calendar
                    selected={date}
                    onSelect={(d) => {
                      setDate(d);
                      setSlotError(false);
                    }}
                  />
                  <div className="flex flex-col gap-7">
                    <fieldset>
                      <legend className="text-[14px] font-medium">Heure de début</legend>
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {content.slots.map((s) => {
                          const passed = slotPassed(s);
                          const sel = slot === s;
                          return (
                            <label
                              key={s}
                              className={`flex min-h-[44px] items-center justify-center rounded-md border text-[14px] tabular-nums transition-colors duration-150 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-turf ${
                                passed
                                  ? "cursor-not-allowed border-rule text-ink/25 line-through"
                                  : sel
                                    ? "cursor-pointer border-turf bg-turf font-medium text-white"
                                    : "cursor-pointer border-rule hover:border-turf/50"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`${uid}-creneau`}
                                value={s}
                                checked={sel}
                                disabled={passed}
                                onChange={() => {
                                  setSlot(s);
                                  setSlotError(false);
                                }}
                                className="sr-only"
                              />
                              {s}
                            </label>
                          );
                        })}
                      </div>
                      <p className="mt-2 min-h-[20px] text-[13px] text-danger" aria-live="polite">
                        {slotError ? (date ? "Choisissez une heure." : "Choisissez une date et une heure.") : ""}
                      </p>
                    </fieldset>
                    <div>
                      <p id={`${uid}-joueurs`} className="text-[14px] font-medium">
                        Joueurs
                      </p>
                      <div className="mt-3 flex items-center gap-3" role="group" aria-labelledby={`${uid}-joueurs`}>
                        <button
                          type="button"
                          aria-label="Retirer un joueur"
                          disabled={players <= 1}
                          onClick={() => setPlayers((p) => Math.max(1, p - 1))}
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-rule text-[18px] transition-colors hover:border-turf disabled:opacity-40"
                        >
                          <span aria-hidden="true">−</span>
                        </button>
                        <output aria-live="polite" className="w-10 text-center font-display text-[28px] font-medium tabular-nums">
                          {players}
                        </output>
                        <button
                          type="button"
                          aria-label="Ajouter un joueur"
                          disabled={players >= MAX_PLAYERS}
                          onClick={() => setPlayers((p) => Math.min(MAX_PLAYERS, p + 1))}
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-rule text-[18px] transition-colors hover:border-turf disabled:opacity-40"
                        >
                          <span aria-hidden="true">+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 ref={headingRef} tabIndex={-1} className="h3">
                  {labels[2]}
                </h3>
                <div className="mt-5 grid gap-2">
                  <Field id={`${uid}-nom`} label="Nom complet" error={errors.name}>
                    <input
                      ref={nameRef}
                      id={`${uid}-nom`}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                      maxLength={120}
                      autoComplete="name"
                      aria-invalid={!!errors.name}
                      aria-describedby={`${uid}-nom-err`}
                      className={`${inputClass} ${errors.name ? "border-danger" : "border-rule"}`}
                    />
                  </Field>
                  <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                    <Field id={`${uid}-email`} label="E-mail" error={errors.email}>
                      <input
                        ref={emailRef}
                        id={`${uid}-email`}
                        type="email"
                        inputMode="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                        maxLength={160}
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        aria-describedby={`${uid}-email-err`}
                        className={`${inputClass} ${errors.email ? "border-danger" : "border-rule"}`}
                      />
                    </Field>
                    <Field id={`${uid}-tel`} label="Téléphone" error={errors.phone}>
                      <input
                        ref={phoneRef}
                        id={`${uid}-tel`}
                        type="tel"
                        inputMode="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                        maxLength={30}
                        autoComplete="tel"
                        aria-invalid={!!errors.phone}
                        aria-describedby={`${uid}-tel-err`}
                        className={`${inputClass} ${errors.phone ? "border-danger" : "border-rule"}`}
                      />
                    </Field>
                  </div>
                  <p className="rounded-md bg-paper px-4 py-3 text-[13px] leading-[1.5] text-muted">{content.privacyNote}</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 ref={headingRef} tabIndex={-1} className="h3">
                  {content.finalTitle}
                </h3>
                <p className="mt-3 max-w-[34rem] text-[15px] leading-[1.6] text-muted">
                  {content.finalBody.split("{delai}").join(content.responseDelay)}
                </p>

                {/* Le ticket : rappel de la demande. */}
                <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 rounded-lg border border-dashed border-ink/25 bg-paper px-5 py-4 text-[14px]">
                  {summary.map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="text-muted">{k}</dt>
                      <dd className="text-right font-medium first-letter:uppercase">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6">
                  <div className="flex items-center justify-between gap-4">
                    <p id={`${uid}-message`} className="text-[14px] font-medium">
                      Le message à envoyer
                    </p>
                    <button type="button" onClick={copy} className="btn-quiet min-h-[40px] px-4 text-[13px]">
                      {copied ? "Copié" : "Copier le texte"}
                    </button>
                  </div>
                  {/* Zone défilante : atteignable au clavier pour pouvoir la lire.
                      `data-lenis-prevent` rend la molette à ce bloc plutôt qu'au
                      défilement fluide de la page. */}
                  <pre
                    tabIndex={0}
                    data-lenis-prevent
                    aria-labelledby={`${uid}-message`}
                    className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-md border border-rule bg-paper px-4 py-3 font-mono text-[13px] leading-[1.6] text-ink"
                  >
                    {message.corps}
                  </pre>
                  <p aria-live="polite" className="sr-only">
                    {copied ? "Message copié dans le presse-papiers." : ""}
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  {message.mailtoUrl && (
                    <a href={message.mailtoUrl} className="btn-primary min-h-[48px] flex-1">
                      Ouvrir ma messagerie
                    </a>
                  )}
                  {tel && (
                    <a href={`tel:${tel}`} className="btn-quiet min-h-[48px] flex-1">
                      Appeler le club
                    </a>
                  )}
                </div>

                <p className="mt-5 text-[13px] leading-[1.6] text-muted">
                  {clubEmail && (
                    <>
                      Si votre messagerie ne s&apos;ouvre pas, copiez le texte et envoyez-le à{" "}
                      <a href={`mailto:${clubEmail}`} className="font-medium text-turf underline underline-offset-2">
                        {clubEmail}
                      </a>
                      {tel && (
                        <>
                          {" "}
                          ou appelez le{" "}
                          <a href={`tel:${tel}`} className="font-medium text-turf underline underline-offset-2">
                            {clubPhone}
                          </a>
                        </>
                      )}
                      .{" "}
                    </>
                  )}
                  {content.paymentNote}
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4 border-t border-rule px-4 py-4 sm:px-6 lg:px-8">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => goTo(step === LAST ? 2 : step - 1)}
                className="inline-flex min-h-[44px] items-center gap-1.5 text-[14px] text-muted transition-colors hover:text-ink"
              >
                <span aria-hidden="true">←</span> {step === LAST ? "Modifier" : "Retour"}
              </button>
            ) : (
              <span />
            )}
            {step < LAST && (
              <button type="button" onClick={next} className="btn-primary min-h-[48px] px-6">
                {step === 2 ? content.ctaLabel : "Continuer"}
                <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
