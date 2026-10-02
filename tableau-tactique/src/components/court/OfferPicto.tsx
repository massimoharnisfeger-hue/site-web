type Props = {
  players: { left: number; right: number };
  coach: boolean;
};

const WIDTH = 44;
const HEIGHT = 22;
const NET_X = WIDTH / 2;

/** Positions verticales de n joueurs, réparties autour du milieu. */
function spread(count: number): number[] {
  if (count <= 0) return [];
  const step = count > 1 ? 12 / (count - 1) : 0;
  return Array.from({ length: count }, (_, i) => HEIGHT / 2 + (i - (count - 1) / 2) * step);
}

/**
 * Pictogramme d'une formule : un mini-court de 44 × 22 px au trait turf,
 * un point plein par joueur de chaque côté du filet, un cercle vide pour le coach.
 */
export function OfferPicto({ players, coach }: Props) {
  const bothSides = players.left > 0 && players.right > 0;
  const leftX = 11;
  const rightX = coach && bothSides ? 30 : 33;
  const coachPosition: [number, number] | null = !coach
    ? null
    : players.right === 0
      ? [33, HEIGHT / 2]
      : players.left === 0
        ? [11, HEIGHT / 2]
        : [38.5, HEIGHT / 2];

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width={WIDTH} height={HEIGHT} aria-hidden="true" focusable="false" className="shrink-0 text-turf">
      <rect x=".5" y=".5" width={WIDTH - 1} height={HEIGHT - 1} rx="1.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <line x1={NET_X} y1="0" x2={NET_X} y2={HEIGHT} stroke="currentColor" strokeWidth="1" />
      {spread(players.left).map((y, i) => (
        <circle key={`l${i}`} cx={leftX} cy={y} r="1.8" fill="currentColor" />
      ))}
      {spread(players.right).map((y, i) => (
        <circle key={`r${i}`} cx={rightX} cy={y} r="1.8" fill="currentColor" />
      ))}
      {coachPosition ? (
        <circle cx={coachPosition[0]} cy={coachPosition[1]} r="2.2" fill="none" stroke="currentColor" strokeWidth=".9" />
      ) : null}
    </svg>
  );
}
