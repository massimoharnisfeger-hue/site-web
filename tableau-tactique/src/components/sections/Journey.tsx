import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnchorLink } from "../ui/AnchorLink";
import { Photo } from "../ui/Photo";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";
import { useDesktop, useReduceMotion } from "../../hooks/useMediaQuery";
import { fr } from "../../lib/typo";
import { responsiveSources } from "../../lib/images";
import type { Site } from "../../types";

type Props = { journey: Site["journey"] };
type Item = Site["journey"]["items"][number];

function StepText({ item }: { item: Item }) {
  return (
    <>
      <p className="eyebrow text-muted">{item.step}</p>
      <h3 className="mt-3">{fr(item.title)}</h3>
      <p className="eyebrow mt-2 text-turf">{fr(item.subtitle)}</p>
      <p className="mt-5 max-w-[34rem]">{fr(item.text)}</p>
    </>
  );
}

/** Dès 1024 px : photo collante à gauche, étapes de 70vh à droite, balle qui glisse le long du filet. */
function JourneyScroll({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  const [ballTop, setBallTop] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const steps = listRef.current?.querySelectorAll<HTMLLIElement>("li[data-index]");
    if (!steps?.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, [items.length]);

  useLayoutEffect(() => {
    const place = () => {
      const content = contentRefs.current[active];
      if (content) setBallTop(content.offsetTop + 4);
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  return (
    <div className="mt-16 grid grid-cols-12 gap-8">
      <div className="col-span-6">
        <div className="sticky top-24 aspect-[4/5] overflow-hidden rounded-[4px] bg-rule">
          {items.map((item, index) => (
            <img
              key={item.image}
              src={item.image}
              {...responsiveSources(item.image)}
              alt={index === active ? item.alt : ""}
              aria-hidden={index === active ? undefined : true}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-soft ${
                index === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>

      <ol ref={listRef} className="relative col-span-5 col-start-8 pl-8">
        {/* le filet vertical et sa balle */}
        <div aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-rule" />
        <div
          aria-hidden="true"
          className="absolute left-0 h-[10px] w-[10px] -translate-x-1/2 rounded-full border border-ink/25 bg-ball transition-[top] duration-500 ease-soft"
          style={{ top: ballTop }}
        />
        {items.map((item, index) => (
          <li
            key={item.step}
            data-index={index}
            className={`flex min-h-[70vh] flex-col justify-center border-t border-rule py-10 transition-opacity duration-300 first-of-type:border-t-0 ${
              index === active ? "opacity-100" : "opacity-45"
            }`}
          >
            <div
              ref={(el) => {
                contentRefs.current[index] = el;
              }}
            >
              <StepText item={item} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Sous 1024 px et en mouvement réduit : les étapes empilées, chacune avec sa photo. */
function JourneyStacked({ items }: { items: Item[] }) {
  return (
    <ol className="mt-12 grid gap-12 md:grid-cols-2 md:gap-x-8 lg:grid-cols-4">
      {items.map((item, index) => (
        <Reveal as="li" key={item.step} delay={index * 0.06} className="border-t border-rule pt-6">
          <Photo src={item.image} alt={item.alt} className="aspect-[4/3]" sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw" />
          <div className="mt-6">
            <StepText item={item} />
          </div>
        </Reveal>
      ))}
    </ol>
  );
}

export function Journey({ journey }: Props) {
  const desktop = useDesktop();
  const reduce = useReduceMotion();
  const scrollVersion = desktop && !reduce;

  return (
    <Section id="parcours" labelledBy="parcours-title">
      <SectionHeader eyebrow={journey.eyebrow} title={journey.title} intro={journey.intro} titleId="parcours-title" />
      {scrollVersion ? <JourneyScroll items={journey.items} /> : <JourneyStacked items={journey.items} />}
      <div className="mt-12">
        <AnchorLink target="#reservation" className="link-arrow">
          {fr(journey.cta)}
        </AnchorLink>
      </div>
    </Section>
  );
}
