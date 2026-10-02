import { Link } from "react-router-dom";
import { MiniCourt } from "../court/MiniCourt";
import { AnchorLink } from "../ui/AnchorLink";
import { fr } from "../../lib/typo";
import { telHref } from "../../lib/format";
import type { Club, Site } from "../../types";

type Props = {
  club: Club;
  footer: Site["footer"];
  nav: Site["nav"];
  legalLinks: Site["ui"]["legalLinks"];
};

const COURT_WIDTH = 19;
const COURT_HEIGHT = 34;

function ClubMap({ courts, highlight, label }: { courts: Site["footer"]["courts"]; highlight: number; label: string }) {
  return (
    <div role="group" aria-label={label} className="relative aspect-[2/1] w-full rounded-[8px] border border-white/15">
      {courts.map((court, index) => (
        <button
          key={court.name}
          type="button"
          className="group absolute flex min-h-11 min-w-11 items-center justify-center rounded-[2px] focus-visible:outline-white"
          style={{ left: `${court.x}%`, top: `${court.y}%`, width: `${COURT_WIDTH}%`, height: `${COURT_HEIGHT}%` }}
        >
          <svg
            viewBox="0 0 20 10"
            aria-hidden="true"
            focusable="false"
            className="h-full w-full overflow-visible text-white/70 transition-colors duration-200 group-hover:text-white group-focus:text-white"
          >
            <rect x=".3" y=".3" width="19.4" height="9.4" rx=".3" fill="none" stroke="currentColor" strokeWidth=".35" />
            <line x1="10" y1="0" x2="10" y2="10" stroke="currentColor" strokeWidth=".45" />
            <text x="1.4" y="2.7" fontFamily="Fragment Mono, ui-monospace, monospace" fontSize="2" fill="currentColor">
              {String(index + 1).padStart(2, "0")}
            </text>
            {index === highlight ? <circle cx="14.2" cy="6.4" r=".85" fill="#DFF24A" stroke="rgba(13,27,42,.35)" strokeWidth=".15" /> : null}
          </svg>
          <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-[4px] bg-white px-2 py-1 text-[12px] font-medium text-turf-deep opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus:opacity-100">
            {fr(court.name)}
          </span>
        </button>
      ))}
    </div>
  );
}

export function Footer({ club, footer, nav, legalLinks }: Props) {
  const socials = club.socials.filter((social) => social.url !== "#");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-turf-deep text-white">
      <div className="container-site py-16 lg:py-24">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-white">{fr(footer.ctaTitle)}</h2>
            <AnchorLink target="#reservation" className="btn btn-white mt-8 focus-visible:outline-white">
              {fr(footer.ctaButton)}
            </AnchorLink>
          </div>
          <ClubMap courts={footer.courts} highlight={footer.highlight} label={footer.mapLabel} />
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-site grid gap-10 py-12 sm:grid-cols-3">
          <div>
            <h3 className="eyebrow text-white/60">{fr(footer.linksTitle)}</h3>
            <ul className="mt-4 grid gap-1">
              {nav.map((item) => (
                <li key={item.target}>
                  <AnchorLink target={item.target} className="inline-flex min-h-11 min-w-11 items-center text-sm text-white/85 transition-colors hover:text-white focus-visible:outline-white">
                    {fr(item.label)}
                  </AnchorLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow text-white/60">{fr(footer.contactTitle)}</h3>
            <address className="mt-4 grid gap-1 text-sm not-italic text-white/85">
              <p>
                {club.street}
                <br />
                {club.zip} {club.city}
              </p>
              <a
                href={club.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 min-w-11 items-center underline underline-offset-2 transition-colors hover:text-white focus-visible:outline-white"
              >
                {fr(footer.directions)}
              </a>
              <a href={`mailto:${club.email}`} className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-white focus-visible:outline-white">
                {club.email}
              </a>
              <a href={telHref(club.phoneIntl)} className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-white focus-visible:outline-white">
                {club.phone}
              </a>
              <p>{fr(club.hours)}</p>
            </address>
          </div>

          {socials.length > 0 ? (
            <div>
              <h3 className="eyebrow text-white/60">{fr(footer.socialsTitle)}</h3>
              <ul className="mt-4 grid gap-1">
                {socials.map((social) => (
                  <li key={social.name}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 min-w-11 items-center text-sm text-white/85 transition-colors hover:text-white focus-visible:outline-white"
                    >
                      {social.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-site flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-6 text-[13px]">
          <div className="flex items-center gap-3">
            <MiniCourt className="text-white" lines="#17417F" />
            <span className="font-display text-[16px] font-medium leading-none">{club.name}</span>
          </div>
          <nav aria-label={`${legalLinks.mentions} · ${legalLinks.privacy}`} className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/mentions-legales" className="inline-flex min-h-11 min-w-11 items-center underline underline-offset-2 text-white/85 hover:text-white focus-visible:outline-white">
              {fr(legalLinks.mentions)}
            </Link>
            <Link to="/confidentialite" className="inline-flex min-h-11 min-w-11 items-center underline underline-offset-2 text-white/85 hover:text-white focus-visible:outline-white">
              {fr(legalLinks.privacy)}
            </Link>
          </nav>
          <p className="text-white/70">
            © {year} {club.name}. {fr(footer.rights)}
          </p>
        </div>
      </div>
    </footer>
  );
}
