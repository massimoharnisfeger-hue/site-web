import { ImageResponse } from "next/og";
import { getHome } from "@/lib/content";

/**
 * Affiche de partage (Open Graph, 1200 × 630), utilisée tant qu'aucune image
 * n'est choisie dans le back-office. Les textes viennent du contenu ; le plan
 * du court reprend celui de la séquence du héros.
 */
export const dynamic = "force-dynamic";

const PAPER = "#F4F6F9";
const INK = "#0D1B2A";
const MUTED = "#526073";
const TURF = "#1F55A8";
const BALL = "#DFF24A";

/**
 * Funnel Display au format TrueType : le moteur de rendu des affiches ne lit
 * pas le WOFF2 servi par next/font. Échec → police par défaut, sans erreur.
 */
async function loadFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Funnel+Display:wght@500&text=${encodeURIComponent(text)}`,
      { signal: AbortSignal.timeout(3000) }
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url, { signal: AbortSignal.timeout(3000) }).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export async function GET() {
  const { hero, brand, footer } = await getHome();
  const title = `${hero.title1} ${hero.title2}`;
  // Le sous-ensemble de police doit couvrir tout le texte de l'affiche : un
  // glyphe absent serait dessiné dans une autre police, au milieu d'un mot.
  const font = await loadFont(`${brand}${title}${hero.eyebrow.toUpperCase()}${footer.hours}`);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: PAPER, padding: "64px 72px" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 600 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="56" height="28" viewBox="0 0 28 14">
              <rect x=".75" y=".75" width="26.5" height="12.5" rx="1" fill={TURF} stroke={TURF} strokeWidth="1.5" />
              <line x1="14" y1="1.5" x2="14" y2="12.5" stroke="#fff" strokeWidth="1" />
              <line x1="5" y1="1.5" x2="5" y2="12.5" stroke="#fff" strokeWidth=".8" />
              <line x1="23" y1="1.5" x2="23" y2="12.5" stroke="#fff" strokeWidth=".8" />
              <line x1="5" y1="7" x2="23" y2="7" stroke="#fff" strokeWidth=".8" />
            </svg>
            <div style={{ fontSize: 34, color: INK, fontFamily: font ? "Funnel Display" : undefined }}>{brand}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 22, letterSpacing: 3, textTransform: "uppercase", color: TURF }}>{hero.eyebrow}</div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                marginTop: 22,
                fontSize: 84,
                lineHeight: 1.02,
                letterSpacing: -3,
                color: INK,
                fontFamily: font ? "Funnel Display" : undefined,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span>{hero.title1}</span>
                <span>{hero.title2}</span>
              </div>
              <div
                style={{
                  width: 18,
                  height: 18,
                  marginLeft: 6,
                  marginBottom: 16,
                  borderRadius: 9999,
                  background: BALL,
                  border: "1.5px solid rgba(13,27,42,.25)",
                }}
              />
            </div>
          </div>

          <div style={{ fontSize: 24, color: MUTED }}>{footer.hours}</div>
        </div>

        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "flex-end" }}>
          {/* Plan du court, debout : 10 m × 20 m. */}
          <svg width="250" height="500" viewBox="0 0 100 200">
            <rect width="100" height="200" rx="2" fill={TURF} />
            <path d="M.8,40 V.8 H99.2 V40" fill="none" stroke="rgba(205,232,255,.8)" strokeWidth="1.6" />
            <path d="M.8,160 V199.2 H99.2 V160" fill="none" stroke="rgba(205,232,255,.8)" strokeWidth="1.6" />
            <line x1="3" y1="30.5" x2="97" y2="30.5" stroke="#fff" strokeWidth=".7" />
            <line x1="3" y1="169.5" x2="97" y2="169.5" stroke="#fff" strokeWidth=".7" />
            <line x1="50" y1="30.5" x2="50" y2="169.5" stroke="#fff" strokeWidth=".7" />
            <line x1="-1" y1="100" x2="101" y2="100" stroke="#fff" strokeWidth="1.4" />
            {/* Même trajectoire que le plan de la séquence, tournée d'un quart. */}
            <path d="M75,180 Q40,118 30,62 L17,3 L25,15" fill="none" stroke={BALL} strokeWidth="1.2" strokeDasharray="3 2.4" />
            <circle cx="25" cy="15" r="3.2" fill={BALL} />
            {[
              [78, 182],
              [26, 122],
              [27, 17],
              [74, 74],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="3.4" fill="none" stroke="#fff" strokeWidth=".6" />
            ))}
          </svg>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: font ? [{ name: "Funnel Display", data: font, weight: 500, style: "normal" }] : undefined,
      headers: { "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800" },
    }
  );
}
