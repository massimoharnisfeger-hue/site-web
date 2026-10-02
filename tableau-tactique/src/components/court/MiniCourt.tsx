type Props = {
  className?: string;
  /** Couleur des lignes : blanc sur turf, turf-deep sur fond blanc. */
  lines?: string;
};

/** Le logo : un mini-court de 28 × 14 px, couleur du texte parent (turf ou blanc). */
export function MiniCourt({ className = "", lines = "#fff" }: Props) {
  return (
    <svg viewBox="0 0 28 14" width="28" height="14" aria-hidden="true" focusable="false" className={`shrink-0 ${className}`}>
      <rect width="28" height="14" rx="1.5" fill="currentColor" />
      <g stroke={lines} strokeWidth=".6" fill="none">
        <line x1="4.3" y1=".6" x2="4.3" y2="13.4" />
        <line x1="23.7" y1=".6" x2="23.7" y2="13.4" />
        <line x1="4.3" y1="7" x2="23.7" y2="7" />
      </g>
      <line x1="14" y1="0" x2="14" y2="14" stroke={lines} strokeWidth="1" />
    </svg>
  );
}
