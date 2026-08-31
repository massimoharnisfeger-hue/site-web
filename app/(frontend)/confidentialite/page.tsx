import type { Metadata } from "next";
import LegalPage from "@/components/sections/LegalPage";
import { getHome } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { legal, brand } = await getHome();
  return {
    title: `${legal.privacy.title} — ${brand}`,
    robots: { index: false, follow: true },
  };
}

export default async function Page() {
  const { legal, brand } = await getHome();
  return <LegalPage page={legal.privacy} brand={brand} />;
}
