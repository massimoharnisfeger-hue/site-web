import { getPayload } from "payload";
import config from "@payload-config";

import { searchPhotos } from "@/lib/unsplash";

import type {
  HeroContent,
  OffresContent,
  ParcoursContent,
  StoryStep,
  ChiffresContent,
  GalerieContent,
  AvisContent,
  ReservationContent,
  FaqContent,
  AnnouncementContent,
  LegalContent,
  NavContent,
  FooterContent,
} from "@/lib/types";

export type HomeContent = {
  seo: { title: string; description: string; keywords: string; ogImage: string };
  brand: string;
  nav: NavContent;
  hero: HeroContent;
  offres: OffresContent;
  parcours: ParcoursContent;
  chiffres: ChiffresContent;
  galerie: GalerieContent;
  avis: AvisContent;
  faq: FaqContent;
  announcement: AnnouncementContent;
  legal: LegalContent;
  reservation: ReservationContent;
  footer: FooterContent;
};

// ---------------------------------------------------------------------------
// Contenu par défaut : ce qui s'affiche tant que rien n'a été modifié dans
// le back-office. Garantit que le site n'est jamais vide.
// ---------------------------------------------------------------------------
export const defaultContent: HomeContent = {
  seo: {
    title: "Padel House — Le jeu commence ici",
    description:
      "Club de padel nouvelle génération. Réservez un terrain, prenez un cours, jouez vos tournois. Initiation, coaching, location de courts et événements.",
    keywords:
      "padel, club de padel, réserver un terrain, cours de padel, tournoi padel",
    ogImage: "",
  },
  brand: "Padel House",
  nav: {
    items: [
      { label: "Offres", target: "#offres" },
      { label: "Le club", target: "#parcours" },
      { label: "Galerie", target: "#galerie" },
      { label: "Avis", target: "#avis" },
    ],
  },
  hero: {
    eyebrow: "Club de padel nouvelle génération",
    title1: "Le jeu",
    title2: "commence ici",
    subtitle:
      "Réservez un terrain, prenez un cours, vibrez à chaque échange. Le padel comme vous ne l'avez jamais vécu — vitré, éclairé, électrique.",
    ctaPrimary: "Réserver un terrain",
    ctaSecondary: "Découvrir le club",
    scrollHint: "C'est parti",
    videoUrl: "",
  },
  offres: {
    eyebrow: "Nos offres",
    title: "Une formule pour chaque joueur",
    intro:
      "Du tout premier échange au tournoi du dimanche, on a le créneau qu'il vous faut. Raquettes prêtées, terrains impeccables, coachs diplômés.",
    items: [
      {
        name: "Initiation Padel",
        tagline: "Vos premiers échanges",
        description:
          "Une séance ludique pour découvrir le padel : prise en main, service, vitrage et premiers points. Encadré par un coach, raquettes fournies.",
        duration: "1h",
        level: "Débutant",
        price: "Dès 25€",
        badge: "",
        ctaLabel: "Réserver mon initiation",
        image:
          "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Cours collectifs",
        tagline: "Progressez à plusieurs",
        description:
          "Des sessions de coaching par niveau pour travailler technique, placement et tactique. Ambiance conviviale et progression garantie.",
        duration: "1h30",
        level: "Tous niveaux",
        price: "Dès 19€/pers.",
        badge: "",
        ctaLabel: "M'inscrire à un cours",
        image:
          "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Location de terrain",
        tagline: "Réservez, jouez",
        description:
          "Un court rien que pour vous et vos partenaires. Terrains indoor et outdoor, vitrés et éclairés, disponibles 7j/7 de 7h à 23h.",
        duration: "1h / 1h30",
        level: "Libre",
        price: "Dès 32€/terrain",
        badge: "La plus demandée",
        ctaLabel: "Réserver un terrain",
        image:
          "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Tournois & ligues",
        tagline: "L'esprit de compétition",
        description:
          "Tournois du week-end, soirées américaines et ligues entre clubs. Tous les niveaux, des lots à gagner et une ambiance électrique.",
        duration: "Demi-journée",
        level: "Compétiteur",
        price: "Dès 15€",
        badge: "",
        ctaLabel: "M'inscrire au tournoi",
        image:
          "https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Padel Corporate",
        tagline: "L'événement d'entreprise",
        description:
          "Team building, séminaires et privatisations. On organise tout : terrains, coachs, animation et catering. Le smash fédérateur idéal.",
        duration: "Sur mesure",
        level: "Entreprise",
        price: "Sur devis",
        badge: "",
        ctaLabel: "Demander un devis",
        image:
          "https://images.unsplash.com/photo-1611251135345-18c56206b863?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  parcours: {
    eyebrow: "Votre parcours",
    ctaLabel: "Réserver un terrain",
    ctaTarget: "#reservation",
    items: [
      {
        step: "01",
        imageAlt: "",
        credit: "",
        creditLink: "",
        subtitle: "Le premier échange",
        title: "Découvrir",
        text: "Poussez la porte du club. Raquette en main, ressentez l'adrénaline du premier échange contre la vitre. Le padel s'apprend en quelques minutes.",
        image:
          "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1400&q=80",
      },
      {
        step: "02",
        imageAlt: "",
        credit: "",
        creditLink: "",
        subtitle: "Avec nos coachs",
        title: "S'entraîner",
        text: "Affûtez votre jeu avec nos coachs : sortie de vitre, bandeja, lob et amorti. Chaque séance, vous sentez vos automatismes progresser.",
        image:
          "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1400&q=80",
      },
      {
        step: "03",
        imageAlt: "",
        credit: "",
        creditLink: "",
        subtitle: "Terrain réservé",
        title: "Jouer",
        text: "Réservez votre terrain, réunissez vos partenaires et vibrez à chaque point. Indoor ou outdoor, le jeu ne s'arrête jamais au club.",
        image:
          "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1400&q=80",
      },
      {
        step: "04",
        imageAlt: "",
        credit: "",
        creditLink: "",
        subtitle: "Tournois & soirées",
        title: "Vibrer",
        text: "Tournois, ligues, soirées : montez en niveau et faites partie de la communauté. Le padel, c'est aussi tout ce qui se passe après le match.",
        image:
          "https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?auto=format&fit=crop&w=1400&q=80",
      },
    ],
  },
  chiffres: {
    title: "La communauté padel grandit chaque jour",
    items: [
      { value: 5000, suffix: "+", label: "Joueurs au club", caption: "depuis l'ouverture" },
      { value: 4.9, suffix: "/5", label: "Note de satisfaction", caption: "" },
      { value: 8, suffix: "", label: "Terrains vitrés", caption: "indoor et outdoor" },
      { value: 40, suffix: "+", label: "Tournois par an", caption: "" },
    ],
  },
  galerie: {
    eyebrow: "En images",
    title: "L'énergie du terrain",
    intro:
      "Faites défiler : les images glissent en profondeur. Cliquez pour un zoom plein écran.",
    items: [
      { src: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=80", alt: "Joueur de padel frappant la balle" },
      { src: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=900&q=80", alt: "Balle de padel sur le terrain" },
      { src: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=900&q=80", alt: "Terrain de padel vitré" },
      { src: "https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?auto=format&fit=crop&w=900&q=80", alt: "Match de padel en double" },
      { src: "https://images.unsplash.com/photo-1611251135345-18c56206b863?auto=format&fit=crop&w=900&q=80", alt: "Raquette et balle de padel" },
      { src: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=900&q=80", alt: "Action de jeu au padel" },
      { src: "https://images.unsplash.com/photo-1617339860293-978cf33cce43?auto=format&fit=crop&w=900&q=80", alt: "Joueuse de padel au service" },
      { src: "https://images.unsplash.com/photo-1530915365347-e35b749a0381?auto=format&fit=crop&w=900&q=80", alt: "Terrain de padel éclairé le soir" },
    ],
  },
  avis: {
    eyebrow: "Ils jouent chez nous",
    title: "La parole aux joueurs",
    items: [
      { name: "Camille R.",
        date: "",
        source: "", role: "Cours collectifs", rating: 5, quote: "J'ai commencé débutante il y a six mois, je dispute déjà mes premiers tournois. Les coachs sont au top et l'ambiance est dingue." },
      { name: "Thomas & Léa",
        date: "",
        source: "", role: "Location de terrain", rating: 5, quote: "On réserve notre terrain chaque semaine en deux clics. Courts impeccables, éclairage parfait le soir. Notre rituel padel préféré." },
      { name: "Sofia M.",
        date: "",
        source: "", role: "Initiation", rating: 5, quote: "Première séance et déjà accro ! En une heure on tape déjà de vrais échanges. Le padel, c'est le sport le plus fun que j'ai testé." },
      { name: "L'équipe Marlow",
        date: "",
        source: "", role: "Padel Corporate", rating: 5, quote: "Notre team-building le plus réussi. Organisation millimétrée, fous rires garantis et tout le monde réclame déjà la revanche." },
    ],
  },
  faq: {
    eyebrow: "Première fois ?",
    title: "Tout ce qu'on vous demande avant de venir",
    intro:
      "Le padel s'apprend en quelques minutes. Voici les réponses aux questions qu'on nous pose le plus souvent au téléphone.",
    items: [
      {
        question: "Faut-il apporter sa raquette ?",
        answer:
          "Non. Les raquettes et les balles sont prêtées avec chaque créneau. Venez en tenue de sport avec des chaussures propres, on s'occupe du reste.",
      },
      {
        question: "Le tarif est-il par personne ou par terrain ?",
        answer:
          "La location de terrain se paie au terrain, quel que soit le nombre de joueurs. Les cours et les initiations se paient par personne.",
      },
      {
        question: "Faut-il être quatre pour jouer ?",
        answer:
          "Le padel se joue à quatre, mais vous n'avez pas besoin d'arriver à quatre : dites-le nous et nous vous mettons en relation avec d'autres joueurs de votre niveau.",
      },
      {
        question: "Je n'ai jamais joué, est-ce que c'est un problème ?",
        answer:
          "Aucun. La majorité de nos visiteurs découvrent le padel chez nous. L'initiation est conçue exactement pour ça : en une heure, vous tapez de vrais échanges.",
      },
      {
        question: "Peut-on annuler une réservation ?",
        answer:
          "Oui, jusqu'à 24 h avant le créneau. Passé ce délai, la séance reste due. Prévenez-nous au plus tôt, on trouve presque toujours une solution.",
      },
      {
        question: "Y a-t-il des vestiaires et des douches ?",
        answer:
          "Oui, vestiaires et douches sont accessibles à tous les joueurs, sans supplément.",
      },
    ],
  },
  announcement: {
    enabled: false,
    text: "Tournoi d'ouverture le 12 octobre — inscriptions ouvertes",
    linkLabel: "Je m'inscris",
    linkTarget: "#reservation",
  },
  legal: {
    mentions: {
      title: "Mentions légales",
      body: `À COMPLÉTER — ce texte est un modèle, remplacez chaque crochet.

Éditeur du site
[Raison sociale], [forme juridique] au capital de [montant] €
Siège social : [adresse complète]
SIRET : [numéro] — RCS [ville]
Téléphone : [numéro] — E-mail : [adresse]
Directeur de la publication : [nom]

Hébergement
Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com

Propriété intellectuelle
L'ensemble des contenus de ce site est protégé. Toute reproduction sans autorisation est interdite. Les photographies de démonstration proviennent d'Unsplash et restent la propriété de leurs auteurs.`,
    },
    privacy: {
      title: "Politique de confidentialité",
      body: `À COMPLÉTER — ce texte est un modèle, remplacez chaque crochet.

Données collectées
Lorsque vous envoyez une demande de réservation, nous recueillons votre nom, votre adresse e-mail et les informations du créneau souhaité. Ces données servent uniquement à traiter votre demande.

Base légale et durée
Le traitement repose sur votre demande. Les données sont conservées [durée] puis supprimées.

Destinataires
Vos données ne sont ni vendues, ni transmises à des tiers à des fins commerciales.

Vos droits
Vous disposez d'un droit d'accès, de rectification, d'effacement et d'opposition. Écrivez à [adresse e-mail] pour l'exercer. Vous pouvez également saisir la CNIL.

Cookies
Ce site ne dépose aucun cookie de mesure d'audience ni de publicité.`,
    },
  },
  reservation: {
    eyebrow: "Réservation",
    title: "Réservez votre terrain",
  },
  footer: {
    ctaTitle: "Prêt à entrer sur le court ?",
    ctaButton: "Réserver un terrain",
    mapTitle: "8 terrains, un seul club",
    linksTitle: "Navigation",
    contactTitle: "Contact",
    socialsTitle: "Suivez-nous",
    email: "bonjour@padel-house.fr",
    phone: "+33 6 00 00 00 00",
    hours: "Ouvert 7j/7 · 7h–23h",
    addressStreet: "",
    addressZip: "",
    addressCity: "",
    mapsUrl: "",
    openingHours: [
      {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "07:00",
        closes: "23:00",
      },
    ],
    legal: "Tous droits réservés.",
    courts: [
      { name: "Court 1 · Indoor", x: 24, y: 40 },
      { name: "Court 2 · Indoor", x: 40, y: 62 },
      { name: "Court 3 · Panoramique", x: 60, y: 34 },
      { name: "Court 4 · Outdoor", x: 78, y: 56 },
      { name: "Court Central", x: 50, y: 48 },
    ],
    socials: [
      { name: "Instagram", url: "#" },
      { name: "TikTok", url: "#" },
      { name: "YouTube", url: "#" },
    ],
  },
};

// ---------------------------------------------------------------------------
// Helpers de fusion : valeur Payload si présente, sinon valeur par défaut.
// ---------------------------------------------------------------------------
type MediaLike = { url?: string | null } | string | number | null | undefined;

/** Renvoie l'URL d'une image uploadée, ou la valeur de secours. */
function imageUrl(value: MediaLike, fallback: string): string {
  if (!value) return fallback;
  if (typeof value === "object" && "url" in value && value.url) return value.url;
  return fallback;
}

/** Renvoie `value` si non vide, sinon `fallback`. */
function str(value: unknown, fallback: string): string {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

function num(value: unknown, fallback: number): number {
  if (value === null || value === undefined || value === ("" as unknown)) return fallback;
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

/** Renvoie un tableau Payload s'il contient des éléments, sinon le défaut. */
function arr<T>(value: unknown, fallback: T[]): unknown[] | T[] {
  if (Array.isArray(value) && value.length > 0) return value;
  return fallback;
}

// ---------------------------------------------------------------------------
// Lecture du contenu depuis Payload, avec repli sur le contenu par défaut.
// ---------------------------------------------------------------------------
/**
 * Photo de chaque étape du parcours, par ordre de priorité :
 *   1. l'image téléversée dans le back-office ;
 *   2. la première photo Unsplash correspondant au mot-clé saisi ;
 *   3. la photo de démonstration.
 * L'appel à Unsplash n'a lieu que pour les étapes sans image téléversée et avec
 * un mot-clé, et son échec est sans conséquence : on retombe sur le défaut.
 */
async function resolveParcoursItems(g: any, d: HomeContent): Promise<StoryStep[]> {
  const raw = arr(g?.parcours?.items, d.parcours.items) as any[];

  const uploaded = raw.map((it) => imageUrl(it.image, ""));
  const queries = raw.map((it, i) => (uploaded[i] ? "" : str(it.unsplashQuery, "")));
  const found = await searchPhotos(queries);

  return raw.map((it, i) => {
    const fallback = d.parcours.items[i];
    const photo = found[i];

    return {
      step: str(it.step, fallback?.step ?? ""),
      title: str(it.title, fallback?.title ?? ""),
      subtitle: str(it.subtitle, fallback?.subtitle ?? ""),
      text: str(it.text, fallback?.text ?? ""),
      image: uploaded[i] || photo?.url || (fallback?.image ?? ""),
      imageAlt: uploaded[i] ? "" : photo?.alt ?? "",
      credit: photo ? photo.creditName : "",
      creditLink: photo ? photo.creditLink : "",
    };
  });
}

export async function getHome(): Promise<HomeContent> {
  let g: Record<string, any> | null = null;
  try {
    const payload = await getPayload({ config });
    g = (await payload.findGlobal({ slug: "home", depth: 2 })) as Record<string, any>;
  } catch {
    // Base de données indisponible (ex. au build sans variables) → défauts.
    return defaultContent;
  }
  if (!g) return defaultContent;

  const d = defaultContent;
  const parcoursItems = await resolveParcoursItems(g, d);

  return {
    seo: {
      title: str(g.seo?.title, d.seo.title),
      description: str(g.seo?.description, d.seo.description),
      keywords: str(g.seo?.keywords, d.seo.keywords),
      ogImage: imageUrl(g.seo?.ogImage, d.seo.ogImage),
    },
    brand: str(g.brand, d.brand),
    nav: {
      items: (arr(g.nav?.items, d.nav.items) as any[]).map((it, i) => ({
        label: str(it.label, d.nav.items[i]?.label ?? ""),
        target: str(it.target, d.nav.items[i]?.target ?? "#offres"),
      })),
    },
    hero: {
      eyebrow: str(g.hero?.eyebrow, d.hero.eyebrow),
      title1: str(g.hero?.title1, d.hero.title1),
      title2: str(g.hero?.title2, d.hero.title2),
      subtitle: str(g.hero?.subtitle, d.hero.subtitle),
      ctaPrimary: str(g.hero?.ctaPrimary, d.hero.ctaPrimary),
      ctaSecondary: str(g.hero?.ctaSecondary, d.hero.ctaSecondary),
      scrollHint: str(g.hero?.scrollHint, d.hero.scrollHint),
      videoUrl: str(g.hero?.videoUrl, d.hero.videoUrl || ""),
    },
    offres: {
      eyebrow: str(g.offres?.eyebrow, d.offres.eyebrow),
      title: str(g.offres?.title, d.offres.title),
      intro: str(g.offres?.intro, d.offres.intro),
      items: (arr(g.offres?.items, d.offres.items) as any[]).map((it, i) => ({
        name: str(it.name, d.offres.items[i]?.name ?? ""),
        tagline: str(it.tagline, d.offres.items[i]?.tagline ?? ""),
        description: str(it.description, d.offres.items[i]?.description ?? ""),
        duration: str(it.duration, d.offres.items[i]?.duration ?? ""),
        level: str(it.level, d.offres.items[i]?.level ?? ""),
        price: str(it.price, d.offres.items[i]?.price ?? ""),
        badge: str(it.badge, d.offres.items[i]?.badge ?? ""),
        ctaLabel: str(it.ctaLabel, d.offres.items[i]?.ctaLabel ?? ""),
        image: imageUrl(it.image, d.offres.items[i]?.image ?? ""),
      })),
    },
    parcours: {
      eyebrow: str(g.parcours?.eyebrow, d.parcours.eyebrow),
      ctaLabel: str(g.parcours?.ctaLabel, d.parcours.ctaLabel),
      ctaTarget: str(g.parcours?.ctaTarget, d.parcours.ctaTarget),
      items: parcoursItems,
    },
    chiffres: {
      title: str(g.chiffres?.title, d.chiffres.title),
      items: (arr(g.chiffres?.items, d.chiffres.items) as any[]).map((it, i) => ({
        value: num(it.value, d.chiffres.items[i]?.value ?? 0),
        suffix: str(it.suffix, d.chiffres.items[i]?.suffix ?? ""),
        label: str(it.label, d.chiffres.items[i]?.label ?? ""),
        caption: str(it.caption, d.chiffres.items[i]?.caption ?? ""),
      })),
    },
    galerie: {
      eyebrow: str(g.galerie?.eyebrow, d.galerie.eyebrow),
      title: str(g.galerie?.title, d.galerie.title),
      intro: str(g.galerie?.intro, d.galerie.intro),
      items: (arr(g.galerie?.items, d.galerie.items) as any[]).map((it, i) => ({
        src: imageUrl(it.src, d.galerie.items[i]?.src ?? ""),
        alt: str(it.alt, d.galerie.items[i]?.alt ?? ""),
      })),
    },
    avis: {
      eyebrow: str(g.avis?.eyebrow, d.avis.eyebrow),
      title: str(g.avis?.title, d.avis.title),
      items: (arr(g.avis?.items, d.avis.items) as any[]).map((it, i) => ({
        name: str(it.name, d.avis.items[i]?.name ?? ""),
        role: str(it.role, d.avis.items[i]?.role ?? ""),
        rating: num(it.rating, d.avis.items[i]?.rating ?? 5),
        quote: str(it.quote, d.avis.items[i]?.quote ?? ""),
        date: str(it.date, d.avis.items[i]?.date ?? ""),
        source: str(it.source, d.avis.items[i]?.source ?? ""),
      })),
    },
    faq: {
      eyebrow: str(g.faq?.eyebrow, d.faq.eyebrow),
      title: str(g.faq?.title, d.faq.title),
      intro: str(g.faq?.intro, d.faq.intro),
      items: (arr(g.faq?.items, d.faq.items) as any[]).map((it, i) => ({
        question: str(it.question, d.faq.items[i]?.question ?? ""),
        answer: str(it.answer, d.faq.items[i]?.answer ?? ""),
      })),
    },
    announcement: {
      enabled: bool(g.announcement?.enabled, d.announcement.enabled),
      text: str(g.announcement?.text, d.announcement.text),
      linkLabel: str(g.announcement?.linkLabel, d.announcement.linkLabel),
      linkTarget: str(g.announcement?.linkTarget, d.announcement.linkTarget),
    },
    legal: {
      mentions: {
        title: str(g.legal?.mentions?.title, d.legal.mentions.title),
        body: str(g.legal?.mentions?.body, d.legal.mentions.body),
      },
      privacy: {
        title: str(g.legal?.privacy?.title, d.legal.privacy.title),
        body: str(g.legal?.privacy?.body, d.legal.privacy.body),
      },
    },
    reservation: {
      eyebrow: str(g.reservation?.eyebrow, d.reservation.eyebrow),
      title: str(g.reservation?.title, d.reservation.title),
    },
    footer: {
      ctaTitle: str(g.footer?.ctaTitle, d.footer.ctaTitle),
      ctaButton: str(g.footer?.ctaButton, d.footer.ctaButton),
      mapTitle: str(g.footer?.mapTitle, d.footer.mapTitle),
      linksTitle: str(g.footer?.linksTitle, d.footer.linksTitle),
      contactTitle: str(g.footer?.contactTitle, d.footer.contactTitle),
      socialsTitle: str(g.footer?.socialsTitle, d.footer.socialsTitle),
      email: str(g.footer?.email, d.footer.email),
      phone: str(g.footer?.phone, d.footer.phone),
      hours: str(g.footer?.hours, d.footer.hours),
      addressStreet: str(g.footer?.addressStreet, d.footer.addressStreet),
      addressZip: str(g.footer?.addressZip, d.footer.addressZip),
      addressCity: str(g.footer?.addressCity, d.footer.addressCity),
      mapsUrl: str(g.footer?.mapsUrl, d.footer.mapsUrl),
      openingHours: (arr(g.footer?.openingHours, d.footer.openingHours) as any[]).map((it, i) => ({
        days: Array.isArray(it.days) && it.days.length
          ? (it.days as string[])
          : d.footer.openingHours[i]?.days ?? [],
        opens: str(it.opens, d.footer.openingHours[i]?.opens ?? ""),
        closes: str(it.closes, d.footer.openingHours[i]?.closes ?? ""),
      })),
      legal: str(g.footer?.legal, d.footer.legal),
      courts: (arr(g.footer?.courts, d.footer.courts) as any[]).map((it, i) => ({
        name: str(it.name, d.footer.courts[i]?.name ?? ""),
        x: num(it.x, d.footer.courts[i]?.x ?? 50),
        y: num(it.y, d.footer.courts[i]?.y ?? 50),
      })),
      socials: (arr(g.footer?.socials, d.footer.socials) as any[]).map((it, i) => ({
        name: str(it.name, d.footer.socials[i]?.name ?? ""),
        url: str(it.url, d.footer.socials[i]?.url ?? "#"),
      })),
    },
  };
}
