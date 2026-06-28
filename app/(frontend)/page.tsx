import type { Metadata } from "next";
import Nav from "@/components/ui/Nav";
import Hero from "@/components/sections/Hero";
import Activities from "@/components/sections/Activities";
import Story from "@/components/sections/Story";
import Stats from "@/components/sections/Stats";
import Gallery from "@/components/sections/Gallery";
import Testimonials from "@/components/sections/Testimonials";
import Booking from "@/components/sections/Booking";
import Footer from "@/components/sections/Footer";
import { getHome } from "@/lib/content";

// Rendu à chaque requête : les modifications faites dans le back-office
// apparaissent immédiatement, sans reconstruire le site.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHome();
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
  };
}

export default async function Home() {
  const home = await getHome();

  return (
    <>
      <Nav brand={home.brand} ctaLabel={home.hero.ctaPrimary} />
      <main>
        <Hero content={home.hero} />
        <Activities content={home.offres} />
        <Story content={home.parcours} />
        <Stats content={home.chiffres} />
        <Gallery content={home.galerie} />
        <Testimonials content={home.avis} />
        <Booking content={home.reservation} activities={home.offres.items} />
      </main>
      <Footer content={home.footer} brand={home.brand} />
    </>
  );
}
