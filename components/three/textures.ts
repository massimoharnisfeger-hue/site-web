import * as THREE from "three";

/**
 * Textures de la scène, dessinées sur des canvas au chargement : aucune image
 * à télécharger, et les couleurs sont exactement celles de la charte.
 */

export type SceneFonts = { display: string; mono: string };

/** Emprise du tamis (avec la marge du biseau), en mètres. */
export const FACE_BOUNDS = { minX: -0.136, maxX: 0.136, minY: -0.18, maxY: 0.159 };

const TURF = "#1F55A8";
const INK = "#0D1B2A";

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D indisponible");
  return { c, ctx };
}

function toTexture(c: HTMLCanvasElement, anisotropy: number, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = anisotropy;
  t.needsUpdate = true;
  return t;
}

/** Bruit fin et déterministe (même rendu à chaque chargement). */
function speckle(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  count: number,
  colors: string[],
  size = 2,
  seed = 7
) {
  let s = seed;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  // Un seul tracé par couleur : des dizaines de milliers de `fillRect` avec
  // changement de couleur à chaque point coûtaient plusieurs centaines de
  // millisecondes sur téléphone.
  const per = Math.ceil(count / colors.length);
  for (const color of colors) {
    ctx.beginPath();
    for (let i = 0; i < per; i++) ctx.rect(rnd() * w, rnd() * h, size, size);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

/** Face du tamis : carbone tressé, bande bleu gazon, lignes de court, marque. */
export function faceTexture(fonts: SceneFonts, brand: string, anisotropy: number) {
  const W = 1024;
  const H = Math.round((W * (FACE_BOUNDS.maxY - FACE_BOUNDS.minY)) / (FACE_BOUNDS.maxX - FACE_BOUNDS.minX));
  const { c, ctx } = canvas(W, H);
  const sx = (x: number) => ((x - FACE_BOUNDS.minX) / (FACE_BOUNDS.maxX - FACE_BOUNDS.minX)) * W;
  const sy = (y: number) => ((FACE_BOUNDS.maxY - y) / (FACE_BOUNDS.maxY - FACE_BOUNDS.minY)) * H;
  const m = W / (FACE_BOUNDS.maxX - FACE_BOUNDS.minX); // pixels par mètre

  // Carbone 3K : sergé en diagonale, deux teintes très proches.
  ctx.fillStyle = "#101925";
  ctx.fillRect(0, 0, W, H);
  const cell = 8;
  for (let j = 0; j < H / cell; j++) {
    for (let i = 0; i < W / cell; i++) {
      ctx.fillStyle = (i + j * 2) % 4 < 2 ? "#18243a" : "#0c1420";
      ctx.fillRect(i * cell, j * cell, cell, cell);
    }
  }
  const sheen = ctx.createLinearGradient(0, 0, W, H);
  sheen.addColorStop(0, "rgba(255,255,255,0.08)");
  sheen.addColorStop(0.5, "rgba(255,255,255,0)");
  sheen.addColorStop(1, "rgba(255,255,255,0.04)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, W, H);

  // Bande bleu gazon qui part de la gorge et remonte vers le bord droit.
  const band = ctx.createLinearGradient(sx(-0.02), sy(-0.15), sx(0.13), sy(0.08));
  band.addColorStop(0, "#17417F");
  band.addColorStop(1, "#2D6BCB");
  ctx.fillStyle = band;
  ctx.beginPath();
  ctx.moveTo(sx(-0.03), sy(-0.18));
  ctx.bezierCurveTo(sx(0.02), sy(-0.09), sx(0.08), sy(-0.02), sx(0.15), sy(0.06));
  ctx.lineTo(sx(0.15), sy(-0.035));
  ctx.bezierCurveTo(sx(0.09), sy(-0.085), sx(0.05), sy(-0.13), sx(0.03), sy(-0.18));
  ctx.closePath();
  ctx.fill();

  // Lignes de court : ligne de service et ligne centrale, au trait blanc.
  ctx.strokeStyle = "rgba(244,247,251,0.82)";
  ctx.lineWidth = 0.0011 * m;
  ctx.beginPath();
  ctx.moveTo(sx(-0.14), sy(0.03));
  ctx.lineTo(sx(0.14), sy(0.03));
  ctx.moveTo(sx(0), sy(0.03));
  ctx.lineTo(sx(0), sy(0.17));
  ctx.stroke();

  // Marque, en haut du tamis, suivie d'un point balle.
  ctx.fillStyle = "rgba(244,247,251,0.94)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `500 ${Math.round(0.0135 * m)}px ${fonts.display}`;
  const label = brand.toUpperCase();
  const spaced = label.split("").join(" ");
  ctx.fillText(spaced, sx(0), sy(0.112));
  const tw = ctx.measureText(spaced).width;
  ctx.fillStyle = "#DFF24A";
  ctx.beginPath();
  ctx.arc(sx(0) + tw / 2 + 0.006 * m, sy(0.112), 0.0026 * m, 0, Math.PI * 2);
  ctx.fill();

  // Référence technique sous le pont.
  ctx.fillStyle = "rgba(244,247,251,0.6)";
  ctx.font = `${Math.round(0.0058 * m)}px ${fonts.mono}`;
  ctx.fillText("PH—01   ·   38 MM", sx(0), sy(-0.064));

  const t = toTexture(c, anisotropy);
  t.wrapS = THREE.ClampToEdgeWrapping;
  t.wrapT = THREE.ClampToEdgeWrapping;
  const w = FACE_BOUNDS.maxX - FACE_BOUNDS.minX;
  const h = FACE_BOUNDS.maxY - FACE_BOUNDS.minY;
  t.repeat.set(1 / w, 1 / h);
  t.offset.set(-FACE_BOUNDS.minX / w, -FACE_BOUNDS.minY / h);
  return t;
}

/** Surgrip enroulé en spirale. */
export function gripTexture(anisotropy: number) {
  const W = 256;
  const H = 1024;
  const { c, ctx } = canvas(W, H);
  ctx.fillStyle = "#EEF2F7";
  ctx.fillRect(0, 0, W, H);
  speckle(ctx, W, H, 6000, ["rgba(13,27,42,0.05)", "rgba(255,255,255,0.6)"], 2, 11);
  ctx.strokeStyle = "rgba(150,166,190,0.75)";
  ctx.lineWidth = 3;
  for (let k = -W; k < H + W; k += 30) {
    ctx.beginPath();
    ctx.moveTo(0, k);
    ctx.lineTo(W, k - W * 0.55);
    ctx.stroke();
  }
  const t = toTexture(c, anisotropy);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Balle de padel : feutre jaune et couture blanche. */
export function ballTexture(anisotropy: number) {
  const W = 1024;
  const H = 512;
  const { c, ctx } = canvas(W, H);
  ctx.fillStyle = "#DFF24A";
  ctx.fillRect(0, 0, W, H);
  speckle(ctx, W, H, 14000, ["rgba(120,140,20,0.18)", "rgba(255,255,230,0.35)"], 2, 3);
  ctx.strokeStyle = "rgba(250,252,240,0.95)";
  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  ctx.beginPath();
  for (let x = 0; x <= W; x += 4) {
    const y = H / 2 + H * 0.26 * Math.sin((x / W) * Math.PI * 4);
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  return toTexture(c, anisotropy);
}

/** Gazon du court (20 × 10 m) avec ses lignes. `scale` réduit la définition (téléphone). */
export function turfTexture(anisotropy: number, scale = 1) {
  const W = Math.round(2048 * scale);
  const H = Math.round(1024 * scale);
  const { c, ctx } = canvas(W, H);
  ctx.fillStyle = TURF;
  ctx.fillRect(0, 0, W, H);
  speckle(
    ctx,
    W,
    H,
    Math.round(60000 * scale * scale),
    ["rgba(36,92,180,0.55)", "rgba(24,72,150,0.5)", "rgba(60,120,210,0.25)"],
    2,
    5
  );
  const px = W / 20;
  const line = Math.max(3, Math.round(0.05 * px));
  ctx.fillStyle = "#F4F7FB";
  // Lignes de service, à 6,95 m du filet, d'un côté à l'autre.
  for (const x of [-6.95, 6.95]) ctx.fillRect((x + 10) * px - line / 2, 0, line, H);
  // Ligne centrale de service, entre les deux lignes de service.
  ctx.fillRect((10 - 6.95) * px, H / 2 - line / 2, 6.95 * 2 * px, line);
  return toTexture(c, anisotropy);
}

/** Grillage en losanges (canal alpha). */
export function fenceTexture(anisotropy: number) {
  const S = 128;
  const { c, ctx } = canvas(S, S);
  ctx.clearRect(0, 0, S, S);
  ctx.strokeStyle = "rgba(13,27,42,0.5)";
  ctx.lineWidth = 2;
  for (let k = -S; k <= S * 2; k += S / 2) {
    ctx.beginPath();
    ctx.moveTo(k, 0);
    ctx.lineTo(k + S, S);
    ctx.moveTo(k + S, 0);
    ctx.lineTo(k, S);
    ctx.stroke();
  }
  const t = toTexture(c, anisotropy);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Filet : maille sombre et bande blanche en haut. */
export function netTexture(anisotropy: number) {
  const W = 256;
  const H = 128;
  const { c, ctx } = canvas(W, H);
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(13,27,42,0.72)";
  ctx.lineWidth = 1.5;
  for (let x = 0; x <= W; x += 10) {
    ctx.beginPath();
    ctx.moveTo(x, 12);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 12; y <= H; y += 10) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.fillStyle = "#F4F7FB";
  ctx.fillRect(0, 0, W, 12);
  ctx.fillStyle = INK;
  ctx.fillRect(0, 11, W, 1);
  const t = toTexture(c, anisotropy);
  t.wrapS = THREE.RepeatWrapping;
  return t;
}
