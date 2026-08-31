import type { HomeContent } from "@/lib/content";

/**
 * Questions/réponses au format schema.org. Google peut les afficher
 * directement sous le résultat de recherche. Renvoie null s'il n'y a rien à
 * publier — mieux vaut aucun balisage qu'un balisage vide.
 */
export function faqJsonLd(home: HomeContent) {
  const items = home.faq.items.filter((i) => i.question.trim() && i.answer.trim());
  if (items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}

/**
 * Fiche de lieu au format schema.org, lue par Google pour le référencement
 * local (panneau latéral, résultats cartographiques).
 *
 * Renvoie null tant que la ville n'est pas renseignée : publier une fiche
 * d'établissement incomplète vaut moins que ne rien publier.
 *
 * Deux champs sont volontairement absents :
 *   - openingHours, parce que le champ Horaires est du texte libre et que le
 *     format attendu par schema.org est strict ;
 *   - aggregateRating, parce que les avis du site ne sont pas encore de vrais
 *     avis vérifiables — un balisage d'avis non fondé expose à une sanction.
 */
export function localBusinessJsonLd(home: HomeContent, siteUrl?: string) {
  const f = home.footer;
  if (!f.addressCity.trim()) return null;

  return {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: home.brand,
    description: home.seo.description,
    ...(siteUrl ? { url: siteUrl } : {}),
    ...(f.email ? { email: f.email } : {}),
    ...(f.phone ? { telephone: f.phone } : {}),
    ...(f.mapsUrl ? { hasMap: f.mapsUrl } : {}),
    address: {
      "@type": "PostalAddress",
      ...(f.addressStreet ? { streetAddress: f.addressStreet } : {}),
      ...(f.addressZip ? { postalCode: f.addressZip } : {}),
      addressLocality: f.addressCity,
      addressCountry: "FR",
    },
    sport: "Padel",
  };
}
