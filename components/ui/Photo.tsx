"use client";

import { useState, type CSSProperties, type SyntheticEvent } from "react";

/**
 * Une photo du site, servie à la bonne taille.
 *
 * Le projet n'utilise pas `next/image` : les URL viennent du back-office et
 * peuvent pointer n'importe où. Une URL sur un hôte non déclaré dans
 * `next.config.mjs` ferait échouer `next/image` à l'exécution, ce qui viderait
 * la page — exactement ce que le principe II de la constitution interdit.
 *
 * Ce composant garde donc la balise `<img>` native et lui ajoute les trois
 * choses qui manquaient :
 *
 *  1. un `srcSet` quand l'URL sait se redimensionner (Unsplash / Imgix), pour
 *     qu'un téléphone télécharge 400 px et non 1400 ;
 *  2. `decoding="async"`, qui sort le décodage du fil principal ;
 *  3. un repli propre : `src` vide ou chargement échoué → rien ne s'affiche,
 *     le fond du conteneur prend le relais, jamais l'icône d'image cassée.
 */

const WIDTHS = [200, 400, 600, 900, 1200, 1600];

/** Les URL Unsplash sont servies par Imgix : le paramètre `w` les redimensionne. */
function buildSrcSet(src: string): string | undefined {
  let url: URL;
  try {
    url = new URL(src, "https://placeholder.invalid");
  } catch {
    return undefined;
  }
  if (!url.searchParams.has("w")) return undefined;

  const max = Number(url.searchParams.get("w")) || WIDTHS[WIDTHS.length - 1];
  const widths = WIDTHS.filter((w) => w <= max);
  if (widths.length < 2) return undefined;

  return widths
    .map((w) => {
      const variant = new URL(url.toString());
      variant.searchParams.set("w", String(w));
      return `${variant.toString()} ${w}w`;
    })
    .join(", ");
}

export default function Photo({
  src,
  alt,
  sizes,
  className,
  style,
  priority = false,
  quiet = false,
}: {
  src: string;
  alt: string;
  /** Largeur d'affichage réelle, pour que le navigateur choisisse la bonne source. */
  sizes: string;
  className?: string;
  style?: CSSProperties;
  /** Vrai uniquement pour une image visible sans défiler. */
  priority?: boolean;
  /** Image d'ambiance : une miniature suffit, elle est floutée ou assombrie. */
  quiet?: boolean;
}) {
  const [broken, setBroken] = useState(false);

  // Une URL vide déclencherait une requête vers la page elle-même sur certains
  // navigateurs, et afficherait une icône cassée sur les autres.
  if (!src || broken) return null;

  const resolved = quiet ? src.replace(/([?&])w=\d+/, "$1w=64") : src;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      srcSet={quiet ? undefined : buildSrcSet(src)}
      sizes={quiet ? undefined : sizes}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.style.display = "none";
        setBroken(true);
      }}
      className={className}
      style={style}
    />
  );
}
