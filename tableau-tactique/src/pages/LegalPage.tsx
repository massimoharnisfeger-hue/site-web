import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { fr } from "../lib/typo";
import { club, site } from "../content";

type Props = { page: keyof typeof site.legal };

/** Page légale : colonne de 42 rem, H1 en taille H2, un H3 par section. Les crochets restent visibles. */
export function LegalPage({ page }: Props) {
  const content = site.legal[page];
  useDocumentTitle(`${content.title} — ${club.name}`);

  return (
    <main className="container-site py-[88px] lg:py-[120px]">
      <div className="mx-auto max-w-[42rem]">
        <Link to="/" className="inline-flex min-h-11 items-center text-sm font-medium text-ink transition-colors hover:text-turf">
          {fr(site.ui.backHome)}
        </Link>
        <h1 className="mt-8 text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.08] tracking-[-0.025em]">{fr(content.title)}</h1>
        {content.sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h3>{fr(section.heading)}</h3>
            <p className="mt-3 leading-[1.7]">{fr(section.body)}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
