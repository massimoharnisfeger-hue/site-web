// Images responsives : pour Pexels, un srcSet en 600 / 900 / 1200 / 1600.

const WIDTHS = [600, 900, 1200, 1600];

export function responsiveSources(src: string): { srcSet?: string } {
  if (!src.includes("images.pexels.com")) return {};
  const withWidth = (w: number) =>
    /[?&]w=\d+/.test(src) ? src.replace(/([?&])w=\d+/, `$1w=${w}`) : `${src}${src.includes("?") ? "&" : "?"}w=${w}`;
  return { srcSet: WIDTHS.map((w) => `${withWidth(w)} ${w}w`).join(", ") };
}
