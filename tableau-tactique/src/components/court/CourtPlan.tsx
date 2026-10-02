import { useEffect, useRef } from "react";
import { useReduceMotion } from "../../hooks/useMediaQuery";

type Props = {
  /** Description complète du plan (`hero.figure.alt`). */
  alt: string;
  /** Repères des quatre joueurs. */
  players: string[];
  className?: string;
};

const TURF = "#1F55A8";
const MUTED = "#526073";
const BALL = "#DFF24A";
const TRAJECTORY = "M150,77 Q106,44 62,30 L3,17 L15,25";
const PLAYER_POSITIONS: Array<[number, number]> = [
  [152, 80],
  [122, 26],
  [17, 27],
  [74, 74],
];
/** Fin du tracé (0,3 s + 1,6 s) : la balle part ensuite. */
const BALL_START_MS = 1900;

/**
 * Plan d'un court de padel, 1 unité = 10 cm. Le tracé se dessine, les impacts
 * apparaissent, puis la balle suit la trajectoire en boucle. En mouvement réduit,
 * tout est posé dans son état final et la balle reste sur son point de rebond.
 */
export function CourtPlan({ alt, players, className = "" }: Props) {
  const reduce = useReduceMotion();
  const motionRef = useRef<SVGAnimateMotionElement>(null);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setTimeout(() => {
      try {
        motionRef.current?.beginElement();
      } catch {
        // Navigateur sans SMIL : la balle reste à son point de départ.
      }
    }, BALL_START_MS);
    return () => window.clearTimeout(timer);
  }, [reduce]);

  return (
    <svg
      viewBox="0 0 200 100"
      role="img"
      aria-label={alt}
      className={`block h-auto w-full ${className}`}
      style={{ overflow: "visible" }}
    >
      {/* cotes : Fragment Mono, couleur muted */}
      <g
        className="court-cotes"
        fontFamily="Fragment Mono, ui-monospace, monospace"
        fontSize="4.2"
        fill={MUTED}
        stroke={MUTED}
        strokeWidth=".3"
      >
        <line x1="0" y1="-8" x2="200" y2="-8" />
        <line x1="0" y1="-10" x2="0" y2="-6" />
        <line x1="200" y1="-10" x2="200" y2="-6" />
        <text x="100" y="-10" textAnchor="middle" stroke="none">
          20 m
        </text>
        <line x1="208" y1="0" x2="208" y2="100" />
        <line x1="206" y1="0" x2="210" y2="0" />
        <line x1="206" y1="100" x2="210" y2="100" />
        <text x="212" y="51.5" stroke="none">
          10 m
        </text>
        <line x1="100" y1="106" x2="169.5" y2="106" />
        <line x1="100" y1="104.5" x2="100" y2="107.5" />
        <line x1="169.5" y1="104.5" x2="169.5" y2="107.5" />
        <text x="134.75" y="112" textAnchor="middle" stroke="none">
          6,95 m
        </text>
      </g>

      {/* gazon */}
      <rect width="200" height="100" rx="1" fill={TURF} />

      {/* vitres : les deux fonds et 4 m sur chaque côté */}
      <g stroke="rgba(205,232,255,.75)" strokeWidth="1.6" fill="none">
        <path d="M40,.8 H.8 V99.2 H40" />
        <path d="M160,.8 H199.2 V99.2 H160" />
      </g>

      {/* grillage au milieu des côtés */}
      <g stroke="rgba(255,255,255,.35)" strokeWidth=".5" strokeDasharray=".6 1.2">
        <line x1="40" y1=".6" x2="160" y2=".6" />
        <line x1="40" y1="99.4" x2="160" y2="99.4" />
      </g>

      {/* lignes de service et ligne centrale */}
      <g stroke="#fff" strokeWidth=".6" fill="none">
        <line x1="30.5" y1="3" x2="30.5" y2="97" />
        <line x1="169.5" y1="3" x2="169.5" y2="97" />
        <line x1="30.5" y1="50" x2="169.5" y2="50" />
      </g>

      {/* filet */}
      <line x1="100" y1="-1.5" x2="100" y2="101.5" stroke="#fff" strokeWidth="1.1" />
      <line x1="100" y1="-1.5" x2="100" y2="101.5" stroke={TURF} strokeWidth=".35" strokeDasharray=".8 .8" />

      {/* joueurs */}
      <g className="court-players">
        {players.map((label, i) => {
          const [cx, cy] = PLAYER_POSITIONS[i] ?? [0, 0];
          return (
            <g key={label}>
              <circle cx={cx} cy={cy} r="3.4" fill="none" stroke="#fff" strokeWidth=".55" />
              <text
                x={cx}
                y={cy + 0.2}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="Fragment Mono, ui-monospace, monospace"
                fontSize="3.4"
                fill="#fff"
              >
                {label}
              </text>
            </g>
          );
        })}
      </g>

      {/* trajectoire : service croisé, rebond, vitre du fond, retour en jeu */}
      <path
        id="trajectoire"
        d={TRAJECTORY}
        fill="none"
        stroke="#fff"
        strokeWidth=".7"
        strokeDasharray="2.2 2.4"
        strokeLinecap="round"
      />
      {/* tracé turf qui recouvre la trajectoire et se retire en 1,6 s */}
      {reduce ? null : (
        <path className="court-cover" d={TRAJECTORY} fill="none" stroke={TURF} strokeWidth="1.5" strokeLinecap="round" />
      )}

      {/* impacts : au sol en (62,30), sur la vitre en (3,17) */}
      <g stroke={BALL} strokeWidth=".6" fill="none">
        <g className={reduce ? undefined : "court-impact court-impact-1"}>
          <circle cx="62" cy="30" r="2.2" />
          <line x1="60.5" y1="28.5" x2="63.5" y2="31.5" />
          <line x1="63.5" y1="28.5" x2="60.5" y2="31.5" />
        </g>
        <g className={reduce ? undefined : "court-impact court-impact-2"}>
          <circle cx="3" cy="17" r="2.2" />
        </g>
      </g>

      {/* balle */}
      {reduce ? (
        <circle cx="62" cy="30" r="1.9" fill={BALL} stroke="rgba(13,27,42,.35)" strokeWidth=".4" />
      ) : (
        <circle className="court-ball-moving" cx="0" cy="0" r="1.9" fill={BALL} stroke="rgba(13,27,42,.35)" strokeWidth=".4">
          <animateMotion
            ref={motionRef}
            dur="5s"
            begin="indefinite"
            repeatCount="indefinite"
            calcMode="linear"
            keyPoints="0;0;1;1"
            keyTimes="0;.32;.72;1"
          >
            <mpath href="#trajectoire" />
          </animateMotion>
        </circle>
      )}
    </svg>
  );
}
