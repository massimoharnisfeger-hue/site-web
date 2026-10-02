import type { Metadata } from "next";
import Nav from "@/components/ui/Nav";
import LegalPage from "@/components/sections/LegalPage";
import Footer from "@/components/sections/Footer";
import { getHome } from "@/lib/content";
import { legalLinks } from "@/lib/legal-links";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { legal, brand } = await getHome();
  return {
    title: `${legal.mentions.title} — ${brand}`,
    alternates: { canonical: "/mentions-legales" },
    robots: { index: false, follow: true },
  };
}

export default async function Page() {
  const home = await getHome();
  return (
    <>
      <Nav
        brand={home.brand}
        ctaLabel={home.hero.ctaPrimary}
        links={home.nav.items}
        announcement={home.announcement}
        onHome={false}
      />
      <LegalPage page={home.legal.mentions} />
      <Footer
        content={home.footer}
        brand={home.brand}
        links={home.nav.items}
        year={new Date().getFullYear()}
        legalLinks={legalLinks(home)}
        onHome={false}
      />
    </>
  );
}
