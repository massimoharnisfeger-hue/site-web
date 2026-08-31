import type { Metadata } from "next";
import Nav from "@/components/ui/Nav";
import Hero from "@/components/sections/Hero";
import Activities from "@/components/sections/Activities";
import Story from "@/components/sections/Story";
import Stats from "@/components/sections/Stats";
import Gallery from "@/components/sections/Gallery";
import Testimonials from "@/components/sections/Testimonials";
import Faq from "@/components/sections/Faq";
import Booking from "@/components/sections/Booking";
import Footer from "@/components/sections/Footer";
import { getHome } from "@/lib/content";
import { faqJsonLd, localBusinessJsonLd } from "@/lib/jsonld";

// Rendu à chaque requête : les modifications faites dans le back-office
// apparaissent immédiatement, sans reconstruire le site.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { seo, footer } = await getHome();

  // La ville est ajoutée au titre quand elle est renseignée et absente :
  // « padel + ville » est la recherche réelle des visiteurs, pas « padel ».
  const city = footer.addressCity.trim();
  const title =
    city && !seo.title.toLowerCase().includes(city.toLowerCase())
      ? `${seo.title} · ${city}`
      : seo.title;

  return {
    title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title,
      description: seo.description,
      type: "website",
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
  };
}

export default async function Home() {
  const home = await getHome();
  const jsonLd = localBusinessJsonLd(home);
  const faqLd = faqJsonLd(home);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <Nav
        brand={home.brand}
        ctaLabel={home.hero.ctaPrimary}
        links={home.nav.items}
      />
      <main>
        <Hero content={home.hero} />
        <Activities content={home.offres} />
        <Story content={home.parcours} />
        <Stats content={home.chiffres} />
        <Gallery content={home.galerie} />
        <Testimonials content={home.avis} />
        <Faq content={home.faq} />
        <Booking content={home.reservation} activities={home.offres.items} />
      </main>
      <Footer content={home.footer} brand={home.brand} links={home.nav.items} />
    </>
  );
}
