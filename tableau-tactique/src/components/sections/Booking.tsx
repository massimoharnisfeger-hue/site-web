import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar } from "./Calendar";
import { EASE_SOFT } from "../ui/Reveal";
import { IconMinus, IconPlus } from "../ui/Icons";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";
import { useReduceMotion } from "../../hooks/useMediaQuery";
import { bookingMessageText, buildBookingMessage } from "../../lib/booking-message";
import { digitsCount, formatDateFR, isSameDay, slotMinutes, telHref } from "../../lib/format";
import { SELECT_OFFER_EVENT } from "../../lib/scroll";
import { fr } from "../../lib/typo";
import type { Club, Site } from "../../types";

type Props = {
  booking: Site["booking"];
  offers: Site["offers"]["items"];
  ui: Site["ui"];
  club: Club;
};

type Contact = { name: string; email: string; phone: string };
type ContactKey = keyof Contact;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const TOTAL_STEPS = 4;
const COPIED_MS = 2500;
const FIELDS: ContactKey[] = ["name", "email", "phone"];

/** Remplace, dans un texte, des fragments par des liens. */
function linkify(text: string, links: Array<{ match: string; href: string }>): ReactNode[] {
  const nodes: ReactNode[] = [];
  let rest = text;
  let key = 0;
  while (rest.length > 0) {
    let bestIndex = -1;
    let best: { match: string; href: string } | null = null;
    for (const link of links) {
      const index = rest.indexOf(link.match);
      if (index !== -1 && (bestIndex === -1 || index < bestIndex)) {
        bestIndex = index;
        best = link;
      }
    }
    if (!best) {
      nodes.push(rest);
      break;
    }
    if (bestIndex > 0) nodes.push(rest.slice(0, bestIndex));
    nodes.push(
      <a key={key++} href={best.href} className="underline underline-offset-2 text-ink hover:text-turf">
        {best.match}
      </a>,
    );
    rest = rest.slice(bestIndex + best.match.length);
  }
  return nodes;
}

export function Booking({ booking, offers, ui, club }: Props) {
  const reduce = useReduceMotion();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [offer, setOffer] = useState(booking.defaultOffer);
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [players, setPlayers] = useState(booking.defaultPlayers);
  const [contact, setContact] = useState<Contact>({ name: "", email: "", phone: "" });
  const [touched, setTouched] = useState<Record<ContactKey, boolean>>({ name: false, email: false, phone: false });
  const [copied, setCopied] = useState(false);
  const stepTitleRef = useRef<HTMLHeadingElement>(null);
  const shouldFocusStep = useRef(false);

  // Une carte d'offre présélectionne la formule et ramène le tunnel à l'étape 1.
  useEffect(() => {
    const onSelect = (event: Event) => {
      const index = (event as CustomEvent<number>).detail;
      if (typeof index === "number" && offers[index]) {
        setOffer(index);
        setDirection(-1);
        setStep(1);
      }
    };
    window.addEventListener(SELECT_OFFER_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_OFFER_EVENT, onSelect);
  }, [offers]);

  // Après un changement d'étape, le focus va sur le titre de l'étape.
  // Le titre final, lui, reçoit le focus quand il apparaît (voir finalTitleRef).
  useEffect(() => {
    if (!shouldFocusStep.current || step === TOTAL_STEPS) return;
    shouldFocusStep.current = false;
    stepTitleRef.current?.focus({ preventScroll: true });
  }, [step]);

  const finalTitleRef = (el: HTMLHeadingElement | null) => {
    if (el && shouldFocusStep.current) {
      shouldFocusStep.current = false;
      el.focus({ preventScroll: true });
    }
  };

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), COPIED_MS);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const slotIsPast = (value: string, forDate: Date | null) => forDate !== null && isSameDay(forDate, now) && slotMinutes(value) <= nowMinutes;

  const errors: Record<ContactKey, string> = {
    name: contact.name.trim().length >= 2 ? "" : ui.errors.name,
    email: EMAIL_RE.test(contact.email.trim()) ? "" : ui.errors.email,
    phone: digitsCount(contact.phone) >= 8 ? "" : ui.errors.phone,
  };
  const shownErrors = FIELDS.filter((key) => touched[key] && errors[key]);

  const stepValid =
    step === 1 ? offers[offer] !== undefined : step === 2 ? date !== null && slot !== null : step === 3 ? FIELDS.every((key) => !errors[key]) : true;

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    shouldFocusStep.current = true;
    setStep(next);
  };
  const next = () => {
    if (stepValid && step < TOTAL_STEPS) goTo(step + 1);
  };
  const back = () => {
    if (step > 1) goTo(step - 1);
  };

  const onDateChange = (value: Date) => {
    setDate(value);
    if (slot && slotIsPast(slot, value)) setSlot(null);
  };

  const updateContact = (key: ContactKey, value: string) => setContact((current) => ({ ...current, [key]: value }));
  const blurContact = (key: ContactKey) => {
    if (contact[key].trim() !== "") setTouched((current) => ({ ...current, [key]: true }));
  };

  const selectedOffer = offers[offer];
  const message =
    step === TOTAL_STEPS && selectedOffer && date && slot
      ? buildBookingMessage(
          {
            formule: selectedOffer.name,
            date: formatDateFR(date),
            creneau: slot,
            joueurs: players,
            nom: contact.name.trim(),
            email: contact.email.trim(),
            telephone: contact.phone.trim(),
          },
          club.email,
        )
      : null;
  const messageText = message ? bookingMessageText(message) : "";

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
    } catch {
      // Presse-papiers indisponible : le texte reste sélectionnable dans le bloc.
    }
  };

  const fieldProps = (key: ContactKey) => ({
    id: `booking-${key}`,
    value: contact[key],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => updateContact(key, event.target.value),
    onBlur: () => blurContact(key),
    placeholder: ui.placeholders[key],
    "aria-invalid": touched[key] && errors[key] ? true : undefined,
    "aria-describedby": touched[key] && errors[key] ? `booking-${key}-error` : undefined,
    className: "field",
  });

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: 16 * d }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: -16 * d }),
  };

  return (
    <Section id="reservation" labelledBy="reservation-title">
      <SectionHeader eyebrow={booking.eyebrow} title={booking.title} intro={booking.intro} titleId="reservation-title" />

      <div className="mt-12 lg:mt-16 lg:grid lg:grid-cols-12">
        <div className="lg:col-span-8 lg:col-start-3">
          <div className="relative overflow-hidden rounded-[8px] border border-rule bg-card p-5 md:p-10">
            {/* Progression */}
            <div>
              <p className="eyebrow text-muted">{booking.stepLabel(step, TOTAL_STEPS)}</p>
              <h3 ref={stepTitleRef} tabIndex={-1} className="mt-2 outline-none">
                {fr(booking.steps[step - 1])}
              </h3>
              <div aria-hidden="true" className="mt-5 h-[2px] w-full bg-rule">
                <div className="h-full bg-turf transition-[width] duration-[400ms] ease-soft" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={variants}
                initial={reduce ? false : "enter"}
                animate="center"
                exit={reduce ? undefined : "exit"}
                transition={{ duration: reduce ? 0 : 0.3, ease: EASE_SOFT }}
                className="mt-8"
              >
                {step === 1 ? (
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {offers.map((item, index) => {
                      const selected = offer === index;
                      return (
                        <li key={item.name}>
                          <button
                            type="button"
                            aria-pressed={selected}
                            onClick={() => setOffer(index)}
                            className={`flex min-h-[72px] w-full items-start justify-between gap-4 rounded-[8px] border-[1.5px] p-4 text-left transition-colors duration-200 ${
                              selected ? "border-turf bg-turf/5" : "border-rule bg-card hover:border-turf/45"
                            }`}
                          >
                            <span>
                              <span className="block font-medium">{fr(item.name)}</span>
                              <span className="mt-1 block text-[13px] text-muted">
                                {fr(item.level)} · {item.duration}
                              </span>
                            </span>
                            <span className="shrink-0 font-display text-[18px] font-medium leading-none">{item.price}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}

                {step === 2 ? (
                  <div className="grid gap-10 md:grid-cols-2 md:gap-8">
                    <div>
                      <p className="eyebrow text-muted">{ui.dateLabel}</p>
                      <div className="mt-3">
                        <Calendar value={date} onChange={onDateChange} prevLabel="Mois précédent" nextLabel="Mois suivant" />
                      </div>
                    </div>
                    <div>
                      <p id="booking-slots-label" className="eyebrow text-muted">
                        {fr(booking.slotLabel)}
                      </p>
                      <div role="group" aria-labelledby="booking-slots-label" className="mt-3 grid grid-cols-4 gap-2">
                        {booking.timeSlots.map((value) => {
                          const disabled = slotIsPast(value, date);
                          const selected = slot === value;
                          return (
                            <button
                              key={value}
                              type="button"
                              disabled={disabled}
                              aria-pressed={selected}
                              onClick={() => setSlot(value)}
                              className={`h-11 rounded-[8px] border text-sm font-medium tabular-nums transition-colors duration-200 disabled:opacity-40 ${
                                selected ? "border-turf bg-turf text-white" : "border-rule bg-card hover:border-turf/45 disabled:hover:border-rule"
                              }`}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>

                      <p id="booking-players-label" className="eyebrow mt-8 text-muted">
                        {fr(booking.playersLabel)}
                      </p>
                      <div role="group" aria-labelledby="booking-players-label" className="mt-3 inline-flex items-center rounded-full border border-rule">
                        <button
                          type="button"
                          aria-label="Un joueur de moins"
                          disabled={players <= 1}
                          onClick={() => setPlayers((value) => Math.max(1, value - 1))}
                          className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:text-turf disabled:opacity-40 disabled:hover:text-ink"
                        >
                          <IconMinus />
                        </button>
                        <output aria-live="polite" className="w-12 text-center font-display text-[20px] font-medium tabular-nums">
                          {players}
                        </output>
                        <button
                          type="button"
                          aria-label="Un joueur de plus"
                          disabled={players >= booking.maxPlayers}
                          onClick={() => setPlayers((value) => Math.min(booking.maxPlayers, value + 1))}
                          className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:text-turf disabled:opacity-40 disabled:hover:text-ink"
                        >
                          <IconPlus />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}

                {step === 3 ? (
                  <form
                    noValidate
                    onSubmit={(event) => {
                      event.preventDefault();
                      next();
                    }}
                    className="grid gap-5"
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label htmlFor="booking-name" className="mb-2 block text-sm font-medium">
                          {fr(booking.nameLabel)}
                        </label>
                        <input type="text" autoComplete="name" {...fieldProps("name")} />
                      </div>
                      <div>
                        <label htmlFor="booking-email" className="mb-2 block text-sm font-medium">
                          {fr(booking.emailLabel)}
                        </label>
                        <input type="email" inputMode="email" autoComplete="email" {...fieldProps("email")} />
                      </div>
                      <div>
                        <label htmlFor="booking-phone" className="mb-2 block text-sm font-medium">
                          {fr(booking.phoneLabel)}
                        </label>
                        <input type="tel" inputMode="tel" autoComplete="tel" {...fieldProps("phone")} />
                      </div>
                    </div>
                    <ul aria-live="polite" className="grid gap-1 text-sm text-error">
                      {shownErrors.map((key) => (
                        <li key={key} id={`booking-${key}-error`}>
                          {fr(errors[key])}
                        </li>
                      ))}
                    </ul>
                    <p className="text-[13px] text-muted">{fr(booking.privacyNote)}</p>
                  </form>
                ) : null}

                {step === 4 && message && selectedOffer && date ? (
                  <div>
                    <h3 ref={finalTitleRef} tabIndex={-1} className="outline-none">
                      {fr(booking.finalTitle)}
                    </h3>
                    <p className="mt-3 text-muted">{fr(booking.finalBody)}</p>
                    <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <dt className="eyebrow text-muted">{fr(booking.steps[0])}</dt>
                        <dd className="mt-1 font-medium">{fr(selectedOffer.name)}</dd>
                      </div>
                      <div>
                        <dt className="eyebrow text-muted">{fr(ui.dateLabel)}</dt>
                        <dd className="mt-1 font-medium tabular-nums">{formatDateFR(date)}</dd>
                      </div>
                      <div>
                        <dt className="eyebrow text-muted">{fr(booking.slotLabel)}</dt>
                        <dd className="mt-1 font-medium tabular-nums">{slot}</dd>
                      </div>
                      <div>
                        <dt className="eyebrow text-muted">{fr(booking.playersLabel)}</dt>
                        <dd className="mt-1 font-medium tabular-nums">{players}</dd>
                      </div>
                    </dl>

                    {/* Le ticket : filet pointillé et deux encoches rondes */}
                    <div aria-hidden="true" className="relative -mx-5 my-8 md:-mx-10">
                      <div className="mx-5 border-t border-dashed border-rule md:mx-10" />
                      <span className="absolute -left-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-rule bg-paper" />
                      <span className="absolute -right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-rule bg-paper" />
                    </div>

                    <p className="eyebrow text-muted">{fr(booking.messageLabel)}</p>
                    <pre className="mt-3 max-h-[240px] overflow-auto whitespace-pre-wrap rounded-[8px] bg-paper p-4 font-mono text-[13px] leading-relaxed text-ink [overflow-wrap:anywhere]">
                      {messageText}
                    </pre>
                    <div className="mt-2 flex items-center gap-4">
                      <button type="button" onClick={copyMessage} className="link-arrow">
                        {copied ? fr(booking.copied) : fr(booking.copy)}
                      </button>
                      <span className="sr-only" aria-live="polite">
                        {copied ? fr(booking.copied) : ""}
                      </span>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      {message.mailtoUrl ? (
                        <a href={message.mailtoUrl} className="btn btn-primary">
                          {fr(booking.openMail)}
                        </a>
                      ) : null}
                      <a href={telHref(club.phoneIntl)} className="btn btn-outline">
                        {fr(booking.call)}
                      </a>
                    </div>

                    <p className="mt-5 text-[13px] text-muted">
                      {linkify(fr(booking.fallback(club.email, club.phone)), [
                        { match: club.email, href: `mailto:${club.email}` },
                        { match: club.phone, href: telHref(club.phoneIntl) },
                      ])}
                    </p>
                    <p className="mt-2 text-[13px] text-muted">{fr(booking.paymentNote)}</p>
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sous le panneau : retour et continuer */}
          <div className="mt-5 flex items-center justify-between gap-4">
            {step > 1 ? (
              <button type="button" onClick={back} className="inline-flex min-h-11 items-center text-sm font-medium text-ink transition-colors hover:text-turf">
                {fr(ui.back)}
              </button>
            ) : (
              <span />
            )}
            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={next}
                disabled={!stepValid}
                aria-disabled={!stepValid}
                className={`btn btn-primary ${stepValid ? "" : "opacity-40"}`}
              >
                {step === 3 ? fr(booking.submit) : fr(ui.continue)}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </Section>
  );
}
