import type { FooterContent, NavItem } from "@/lib/types";
import CourtIcon from "@/components/court/CourtIcon";
import ClubPlan from "@/components/sections/ClubPlan";
import ScrollLink from "@/components/ui/ScrollLink";

export default function Footer({
  content,
  brand,
  links,
  year,
  legalLinks,
  onHome = true,
}: {
  content: FooterContent;
  brand: string;
  links: NavItem[];
  /**
   * Calculée sur le serveur et transmise : évaluée au rendu, elle pouvait
   * différer entre serveur et navigateur le 31 décembre.
   */
  year: number;
  legalLinks: { href: string; label: string }[];
  onHome?: boolean;
}) {
  const href = (target: string) => (onHome || !target.startsWith("#") ? target : `/${target}`);
  const tel = content.phone.replace(/[^\d+]/g, "");
  const socials = content.socials.filter((s) => s.url && s.url !== "#");
  const address = [content.addressStreet, [content.addressZip, content.addressCity].filter(Boolean).join(" ")].filter(Boolean);

  return (
    <footer className="bg-turf-deep text-white">
      <div className="container-site">
        {/* Dernier appel */}
        <div className="flex flex-col gap-6 border-b border-white/15 py-14 md:flex-row md:items-end md:justify-between lg:py-20">
          <h2 className="max-w-[18ch] font-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-medium leading-[1.08] tracking-[-0.025em]">
            {content.ctaTitle}
          </h2>
          <ScrollLink
            href={href("#reservation")}
            className="btn self-start bg-white text-turf-deep hover:bg-glass md:self-auto"
          >
            {content.ctaButton} <span aria-hidden="true">→</span>
          </ScrollLink>
        </div>

        <div className="grid gap-12 py-14 lg:grid-cols-12 lg:gap-14 lg:py-16">
          <div className="lg:col-span-6">
            <ClubPlan courts={content.courts} title={content.mapTitle} />
          </div>

          <div
            className={`grid gap-10 lg:col-span-6 ${
              socials.length > 0
                ? "sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.3fr)_minmax(0,0.9fr)]"
                : "sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)]"
            }`}
          >
            <nav aria-label={content.linksTitle}>
              <p className="label text-white/60">{content.linksTitle}</p>
              <ul className="mt-4 space-y-1">
                {links.map((l) => (
                  <li key={l.target}>
                    <ScrollLink
                      href={href(l.target)}
                      className="inline-flex min-h-[36px] items-center text-[15px] text-white/85 transition-colors hover:text-white"
                    >
                      {l.label}
                    </ScrollLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="label text-white/60">{content.contactTitle}</p>
              <ul className="mt-4 space-y-1.5 text-[15px] text-white/85">
                {address.length > 0 && (
                  <li>
                    <address className="not-italic">
                      {address.map((line, i) => (
                        <span key={i} className="block">
                          {line}
                        </span>
                      ))}
                    </address>
                    {content.mapsUrl && (
                      <a
                        href={content.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex min-h-[32px] items-center gap-1 text-white underline underline-offset-4 hover:no-underline"
                      >
                        Itinéraire <span aria-hidden="true">↗</span>
                        <span className="sr-only">(nouvel onglet)</span>
                      </a>
                    )}
                  </li>
                )}
                {content.email && (
                  <li>
                    <a href={`mailto:${content.email}`} className="inline-flex min-h-[32px] items-center [overflow-wrap:anywhere] underline-offset-4 hover:underline">
                      {content.email}
                    </a>
                  </li>
                )}
                {tel && (
                  <li>
                    <a href={`tel:${tel}`} className="inline-flex min-h-[32px] items-center underline-offset-4 hover:underline">
                      {content.phone}
                    </a>
                  </li>
                )}
                {content.hours && <li className="text-white/70">{content.hours}</li>}
              </ul>
            </div>

            {socials.length > 0 && (
              <div>
                <p className="label text-white/60">{content.socialsTitle}</p>
                <ul className="mt-4 space-y-1">
                  {socials.map((s) => (
                    <li key={s.name}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[36px] items-center gap-1 text-[15px] text-white/85 transition-colors hover:text-white"
                      >
                        {s.name} <span aria-hidden="true">↗</span>
                        <span className="sr-only">(nouvel onglet)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/15 py-6 text-[13px] text-white/70 md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-2.5">
            <CourtIcon className="h-[12px] w-[24px]" />
            <span>
              © {year} {brand}. {content.legal}
            </span>
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="inline-flex min-h-[32px] items-center underline underline-offset-4 hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
