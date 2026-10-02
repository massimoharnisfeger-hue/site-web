// Dates et nombres : via Intl, jamais de libellé en dur.

const pad = (n: number) => String(n).padStart(2, "0");

/** jj/mm/aaaa */
export function formatDateFR(date: Date): string {
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

/** ISO local aaaa-mm-jj, pratique comme clé. */
export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const monthFormatter = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });
const weekdayFormatter = new Intl.DateTimeFormat("fr-FR", { weekday: "short" });
const longDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const monthTitle = (date: Date) => monthFormatter.format(date);
export const longDate = (date: Date) => longDateFormatter.format(date);

/** Les sept jours en abrégé, du lundi au dimanche (« lun. », « mar. »…). */
export function weekdayLabels(): string[] {
  const monday = new Date(2024, 0, 1); // un lundi
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return weekdayFormatter.format(d).replace(/\.$/, "");
  });
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

export function isSameDay(a: Date, b: Date): boolean {
  return dateKey(a) === dateKey(b);
}

/** « 19:00 » → minutes depuis minuit. */
export function slotMinutes(slot: string): number {
  const [h, m] = slot.split(":").map(Number);
  return h * 60 + (m || 0);
}

/** Lien tel: sans espaces. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

export function digitsCount(value: string): number {
  return (value.match(/\d/g) ?? []).length;
}
