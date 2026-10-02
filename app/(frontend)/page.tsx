import type { Metadata } from "next";
import Nav from "@/components/ui/Nav";
import HeroSequence from "@/components/sections/HeroSequence";
import Stats from "@/components/sections/Stats";
import Partners from "@/components/sections/Partners";
import Activities from "@/components/sections/Activities";
import Abonnements from "@/components/sections/Abonnements";
import Story from "@/components/sections/Story";
import Equipements from "@/components/sections/Equipements";
import Coachs from "@/components/sections/Coachs";
import Gallery from "@/components/sections/Gallery";
import BandeauBalle from "@/components/sections/BandeauBalle";
import Testimonials from "@/components/sections/Testimonials";
import Faq from "@/components/sections/Faq";
import Booking from "@/components/sections/Booking";
import Footer from "@/components/sections/Footer";
import { getHome } from "@/lib/content";
import { faqJsonLd, localBusinessJsonLd } from "@/lib/jsonld";
import { legalLinks } from "@/lib/legal-links";
import { siteUrl } from "@/lib/site-url";

// Rendu à chaque requête : les modifications faites dans le back-office
// apparaissent immédiatement, sans reconstruire le site.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { seo, footer, brand, hero } = await getHome();

  // La ville est ajoutée au titre quand elle est renseignée et absente :
  // « padel + ville » est la recherche réelle des visiteurs, pas « padel ».
  const city = footer.addressCity.trim();
  const title =
    city && !seo.title.toLowerCase().includes(city.toLowerCase()) ? `${seo.title} · ${city}` : seo.title;

  // Image de partage : celle du back-office, sinon l'affiche générée par /og.
  const image = seo.ogImage
    ? { url: seo.ogImage, alt: brand }
    : { url: "/og", width: 1200, height: 630, alt: `${brand} — ${hero.title1} ${hero.title2}` };

  return {
    title: { absolute: title },
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url: "/",
      siteName: brand,
      title,
      description: seo.description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: seo.description,
      images: [image.url],
    },
  };
}

export default async function Home() {
  const home = await getHome();
  const jsonLd = localBusinessJsonLd(home, siteUrl().toString());
  const faqLd = faqJsonLd(home);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          // Données structurées générées côté serveur à partir du contenu ;
          // `<` est échappé pour qu'un texte saisi ne puisse pas fermer la balise.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      )}
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }}
        />
      )}
      <Nav brand={home.brand} ctaLabel={home.hero.ctaPrimary} links={home.nav.items} announcement={home.announcement} />
      <main id="contenu">
        <HeroSequence hero={home.hero} sequence={home.sequence} brand={home.brand} />
        <Stats content={home.chiffres} />
        <Partners content={home.partenaires} />
        <Activities content={home.offres} />
        <Abonnements content={home.abonnements} />
        <Story content={home.parcours} />
        <Equipements content={home.equipements} />
        <Coachs content={home.coachs} />
        <Gallery content={home.galerie} />
        <BandeauBalle content={home.bandeau} />
        <Testimonials content={home.avis} />
        <Faq content={home.faq} />
        <Booking
          content={home.reservation}
          activities={home.offres.items}
          clubEmail={home.footer.email}
          clubPhone={home.footer.phone}
        />
      </main>
      <Footer
        content={home.footer}
        brand={home.brand}
        links={home.nav.items}
        year={new Date().getFullYear()}
        legalLinks={legalLinks(home)}
      />
    </>
  );
}
