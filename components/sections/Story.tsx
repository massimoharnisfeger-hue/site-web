import CoverflowCarousel from "@/components/ui/CoverflowCarousel";
import { UNSPLASH_LINK } from "@/lib/unsplash";
import type { ParcoursContent } from "@/lib/types";

/**
 * Section « Votre parcours ». Fait le pont entre le contenu Payload et le
 * carrousel générique : c'est le seul endroit qui connaît la forme du CMS.
 */
export default function Story({ content }: { content: ParcoursContent }) {
  return (
    <CoverflowCarousel
      sectionLabel={content.eyebrow}
      unsplashLink={UNSPLASH_LINK}
      items={content.items.map((item) => ({
        tag: item.step,
        titleLine1: item.title,
        titleLine2: item.subtitle,
        desc: item.text,
        img: item.image,
        imgAlt: item.imageAlt,
        credit: item.credit,
        creditLink: item.creditLink,
        ctaText: content.ctaLabel,
        ctaUrl: content.ctaTarget,
      }))}
    />
  );
}
