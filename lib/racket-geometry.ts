/**
 * Géométrie d'une raquette de padel, en mètres, sans dépendance.
 *
 * Partagée par la scène 3D (components/three) et par l'illustration SVG du
 * héros, rendue côté serveur avant le chargement de WebGL : la silhouette est
 * identique dans les deux cas.
 *
 * Cotes réglementaires d'une raquette de padel : 45,5 cm de long au plus,
 * 26 cm de large, 38 mm d'épaisseur. Le tamis est plein et perforé, la gorge
 * ouverte en triangle sous le « pont ».
 */

export type Pt = { x: number; y: number };
export type Cubic = { c1: Pt; c2: Pt; to: Pt };
export type Contour = { from: Pt; segments: Cubic[] };

const p = (x: number, y: number): Pt => ({ x, y });
const line = (from: Pt, to: Pt): Cubic => ({
  c1: p(from.x + (to.x - from.x) / 3, from.y + (to.y - from.y) / 3),
  c2: p(from.x + ((to.x - from.x) * 2) / 3, from.y + ((to.y - from.y) * 2) / 3),
  to,
});

/** Contour extérieur du tamis et de la gorge (forme ronde-goutte). */
export const OUTLINE: Contour = {
  from: p(0, 0.155),
  segments: [
    { c1: p(0.078, 0.155), c2: p(0.132, 0.098), to: p(0.132, 0.022) },
    { c1: p(0.132, -0.052), c2: p(0.1, -0.108), to: p(0.054, -0.136) },
    { c1: p(0.034, -0.149), c2: p(0.022, -0.161), to: p(0.0205, -0.176) },
    line(p(0.0205, -0.176), p(-0.0205, -0.176)),
    { c1: p(-0.022, -0.161), c2: p(-0.034, -0.149), to: p(-0.054, -0.136) },
    { c1: p(-0.1, -0.108), c2: p(-0.132, -0.052), to: p(-0.132, 0.022) },
    { c1: p(-0.132, 0.098), c2: p(-0.078, 0.155), to: p(0, 0.155) },
  ],
};

/** Ouverture triangulaire de la gorge, sous le pont. */
export const THROAT: Contour = {
  from: p(-0.033, -0.097),
  segments: [
    { c1: p(-0.012, -0.103), c2: p(0.012, -0.103), to: p(0.033, -0.097) },
    { c1: p(0.024, -0.118), c2: p(0.012, -0.142), to: p(0.0045, -0.158) },
    { c1: p(0.002, -0.163), c2: p(-0.002, -0.163), to: p(-0.0045, -0.158) },
    { c1: p(-0.012, -0.142), c2: p(-0.024, -0.118), to: p(-0.033, -0.097) },
  ],
};

export const HOLE_RADIUS = 0.0062;
export const FACE_DEPTH = 0.038;
/** Bas de la gorge : le manche commence ici. */
export const THROAT_BOTTOM = -0.176;
export const HANDLE_LENGTH = 0.135;
export const HANDLE_RADIUS = 0.0185;

function cubicAt(a: Pt, s: Cubic, t: number): Pt {
  const u = 1 - t;
  const b0 = u * u * u;
  const b1 = 3 * u * u * t;
  const b2 = 3 * u * t * t;
  const b3 = t * t * t;
  return {
    x: b0 * a.x + b1 * s.c1.x + b2 * s.c2.x + b3 * s.to.x,
    y: b0 * a.y + b1 * s.c1.y + b2 * s.c2.y + b3 * s.to.y,
  };
}

/** Échantillonne un contour en polyligne fermée. */
export function sampleContour(c: Contour, perSegment = 24): Pt[] {
  const pts: Pt[] = [];
  let from = c.from;
  for (const s of c.segments) {
    for (let i = 0; i < perSegment; i++) pts.push(cubicAt(from, s, i / perSegment));
    from = s.to;
  }
  return pts;
}

function inside(pt: Pt, poly: Pt[]): boolean {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i];
    const b = poly[j];
    if (a.y > pt.y !== b.y > pt.y && pt.x < ((b.x - a.x) * (pt.y - a.y)) / (b.y - a.y) + a.x) {
      hit = !hit;
    }
  }
  return hit;
}

function distanceToPolyline(pt: Pt, poly: Pt[]): number {
  let best = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[j];
    const b = poly[i];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len2 = dx * dx + dy * dy || 1e-12;
    const t = Math.max(0, Math.min(1, ((pt.x - a.x) * dx + (pt.y - a.y) * dy) / len2));
    const ex = a.x + t * dx - pt.x;
    const ey = a.y + t * dy - pt.y;
    best = Math.min(best, Math.hypot(ex, ey));
  }
  return best;
}

/**
 * Perforations du tamis : grille en quinconce, gardée à distance du bord et
 * au-dessus du pont. Déterministe, donc identique au serveur et au client.
 */
export function holeCenters(): Pt[] {
  const outline = sampleContour(OUTLINE, 32);
  const spacing = 0.0235;
  const rowStep = spacing * 0.866;
  const holes: Pt[] = [];
  let row = 0;
  for (let y = -0.074; y <= 0.15; y += rowStep, row++) {
    const shift = row % 2 === 0 ? 0 : spacing / 2;
    for (let x = -0.13 + shift; x <= 0.13; x += spacing) {
      const c = { x: Math.round(x * 1e5) / 1e5, y: Math.round(y * 1e5) / 1e5 };
      if (!inside(c, outline)) continue;
      if (distanceToPolyline(c, outline) < 0.019) continue;
      holes.push(c);
    }
  }
  return holes;
}

/** Chemin SVG d'un contour, en millimètres, axe Y vers le bas. */
export function contourToSvgPath(c: Contour, scale = 1000): string {
  const f = (v: Pt) => `${(v.x * scale).toFixed(2)} ${(-v.y * scale).toFixed(2)}`;
  return (
    `M${f(c.from)} ` +
    c.segments.map((s) => `C${f(s.c1)} ${f(s.c2)} ${f(s.to)}`).join(" ") +
    " Z"
  );
}
