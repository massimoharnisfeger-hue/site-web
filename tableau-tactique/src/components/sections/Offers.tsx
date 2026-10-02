import { OfferPicto } from "../court/OfferPicto";
import { Photo } from "../ui/Photo";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";
import { fr } from "../../lib/typo";
import { scrollToTarget, selectOffer } from "../../lib/scroll";
import type { Site } from "../../types";

type Offer = Site["offers"]["items"][number];
type Props = { offers: Site["offers"] };

const SPANS = ["lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-3", "lg:col-span-3"];

function OfferCard({ offer, index, from, book }: { offer: Offer; index: number; from: string; book: string }) {
  const numericPrice = /^\d/.test(offer.price);
  const onSelect = () => {
    selectOffer(index);
    scrollToTarget("#reservation");
  };

  return (
    <article className="group relative flex h-full flex-col rounded-[8px] border border-rule bg-card p-[10px] transition-[border-color,transform] duration-200 ease-soft hover:-translate-y-[2px] hover:border-turf/45 has-[button:focus-visible]:outline-2 has-[button:focus-visible]:outline-offset-[3px] has-[button:focus-visible]:outline-turf">
      <Photo
        src={offer.image}
        alt=""
        className="aspect-[4/3]"
        sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
        imgClassName="transition-transform duration-200 ease-soft group-hover:scale-[1.03]"
      />

      <div className="mt-4 flex items-center justify-between gap-3 px-2">
        {offer.badge ? (
          <span className="eyebrow flex items-center gap-2 text-ink">
            <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full border border-ink/25 bg-ball" />
            {fr(offer.badge)}
          </span>
        ) : (
          <span className="eyebrow text-muted">
            {fr(offer.level)} · {offer.duration}
          </span>
        )}
        <OfferPicto players={offer.players} coach={offer.coach} />
      </div>

      <h3 className="mt-3 px-2">{fr(offer.name)}</h3>
      <p className="mt-2 px-2 text-[15px] text-muted">{fr(offer.description)}</p>

      <div className="mt-auto flex items-center justify-between gap-3 px-2 pt-5">
        <div className="flex w-full items-center justify-between gap-3 border-t border-rule pt-3">
          <p className="flex items-baseline gap-1.5">
            {numericPrice ? <span className="text-[13px] text-muted">{from}</span> : null}
            <span className="font-display text-[20px] font-medium leading-none">{offer.price}</span>
            {offer.unit ? <span className="text-[13px] text-muted">{offer.unit}</span> : null}
          </p>
          <button
            type="button"
            onClick={onSelect}
            aria-label={fr(`${book} : ${offer.name}`)}
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-turf outline-none before:absolute before:inset-0 before:content-[''] after:content-['→']"
          >
            {fr(book)}
          </button>
        </div>
      </div>
    </article>
  );
}

export function Offers({ offers }: Props) {
  return (
    <Section id="offres" labelledBy="offres-title" className="border-t-0">
      <SectionHeader eyebrow={offers.eyebrow} title={offers.title} intro={offers.intro} titleId="offres-title" />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-6">
        {offers.items.map((offer, index) => (
          <Reveal as="li" key={offer.name} delay={index * 0.06} className={SPANS[index] ?? "lg:col-span-2"}>
            <OfferCard offer={offer} index={index} from={offers.from} book={offers.book} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
