import { Reveal } from "../ui/Reveal";
import { fr } from "../../lib/typo";
import type { Site } from "../../types";

type Props = { facts: Site["facts"]; label: string };

/** Bandeau de quatre faits entre deux filets : 4 colonnes dès 900 px, 2 × 2 en dessous. */
export function Facts({ facts, label }: Props) {
  return (
    <section aria-label={label} className="border-y border-rule">
      <div className="container-site">
        <ul className="-mx-5 grid grid-cols-2 min-[900px]:-mx-6 min-[900px]:grid-cols-4">
          {facts.map((fact, index) => (
            <Reveal
              as="li"
              key={fact.label}
              delay={index * 0.06}
              className="border-rule px-5 py-7 nth-[n+3]:border-t even:border-l min-[900px]:border-t-0 min-[900px]:px-6 min-[900px]:[&:not(:first-child)]:border-l"
            >
              <p className="num">{fact.value}</p>
              <p className="mt-1 text-sm text-muted">{fr(fact.label)}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
