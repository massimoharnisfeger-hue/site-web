import { fr } from "../../lib/typo";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow: string;
  title: string;
  intro?: string;
  titleId?: string;
  className?: string;
};

/** Sur-titre et H2 à gauche (5 colonnes), chapeau à droite (7 colonnes), aligné en bas. */
export function SectionHeader({ eyebrow, title, intro, titleId, className = "" }: Props) {
  return (
    <Reveal className={`grid gap-3 lg:grid-cols-12 lg:items-end lg:gap-x-8 ${className}`}>
      <div className="lg:col-span-5">
        <p className="eyebrow text-turf">{fr(eyebrow)}</p>
        <h2 id={titleId} className="mt-3">
          {fr(title)}
        </h2>
      </div>
      {intro ? <p className="lede lg:col-span-7">{fr(intro)}</p> : null}
    </Reveal>
  );
}
