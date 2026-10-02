import { createElement } from "react";

/**
 * Apparition au défilement : fondu et montée de 12 px, une seule fois.
 *
 * Composant serveur : il ne pose que la classe `reveal`. Un seul observateur,
 * monté dans la mise en page (RevealObserver), la fait passer à `is-in` quand
 * le bloc arrive à l'écran. L'état masqué n'existe qu'avec JavaScript actif
 * (classe `js` sur <html>) et jamais en mouvement réduit : sans JavaScript,
 * ou s'il échoue, rien ne reste invisible.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "article" | "figure";
}) {
  return createElement(
    as,
    {
      className: `reveal ${className}`,
      // Le délai ne touche que l'apparition, pas les transitions de survol.
      style: delay ? { transitionDelay: `${delay}s, ${delay}s, 0s, 0s, 0s` } : undefined,
    },
    children
  );
}
