import CoverflowCarousel from "@/components/ui/CoverflowCarousel";
import type { ParcoursContent } from "@/lib/types";

/**
 * Section « Votre parcours ». Fait le pont entre le contenu Payload et le
 * carrousel générique : c'est le seul endroit qui connaît la forme du CMS.
 */
export default function Story({ content }: { content: ParcoursContent }) {
  return (
    <CoverflowCarousel
      sectionLabel={content.eyebrow}
      items={content.items.map((item) => ({
        tag: item.step,
        titleLine1: item.title,
        titleLine2: item.subtitle,
        desc: item.text,
        img: item.image,
        ctaText: content.ctaLabel,
        ctaUrl: content.ctaTarget,
      }))}
    />
  );
}
