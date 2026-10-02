import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";
import { fr, quote } from "../../lib/typo";
import type { Site } from "../../types";

type Props = { reviews: Site["reviews"] };

/** La note : cinq petites balles de 9 px. */
function Rating({ value }: { value: number }) {
  return (
    <div role="img" aria-label={`${value} sur 5`} className="flex gap-1.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`h-[9px] w-[9px] rounded-full border ${i < value ? "border-ink/25 bg-ball" : "border-rule"}`}
        />
      ))}
    </div>
  );
}

export function Reviews({ reviews }: Props) {
  return (
    <Section id="avis" labelledBy="avis-title">
      <SectionHeader eyebrow={reviews.eyebrow} title={reviews.title} titleId="avis-title" />
      <ul className="mt-12 grid md:grid-cols-2 md:gap-x-12 lg:mt-16">
        {reviews.items.map((review, index) => (
          <Reveal as="li" key={review.name} delay={(index % 2) * 0.06} className="border-t border-rule py-7">
            <Rating value={review.rating} />
            <blockquote className="mt-4 text-[18px] leading-snug text-ink">{quote(review.quote)}</blockquote>
            <p className="mt-4 text-sm font-medium">{review.name}</p>
            <p className="eyebrow mt-1 text-muted">{fr(review.role)}</p>
          </Reveal>
        ))}
      </ul>
      {reviews.examples ? <p className="mt-6 text-[13px] text-muted">{fr(reviews.examplesNote)}</p> : null}
    </Section>
  );
}
