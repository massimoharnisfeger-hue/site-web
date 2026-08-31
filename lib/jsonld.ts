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
 * `aggregateRating` reste volontairement absent : les avis du site ne sont pas
 * encore de vrais avis vérifiables, et un balisage d'avis non fondé expose à une
 * sanction.
 */

/** `07:00` et rien d'autre : une heure mal formée invalide toute la fiche. */
const HEURE = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * Plages d'ouverture au format schema.org.
 *
 * Le back-office annonce à l'éditeur « Publiés dans la fiche Google du club »
 * depuis le premier jour, et les jours y sont déjà stockés sous leur nom
 * schema.org — mais rien ne les publiait. Les plages incomplètes ou mal saisies
 * sont écartées une à une plutôt que de faire tomber la fiche entière.
 */
function openingHoursSpecification(home: HomeContent) {
  return home.footer.openingHours
    .filter(
      (p) =>
        p.days.length > 0 && HEURE.test(p.opens ?? "") && HEURE.test(p.closes ?? "")
    )
    .map((p) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: p.days,
      opens: p.opens,
      closes: p.closes,
    }));
}
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
    ...(openingHoursSpecification(home).length > 0
      ? { openingHoursSpecification: openingHoursSpecification(home) }
      : {}),
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
