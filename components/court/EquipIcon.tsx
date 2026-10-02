import type { EquipementIcon } from "@/lib/types";

/** Pictogrammes au trait pour la section « Le club ». Tracé en currentColor. */
const PATHS: Record<EquipementIcon, React.ReactNode> = {
  court: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="1" />
      <line x1="12" y1="6" x2="12" y2="18" />
      <line x1="7.5" y1="6" x2="7.5" y2="18" />
      <line x1="16.5" y1="6" x2="16.5" y2="18" />
      <line x1="7.5" y1="12" x2="16.5" y2="12" />
    </>
  ),
  ball: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M4.5 9.5c3.5 1 7.5 1 15 0" />
      <path d="M4.5 14.5c3.5-1 7.5-1 15 0" />
    </>
  ),
  racket: (
    <>
      <ellipse cx="11" cy="9" rx="6.5" ry="7" />
      <line x1="11" y1="16" x2="13.5" y2="21" />
      <path d="M7 7.5c2.5 1 5.5 1 8 0" />
      <path d="M11 3v12" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  shower: (
    <>
      <path d="M6 20v-7a6 6 0 0 1 12 0v7" />
      <line x1="4" y1="20" x2="20" y2="20" />
      <line x1="9" y1="11" x2="9" y2="13" />
      <line x1="12" y1="11" x2="12" y2="13.5" />
      <line x1="15" y1="11" x2="15" y2="13" />
    </>
  ),
  shop: (
    <>
      <path d="M4 9l1-4h14l1 4" />
      <path d="M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" />
      <path d="M5.5 10.5V20h13v-9.5" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  parking: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M10 16V8h3a2.5 2.5 0 0 1 0 5h-3" />
    </>
  ),
  bar: (
    <>
      <path d="M5 4h14l-7 8z" />
      <line x1="12" y1="12" x2="12" y2="20" />
      <line x1="8" y1="20" x2="16" y2="20" />
    </>
  ),
};

export default function EquipIcon({ name, className = "h-6 w-6" }: { name: EquipementIcon; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name] ?? PATHS.court}
    </svg>
  );
}
