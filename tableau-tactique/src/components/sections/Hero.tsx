import { CourtPlan } from "../court/CourtPlan";
import { AnchorLink } from "../ui/AnchorLink";
import { Reveal } from "../ui/Reveal";
import { fr } from "../../lib/typo";
import type { Site } from "../../types";

type Props = { hero: Site["hero"] };

/** Le point final du H1 : une petite balle. */
function BallPeriod() {
  return (
    <span
      aria-hidden="true"
      className="ml-[0.08em] inline-block h-[0.2em] w-[0.2em] rounded-full border border-ink/18 bg-ball align-baseline"
    />
  );
}

export function Hero({ hero }: Props) {
  return (
    <section aria-labelledby="hero-title" className="container-site pb-[72px] pt-[88px]">
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow text-turf">{fr(hero.label)}</p>
          <h1 id="hero-title" className="mt-5">
            {fr(hero.title)}
            <BallPeriod />
          </h1>
          <p className="lede mt-6">{fr(hero.subtitle)}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <AnchorLink target="#reservation" className="btn btn-primary">
              {fr(hero.ctaPrimary)}
            </AnchorLink>
            <AnchorLink target="#parcours" className="link-arrow">
              {fr(hero.ctaSecondary)}
            </AnchorLink>
          </div>
        </Reveal>

        <Reveal as="figure" delay={0.1} className="pt-[26px] pr-10 sm:pr-[30px] lg:col-span-7">
          {/* le padding bas réserve la place de la cote « 6,95 m » */}
          <div className="pb-[8.5%]">
            <CourtPlan alt={hero.figure.alt} players={hero.figure.players} />
          </div>
          <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="eyebrow text-muted">{hero.figure.label}</span>
            <span className="text-[13px] text-muted">{fr(hero.figure.caption)}</span>
          </figcaption>
        </Reveal>
      </div>
    </section>
  );
}
