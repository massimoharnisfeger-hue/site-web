/**
 * Pictogramme d'une formule : un mini-court avec un point par joueur de chaque
 * côté du filet, et un cercle vide pour le coach.
 */
const ROWS: Record<number, number[]> = { 0: [], 1: [11], 2: [6, 16], 3: [5, 11, 17] };

export default function PlayersPictogram({
  left,
  right,
  coach,
  label,
}: {
  left: number;
  right: number;
  coach: boolean;
  label: string;
}) {
  const dots = (n: number, side: "l" | "r") =>
    (ROWS[n] ?? []).map((y, i) => {
      const x = side === "l" ? (n === 3 && i === 1 ? 15 : 10) : n === 3 && i === 1 ? 29 : 34;
      return <circle key={`${side}${i}`} cx={x} cy={y} r="2" fill="#1F55A8" />;
    });
  // Le coach se place du côté libre, ou au filet si les deux côtés jouent.
  const coachPos = right === 0 ? { x: 32, y: 11 } : left === 0 ? { x: 12, y: 11 } : { x: 22, y: 3.4 };
  return (
    <svg viewBox="0 0 44 22" className="h-[22px] w-[44px] shrink-0" role="img" aria-label={label}>
      <rect x=".5" y=".5" width="43" height="21" rx="1" fill="none" stroke="#1F55A8" />
      <line x1="22" y1=".5" x2="22" y2="21.5" stroke="#1F55A8" />
      {dots(left, "l")}
      {dots(right, "r")}
      {coach && <circle cx={coachPos.x} cy={coachPos.y} r="2.2" fill="#fff" stroke="#1F55A8" />}
    </svg>
  );
}
