"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Activity, ReservationContent } from "@/lib/types";
import { buildBookingMessage } from "@/lib/booking-message";

// Le tunnel a quatre écrans écrits en dur. Se borner sur `content.steps` rendait
// l'écran final inatteignable dès que l'éditeur supprimait une étape du
// back-office, et produisait une carte vide sans navigation s'il en ajoutait
// une. Le nombre d'écrans réels est la seule borne juste ; les libellés
// restent, eux, entièrement éditables.
const DERNIER_ECRAN = 3;

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
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-ink/5"
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
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-ink/5"
        >
          ›
        </button>
      </div>
      <div className="mb-2 grid grid-cols-7 gap-1 text-center font-sans text-[10px] uppercase text-ink/65">
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
              className={`min-h-[44px] w-full rounded-lg font-sans text-sm transition-all duration-200 ${
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
  clubEmail,
  clubPhone,
}: {
  content: ReservationContent;
  activities: Activity[];
  clubEmail: string;
  clubPhone: string;
}) {
  const [step, setStep] = useState(0);
  const [activityIdx, setActivityIdx] = useState(
    Math.min(2, activities.length - 1)
  );
  // Une carte de la section Offres a été cliquée : on ouvre le tunnel dessus.
  useEffect(() => {
    const onSelect = (e: Event) => {
      const i = (e as CustomEvent<number>).detail;
      if (typeof i === "number" && i >= 0 && i < activities.length) {
        setActivityIdx(i);
        setStep(0);
      }
    };
    window.addEventListener("padel:select-offer", onSelect);
    return () => window.removeEventListener("padel:select-offer", onSelect);
  }, [activities.length]);

  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [players, setPlayers] = useState(4);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [copie, setCopie] = useState(false);

  const activity = activities[activityIdx];

  // Validation permissive (décision D5) : un faux négatif coûte une demande
  // perdue, un faux positif un rappel qui échoue alors que le club a deux
  // moyens de contact.
  const emailValide = /.+@.+\..+/.test(email.trim());
  const telValide = phone.replace(/[^0-9]/g, "").length >= 8;
  const nomValide = name.trim().length > 1;

  const erreurs = [
    name.length > 0 && !nomValide && "Indiquez votre nom complet.",
    email.length > 0 && !emailValide && "Cette adresse e-mail semble incomplète.",
    phone.length > 0 && !telValide && "Ce numéro semble trop court.",
  ].filter((e): e is string => typeof e === "string");

  const canNext =
    step === 0 ||
    (step === 1 && !!date && !!slot) ||
    (step === 2 && emailValide && telValide && nomValide);

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

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(message.corps);
      setCopie(true);
      window.setTimeout(() => setCopie(false), 2500);
    } catch {
      // Presse-papiers indisponible : le texte reste sélectionnable à l'écran.
    }
  };

  /**
   * Un créneau du jour même déjà écoulé ne peut pas être demandé (FR-008).
   * La comparaison se fait sur l'heure locale du visiteur, ce qui est le
   * comportement attendu pour un club de quartier.
   */
  const creneauPasse = (heure: string) => {
    if (!date) return false;
    const auj = new Date();
    if (date.toDateString() !== auj.toDateString()) return false;
    const [h, m] = heure.split(":").map(Number);
    return h * 60 + m <= auj.getHours() * 60 + auj.getMinutes();
  };

  const titreFinalRef = useRef<HTMLHeadingElement>(null);

  // Le bouton « Préparer ma demande » est démonté au passage à l'écran final :
  // sans cela le focus retombait sur `document.body`, rien n'était annoncé, et
  // la tabulation suivante repartait du haut du document.
  useEffect(() => {
    if (step === DERNIER_ECRAN) titreFinalRef.current?.focus();
  }, [step]);

  // Un créneau devenu invalide après changement de date ne doit pas rester choisi.
  useEffect(() => {
    if (slot && creneauPasse(slot)) setSlot(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const next = () => setStep((s) => Math.min(DERNIER_ECRAN, s + 1));

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
          {content.steps.map((label, i) => (
            <div key={i} className="flex items-center gap-2 md:gap-4">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full font-sans text-sm font-semibold transition-all duration-500 ${
                    i <= step
                      ? "bg-court text-white"
                      : "border border-ink/15 text-ink/65"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <span className="hidden font-sans text-[11px] text-ink/65 sm:block">
                  {label}
                </span>
              </div>
              {i < content.steps.length - 1 && (
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
                        <div className="font-sans text-xs text-ink/65">
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
                        {timeSlots.map((s) => {
                          const passe = creneauPasse(s);
                          return (
                            <button
                              key={s}
                              type="button"
                              disabled={passe}
                              onClick={() => setSlot(s)}
                              className={`min-h-[44px] rounded-xl border font-sans text-sm transition-all duration-200 ${
                                passe
                                  ? "cursor-not-allowed border-ink/5 text-ink/25"
                                  : slot === s
                                    ? "border-court bg-court text-white"
                                    : "border-ink/10 text-ink/80 hover:border-court/40"
                              }`}
                            >
                              {s}
                            </button>
                          );
                        })}
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
                    <label className="font-sans text-sm text-ink/65" htmlFor="nom-demande">
                      Nom complet
                    </label>
                    <input
                      id="nom-demande"
                      aria-invalid={name.length > 0 && !nomValide}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={120}
                      autoComplete="name"
                      placeholder="Camille Rivière"
                      className="mt-2 min-h-[48px] w-full rounded-xl border border-ink/15 bg-cloud px-4 py-3 font-sans text-ink placeholder:text-ink/65 focus:border-court focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-sm text-ink/65" htmlFor="email-demande">
                      E-mail
                    </label>
                    <input
                      id="email-demande"
                      aria-invalid={email.length > 0 && !emailValide}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength={160}
                      type="email"
                      autoComplete="email"
                      placeholder="camille@email.com"
                      className="mt-2 min-h-[48px] w-full rounded-xl border border-ink/15 bg-cloud px-4 py-3 font-sans text-ink placeholder:text-ink/65 focus:border-court focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-sm text-ink/65" htmlFor="tel-demande">
                      Téléphone
                    </label>
                    <input
                      id="tel-demande"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={30}
                      type="tel"
                      autoComplete="tel"
                      placeholder="06 12 34 56 78"
                      aria-invalid={phone.length > 0 && !telValide}
                      className="mt-2 min-h-[48px] w-full rounded-xl border border-ink/15 bg-cloud px-4 py-3 font-sans text-ink placeholder:text-ink/65 focus:border-court focus:outline-none focus:ring-2 focus:ring-court/40"
                    />
                  </div>

                  {/* Rendus côte à côte, les trois messages se collaient : le
                      lecteur d'écran annonçait « …nom complet.Cette adresse… ».
                      Une liste les sépare à l'œil comme à l'oreille. */}
                  <div aria-live="polite" className="min-h-[1.25rem]">
                    {erreurs.length > 0 && (
                      <ul className="space-y-1 font-sans text-sm text-[#c0303a]">
                        {erreurs.map((e) => (
                          <li key={e}>{e}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <p className="rounded-xl border border-ink/10 bg-cloud px-4 py-3 font-sans text-xs text-ink/65">
                    {content.privacyNote}
                  </p>
                </div>
              )}

              {step === 3 && (
                <div className="py-2">
                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-court text-white"
                      aria-hidden
                    >
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M3 7h18v10H3z" />
                      </svg>
                    </motion.div>

                    <h3
                      ref={titreFinalRef}
                      tabIndex={-1}
                      className="mt-5 font-display text-2xl font-semibold text-ink outline-none"
                    >
                      {content.finalTitle}
                    </h3>
                    <p className="mt-3 max-w-md font-sans text-ink/65">
                      {content.finalBody.replace("{delai}", content.responseDelay)}
                    </p>
                  </div>

                  {/* Rappel de ce que le visiteur a saisi (FR-004) */}
                  <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-3 rounded-2xl border border-ink/10 bg-cloud px-5 py-4 font-sans text-sm">
                    <dt className="text-ink/65">Formule</dt>
                    <dd className="text-right font-medium text-ink">{activity.name}</dd>
                    <dt className="text-ink/65">Date</dt>
                    <dd className="text-right font-medium text-ink">
                      {date ? date.toLocaleDateString("fr-FR") : "—"}
                    </dd>
                    <dt className="text-ink/65">Créneau</dt>
                    <dd className="text-right font-medium text-ink">{slot ?? "—"}</dd>
                    <dt className="text-ink/65">Joueurs</dt>
                    <dd className="text-right font-medium text-ink">{players}</dd>
                  </dl>

                  {/* Le texte est le chemin nominal, pas un repli (décision D1) */}
                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <span className="font-sans text-sm font-medium text-ink">
                        Le message à envoyer
                      </span>
                      <button
                        type="button"
                        onClick={copier}
                        data-cursor="hover"
                        className="min-h-[44px] rounded-full border border-ink/15 px-4 font-sans text-xs font-medium text-ink transition-colors hover:border-court hover:text-court focus-visible:ring-2 focus-visible:ring-court focus-visible:outline-none"
                      >
                        {copie ? "Copié" : "Copier le texte"}
                      </button>
                    </div>
                    <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-2xl border border-ink/10 bg-cloud px-5 py-4 font-sans text-sm leading-relaxed text-ink/80 selection:bg-court/20">
{message.corps}
                    </pre>
                    <p aria-live="polite" className="sr-only">
                      {copie ? "Message copié dans le presse-papiers." : ""}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    {message.mailtoUrl && (
                      <a
                        href={message.mailtoUrl}
                        data-cursor="hover"
                        className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-court px-6 font-sans text-sm font-medium text-white transition-transform duration-300 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-court focus-visible:ring-offset-2 focus-visible:outline-none"
                      >
                        Ouvrir ma messagerie
                      </a>
                    )}
                    {clubPhone && (
                      <a
                        href={`tel:${clubPhone.replace(/\s/g, "")}`}
                        data-cursor="hover"
                        className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full border border-court px-6 font-sans text-sm font-medium text-court transition-colors hover:bg-court/5 focus-visible:ring-2 focus-visible:ring-court focus-visible:ring-offset-2 focus-visible:outline-none"
                      >
                        Appeler le club
                      </a>
                    )}
                  </div>

                  {/* Sans messagerie configurée, tout reste accessible ici (FR-009b) */}
                  <p className="mt-5 font-sans text-xs leading-relaxed text-ink/65">
                    Si votre messagerie ne s&apos;ouvre pas, copiez le texte ci-dessus
                    et envoyez-le à{" "}
                    <a href={`mailto:${clubEmail}`} className="font-medium text-court underline underline-offset-2">
                      {clubEmail}
                    </a>
                    {clubPhone && (
                      <>
                        {" "}ou appelez le{" "}
                        <a href={`tel:${clubPhone.replace(/\s/g, "")}`} className="font-medium text-court underline underline-offset-2">
                          {clubPhone}
                        </a>
                      </>
                    )}
                    . {content.paymentNote}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step < DERNIER_ECRAN && (
            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="min-h-[44px] px-2 font-sans text-sm text-ink/65 transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-court focus-visible:outline-none disabled:opacity-0"
              >
                ← Retour
              </button>
              <button
                type="button"
                onClick={next}
                disabled={!canNext}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-court px-7 font-sans text-sm font-medium text-white transition-all duration-300 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-court focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
              >
                {step === 2 ? content.ctaLabel : "Continuer"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
