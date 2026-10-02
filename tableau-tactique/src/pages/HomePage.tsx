import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Hero } from "../components/sections/Hero";
import { Facts } from "../components/sections/Facts";
import { Offers } from "../components/sections/Offers";
import { Journey } from "../components/sections/Journey";
import { Gallery } from "../components/sections/Gallery";
import { Reviews } from "../components/sections/Reviews";
import { Faq } from "../components/sections/Faq";
import { Booking } from "../components/sections/Booking";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { scrollToTarget } from "../lib/scroll";
import { club, site } from "../content";

export function HomePage() {
  useDocumentTitle(site.seo.title);
  const { hash } = useLocation();

  // Arrivée avec une ancre (depuis une page légale, ou un lien direct) : on y défile.
  useEffect(() => {
    if (!hash) return;
    const timer = window.setTimeout(() => scrollToTarget(hash), 80);
    return () => window.clearTimeout(timer);
  }, [hash]);

  return (
    <main>
      <Hero hero={site.hero} />
      <Facts facts={site.facts} label="Repères" />
      <Offers offers={site.offers} />
      <Journey journey={site.journey} />
      <Gallery gallery={site.gallery} closeLabel={site.ui.close} />
      <Reviews reviews={site.reviews} />
      <Faq faq={site.faq} />
      <Booking booking={site.booking} offers={site.offers.items} ui={site.ui} club={club} />
    </main>
  );
}
