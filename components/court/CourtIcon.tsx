/** Logo : un mini-court vu de dessus (gazon, filet, lignes de service). */
export default function CourtIcon({ className = "h-[14px] w-[28px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 14" className={className} aria-hidden="true" focusable="false">
      <rect x=".75" y=".75" width="26.5" height="12.5" rx="1" fill="#1F55A8" stroke="#1F55A8" strokeWidth="1.5" />
      <line x1="14" y1="1.5" x2="14" y2="12.5" stroke="#fff" strokeWidth="1" />
      <line x1="5" y1="1.5" x2="5" y2="12.5" stroke="#fff" strokeWidth=".8" />
      <line x1="23" y1="1.5" x2="23" y2="12.5" stroke="#fff" strokeWidth=".8" />
      <line x1="5" y1="7" x2="23" y2="7" stroke="#fff" strokeWidth=".8" />
    </svg>
  );
}
