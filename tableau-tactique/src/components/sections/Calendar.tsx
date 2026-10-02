import { useState } from "react";
import { IconChevronLeft, IconChevronRight } from "../ui/Icons";
import { addMonths, dateKey, isSameDay, longDate, monthTitle, startOfDay, weekdayLabels } from "../../lib/format";

type Props = {
  value: Date | null;
  onChange: (date: Date) => void;
  /** Nombre de mois navigables après le mois en cours. */
  monthsAhead?: number;
  prevLabel: string;
  nextLabel: string;
};

const WEEKDAYS = weekdayLabels();

/** Calendrier mensuel, semaine du lundi au dimanche, cases de 44 px. */
export function Calendar({ value, onChange, monthsAhead = 6, prevLabel, nextLabel }: Props) {
  const today = startOfDay(new Date());
  const firstMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonth = addMonths(firstMonth, monthsAhead);
  const [month, setMonth] = useState(() => (value ? new Date(value.getFullYear(), value.getMonth(), 1) : firstMonth));

  const canPrev = month > firstMonth;
  const canNext = month < lastMonth;

  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const leadingBlanks = (month.getDay() + 6) % 7; // lundi en premier
  const cells: Array<Date | null> = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const navButton =
    "flex h-11 w-11 items-center justify-center rounded-full border border-rule text-ink transition-colors hover:border-turf disabled:opacity-40 disabled:hover:border-rule";

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => setMonth(addMonths(month, -1))} disabled={!canPrev} aria-label={prevLabel} className={navButton}>
          <IconChevronLeft />
        </button>
        <p className="font-medium capitalize" aria-live="polite">
          {monthTitle(month)}
        </p>
        <button type="button" onClick={() => setMonth(addMonths(month, 1))} disabled={!canNext} aria-label={nextLabel} className={navButton}>
          <IconChevronRight />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAYS.map((label) => (
          <div key={label} aria-hidden="true" className="eyebrow-sm py-2 text-muted">
            {label}
          </div>
        ))}
        {cells.map((day, index) => {
          if (!day) return <div key={`blank-${index}`} aria-hidden="true" />;
          const past = day < today;
          const selected = value !== null && isSameDay(day, value);
          const isToday = isSameDay(day, today);
          return (
            <button
              key={dateKey(day)}
              type="button"
              disabled={past}
              aria-pressed={selected}
              aria-label={longDate(day)}
              onClick={() => onChange(day)}
              className={`relative mx-auto flex h-11 w-full max-w-11 items-center justify-center rounded-full text-sm tabular-nums transition-colors ${
                selected
                  ? "bg-turf font-medium text-white"
                  : "text-ink hover:bg-rule disabled:text-muted/50 disabled:hover:bg-transparent"
              }`}
            >
              {day.getDate()}
              {isToday ? (
                <span aria-hidden="true" className="absolute bottom-1 left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-ball" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
