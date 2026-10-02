import { useCallback, useEffect, useRef, useState } from "react";
import { Photo } from "../ui/Photo";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";
import { IconChevronLeft, IconChevronRight, IconClose } from "../ui/Icons";
import { useScrollLock } from "../../hooks/useScrollLock";
import { fr } from "../../lib/typo";
import { responsiveSources } from "../../lib/images";
import type { Site } from "../../types";

type Item = Site["gallery"]["items"][number];
type Props = { gallery: Site["gallery"]; closeLabel: string };

/** Grille éditoriale dès 1024 px : 8 + 4 (420 px), 3 + 3 + 3 + 3 (260 px), 4 + 8 (420 px). */
const LAYOUT = [
  { span: "lg:col-span-8", height: "lg:h-[420px]", sizes: "(min-width: 1024px) 66vw, 50vw" },
  { span: "lg:col-span-4", height: "lg:h-[420px]", sizes: "(min-width: 1024px) 33vw, 50vw" },
  { span: "lg:col-span-3", height: "lg:h-[260px]", sizes: "(min-width: 1024px) 25vw, 50vw" },
  { span: "lg:col-span-3", height: "lg:h-[260px]", sizes: "(min-width: 1024px) 25vw, 50vw" },
  { span: "lg:col-span-3", height: "lg:h-[260px]", sizes: "(min-width: 1024px) 25vw, 50vw" },
  { span: "lg:col-span-3", height: "lg:h-[260px]", sizes: "(min-width: 1024px) 25vw, 50vw" },
  { span: "lg:col-span-4", height: "lg:h-[420px]", sizes: "(min-width: 1024px) 33vw, 50vw" },
  { span: "lg:col-span-8", height: "lg:h-[420px]", sizes: "(min-width: 1024px) 66vw, 50vw" },
];
const FALLBACK_LAYOUT = { span: "lg:col-span-4", height: "lg:h-[260px]", sizes: "(min-width: 1024px) 33vw, 50vw" };

type LightboxProps = {
  items: Item[];
  index: number;
  closeLabel: string;
  onClose: () => void;
  onMove: (delta: number) => void;
};

function Lightbox({ items, index, closeLabel, onClose, onMove }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const item = items[index];
  useScrollLock(true);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowRight") {
        onMove(1);
      } else if (event.key === "ArrowLeft") {
        onMove(-1);
      } else if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled])"));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onMove]);

  const navButton =
    "flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10 focus-visible:outline-white";

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-caption"
      className="fixed inset-0 z-50 flex flex-col bg-ink/92 text-white"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex justify-end p-3 sm:p-4">
        <button ref={closeRef} type="button" aria-label={closeLabel} onClick={onClose} className={navButton}>
          <IconClose />
        </button>
      </div>

      <figure className="flex min-h-0 flex-1 flex-col items-center justify-center px-16 pb-8">
        <img
          key={item.src}
          src={item.src}
          {...responsiveSources(item.src)}
          sizes="100vw"
          alt={item.alt}
          decoding="async"
          className="max-h-[85vh] max-w-full rounded-[4px] object-contain"
        />
        <figcaption id="lightbox-caption" className="mt-4 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-center">
          <span className="eyebrow text-white/70">Fig. {index + 1}</span>
          <span className="text-sm text-white">{fr(item.caption)}</span>
        </figcaption>
      </figure>

      {items.length > 1 ? (
        <>
          <button
            type="button"
            aria-label={fr(items[(index - 1 + items.length) % items.length].caption)}
            onClick={() => onMove(-1)}
            className={`${navButton} absolute left-3 top-1/2 -translate-y-1/2 sm:left-4`}
          >
            <IconChevronLeft />
          </button>
          <button
            type="button"
            aria-label={fr(items[(index + 1) % items.length].caption)}
            onClick={() => onMove(1)}
            className={`${navButton} absolute right-3 top-1/2 -translate-y-1/2 sm:right-4`}
          >
            <IconChevronRight />
          </button>
        </>
      ) : null}
    </div>
  );
}

export function Gallery({ gallery, closeLabel }: Props) {
  const [broken, setBroken] = useState<ReadonlySet<string>>(() => new Set());
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const returnFocusTo = useRef<number | null>(null);

  // Une photo qui ne charge pas est retirée.
  const items = gallery.items.filter((item) => !broken.has(item.src));
  const markBroken = (src: string) =>
    setBroken((previous) => {
      const next = new Set(previous);
      next.add(src);
      return next;
    });

  const close = useCallback(() => {
    setOpenIndex((current) => {
      returnFocusTo.current = current;
      return null;
    });
  }, []);

  const move = useCallback(
    (delta: number) => {
      setOpenIndex((current) => (current === null ? null : (current + delta + items.length) % items.length));
    },
    [items.length],
  );

  // Le focus revient à la photo d'origine après la fermeture.
  useEffect(() => {
    if (openIndex === null && returnFocusTo.current !== null) {
      triggerRefs.current[returnFocusTo.current]?.focus();
      returnFocusTo.current = null;
    }
  }, [openIndex]);

  return (
    <Section id="galerie" labelledBy="galerie-title">
      <SectionHeader eyebrow={gallery.eyebrow} title={gallery.title} intro={gallery.intro} titleId="galerie-title" />
      <ul className="mt-12 grid grid-cols-2 gap-4 lg:mt-16 lg:grid-cols-12">
        {items.map((item, index) => {
          const layout = LAYOUT[index] ?? FALLBACK_LAYOUT;
          return (
            <Reveal as="li" key={item.src} delay={(index % 4) * 0.06} className={layout.span}>
              <figure>
                <button
                  type="button"
                  ref={(el) => {
                    triggerRefs.current[index] = el;
                  }}
                  aria-label={fr(`Agrandir : ${item.alt}`)}
                  onClick={() => setOpenIndex(index)}
                  className="group block w-full rounded-[4px] text-left"
                >
                  <Photo
                    src={item.src}
                    alt={item.alt}
                    className={`aspect-[4/5] lg:aspect-auto ${layout.height}`}
                    sizes={layout.sizes}
                    imgClassName="transition-transform duration-200 ease-soft group-hover:scale-[1.03]"
                    onError={() => markBroken(item.src)}
                  />
                </button>
                <figcaption className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="eyebrow text-muted">Fig. {index + 1}</span>
                  <span className="text-[13px]">{fr(item.caption)}</span>
                </figcaption>
              </figure>
            </Reveal>
          );
        })}
      </ul>

      {openIndex !== null && items[openIndex] ? (
        <Lightbox items={items} index={openIndex} closeLabel={closeLabel} onClose={close} onMove={move} />
      ) : null}
    </Section>
  );
}
