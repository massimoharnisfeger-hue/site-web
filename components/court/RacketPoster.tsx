import {
  HANDLE_LENGTH,
  HANDLE_RADIUS,
  HOLE_RADIUS,
  OUTLINE,
  THROAT,
  THROAT_BOTTOM,
  contourToSvgPath,
  holeCenters,
} from "@/lib/racket-geometry";

/**
 * Illustration de la raquette, au trait du tableau tactique. Calculée sur la
 * même géométrie que le modèle 3D : elle s'affiche avant le chargement de
 * WebGL, et à sa place quand la 3D est désactivée.
 */
const MM = 1000;
const head = contourToSvgPath(OUTLINE, MM);
const throat = contourToSvgPath(THROAT, MM);
const holes = holeCenters();
const holePath = holes
  .map((h) => {
    const x = h.x * MM;
    const y = -h.y * MM;
    const r = HOLE_RADIUS * MM;
    return `M${(x - r).toFixed(2)} ${y.toFixed(2)} a${r} ${r} 0 1 0 ${(2 * r).toFixed(2)} 0 a${r} ${r} 0 1 0 ${(-2 * r).toFixed(2)} 0`;
  })
  .join(" ");
const gripTop = -THROAT_BOTTOM * MM - 4;
const gripLength = HANDLE_LENGTH * MM;
const gripR = HANDLE_RADIUS * MM;

export default function RacketPoster({ brand, className }: { brand: string; className?: string }) {
  return (
    <svg
      viewBox="-160 -175 320 650"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id="poster-face">
          <path d={head} />
        </clipPath>
        <pattern id="poster-grip" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-32)">
          <rect width="10" height="10" fill="#EEF2F7" />
          <rect width="10" height="1.4" fill="#C3CEDD" />
        </pattern>
      </defs>

      {/* Ombre portée */}
      <ellipse cx="6" cy="452" rx="92" ry="9" fill="rgba(13,27,42,0.08)" />

      {/* Tamis : contour, gorge et perforations en une seule forme évidée */}
      <path d={`${head} ${throat} ${holePath}`} fill="#0D1B2A" fillRule="evenodd" />
      <g clipPath="url(#poster-face)">
        <path
          d="M-30 180 C 20 90, 80 20, 150 -60 L 150 35 C 90 85, 50 130, 30 180 Z"
          fill="#1F55A8"
        />
        <path d={`${throat} ${holePath}`} fill="#F4F6F9" fillRule="evenodd" />
        <path d="M-140 -30 H 140 M0 -30 V -170" stroke="rgba(244,247,251,0.75)" strokeWidth="1.1" />
      </g>
      <path d={head} fill="none" stroke="#0D1B2A" strokeWidth="3" />
      <text
        x="0"
        y="-108"
        textAnchor="middle"
        className="font-display"
        fontSize="13.5"
        letterSpacing="1.2"
        fill="#F4F7FB"
      >
        {brand.toUpperCase()}
      </text>

      {/* Manche, bague et bouchon */}
      <rect x={-gripR} y={gripTop} width={gripR * 2} height={gripLength} rx="5" fill="url(#poster-grip)" stroke="#C3CEDD" />
      <rect x={-gripR - 1} y={gripTop - 3} width={gripR * 2 + 2} height="5" rx="2" fill="#1F55A8" />
      <rect x={-21.5} y={gripTop + gripLength - 1} width="43" height="14" rx="4" fill="#0D1B2A" />

      {/* Dragonne */}
      <path
        d={`M0 ${gripTop + gripLength + 13} C 18 ${gripTop + gripLength + 40}, 34 ${gripTop + gripLength + 100}, 6 ${gripTop + gripLength + 136} C -24 ${gripTop + gripLength + 104}, -16 ${gripTop + gripLength + 46}, 0 ${gripTop + gripLength + 13}`}
        fill="none"
        stroke="#17417F"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
