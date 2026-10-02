import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { HomePage } from "./pages/HomePage";
import { LegalPage } from "./pages/LegalPage";
import { club, site } from "./content";

export default function App() {
  const { pathname, hash } = useLocation();

  // Changement de page sans ancre : on repart du haut.
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <div className="flex min-h-dvh flex-col">
      <Header
        clubName={club.name}
        nav={site.nav}
        navLabel={site.footer.linksTitle}
        cta={site.navCta}
        ctaShort={site.navCtaShort}
        menuLabel={site.ui.menu}
        closeLabel={site.ui.close}
        announcement={site.announcement}
      />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mentions-legales" element={<LegalPage page="mentions" />} />
          <Route path="/confidentialite" element={<LegalPage page="privacy" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer club={club} footer={site.footer} nav={site.nav} legalLinks={site.ui.legalLinks} />
    </div>
  );
}
