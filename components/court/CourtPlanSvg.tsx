/**
 * Plan du court vu de dessus (20 × 10 m, 1 unité = 10 cm), avec ses cotes,
 * les quatre joueurs et la trajectoire d'une sortie de vitre. C'est l'état
 * final de la séquence 3D, affiché tel quel quand la 3D est désactivée.
 */
const TRAJECTORY = "M180,75 Q118,40 62,30 L3,17 L15,25";
const PLAYERS: [number, number][] = [
  [182, 78],
  [122, 26],
  [17, 27],
  [74, 74],
];

export default function CourtPlanSvg({
  dims,
  players,
  label,
  className,
}: {
  dims: { length: string; width: string; service: string };
  players: string[];
  label: string;
  className?: string;
}) {
  return (
    <svg viewBox="-6 -16 232 132" className={className} role="img" aria-label={label}>
      <g fontFamily="var(--font-mono)" fontSize="4.6" fill="#526073" stroke="#526073" strokeWidth=".3">
        <line x1="0" y1="-8" x2="200" y2="-8" />
        <line x1="0" y1="-10" x2="0" y2="-6" />
        <line x1="200" y1="-10" x2="200" y2="-6" />
        <text x="100" y="-10.5" textAnchor="middle" stroke="none">{dims.length}</text>
        <line x1="208" y1="0" x2="208" y2="100" />
        <line x1="206" y1="0" x2="210" y2="0" />
        <line x1="206" y1="100" x2="210" y2="100" />
        <text x="212" y="51.5" stroke="none">{dims.width}</text>
        <line x1="100" y1="106" x2="169.5" y2="106" />
        <line x1="100" y1="104.5" x2="100" y2="107.5" />
        <line x1="169.5" y1="104.5" x2="169.5" y2="107.5" />
        <text x="134.75" y="112.5" textAnchor="middle" stroke="none">{dims.service}</text>
      </g>
      <rect width="200" height="100" rx="1" fill="#1F55A8" />
      <g stroke="rgba(205,232,255,.75)" strokeWidth="1.6" fill="none">
        <path d="M40,.8 H.8 V99.2 H40" />
        <path d="M160,.8 H199.2 V99.2 H160" />
      </g>
      <g stroke="rgba(255,255,255,.35)" strokeWidth=".5" strokeDasharray=".6 1.2">
        <line x1="40" y1=".6" x2="160" y2=".6" />
        <line x1="40" y1="99.4" x2="160" y2="99.4" />
      </g>
      <g stroke="#fff" strokeWidth=".6" fill="none">
        <line x1="30.5" y1="3" x2="30.5" y2="97" />
        <line x1="169.5" y1="3" x2="169.5" y2="97" />
        <line x1="30.5" y1="50" x2="169.5" y2="50" />
      </g>
      <line x1="100" y1="-1.5" x2="100" y2="101.5" stroke="#fff" strokeWidth="1.1" />
      <line x1="100" y1="-1.5" x2="100" y2="101.5" stroke="#1F55A8" strokeWidth=".35" strokeDasharray=".8 .8" />
      <g fontFamily="var(--font-mono)" fontSize="3.6" fill="rgba(255,255,255,.9)">
        {PLAYERS.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="3.4" fill="none" stroke="#fff" strokeWidth=".55" />
            <text x={x + 5} y={y - 3}>{players[i] ?? `J${i + 1}`}</text>
          </g>
        ))}
      </g>
      <path d={TRAJECTORY} fill="none" stroke="rgba(255,255,255,.92)" strokeWidth=".7" strokeDasharray="2.2 2.4" strokeLinecap="round" />
      <g fill="none" stroke="#DFF24A" strokeWidth=".6">
        <circle cx="62" cy="30" r="2.2" />
        <path d="M60.6,28.6 l2.8,2.8 m0,-2.8 l-2.8,2.8" />
        <circle cx="3" cy="17" r="2.2" />
      </g>
      <circle cx="15" cy="25" r="1.9" fill="#DFF24A" stroke="rgba(13,27,42,.35)" strokeWidth=".3" />
    </svg>
  );
}
