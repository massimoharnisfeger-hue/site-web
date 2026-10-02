import { useEffect, useState } from "react";

/** Identifiant de la section la plus présente dans la bande haute de l'écran. */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    const elements = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRect.height : 0);
        }
        let best: string | null = null;
        let bestHeight = 0;
        for (const [id, height] of visible) {
          if (height > bestHeight) {
            best = id;
            bestHeight = height;
          }
        }
        setActive(best);
      },
      { rootMargin: "-64px 0px -45% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return active;
}
