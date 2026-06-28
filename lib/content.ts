import { getPayload } from "payload";
import config from "@payload-config";

import type {
  HeroContent,
  OffresContent,
  ParcoursContent,
  ChiffresContent,
  GalerieContent,
  AvisContent,
  ReservationContent,
  FooterContent,
} from "@/lib/types";

export type HomeContent = {
  seo: { title: string; description: string; keywords: string; ogImage: string };
  brand: string;
  hero: HeroContent;
  offres: OffresContent;
  parcours: ParcoursContent;
  chiffres: ChiffresContent;
  galerie: GalerieContent;
  avis: AvisContent;
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
  hero: {
    eyebrow: "Club de padel nouvelle génération",
    title1: "Le jeu",
    title2: "commence ici",
    subtitle:
      "Réservez un terrain, prenez un cours, vibrez à chaque échange. Le padel comme vous ne l'avez jamais vécu — vitré, éclairé, électrique.",
    ctaPrimary: "Réserver un terrain",
    ctaSecondary: "Découvrir le club",
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
        image:
          "https://images.unsplash.com/photo-1611251135345-18c56206b863?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  parcours: {
    eyebrow: "Votre parcours",
    items: [
      {
        step: "01",
        title: "Découvrir",
        text: "Poussez la porte du club. Raquette en main, ressentez l'adrénaline du premier échange contre la vitre. Le padel s'apprend en quelques minutes.",
        image:
          "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1400&q=80",
      },
      {
        step: "02",
        title: "S'entraîner",
        text: "Affûtez votre jeu avec nos coachs : sortie de vitre, bandeja, lob et amorti. Chaque séance, vous sentez vos automatismes progresser.",
        image:
          "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1400&q=80",
      },
      {
        step: "03",
        title: "Jouer",
        text: "Réservez votre terrain, réunissez vos partenaires et vibrez à chaque point. Indoor ou outdoor, le jeu ne s'arrête jamais au club.",
        image:
          "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1400&q=80",
      },
      {
        step: "04",
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
      { value: 5000, suffix: "+", label: "Joueurs au club" },
      { value: 4.9, suffix: "/5", label: "Note de satisfaction" },
      { value: 8, suffix: "", label: "Terrains vitrés" },
      { value: 40, suffix: "+", label: "Tournois par an" },
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
      { name: "Camille R.", role: "Cours collectifs", rating: 5, quote: "J'ai commencé débutante il y a six mois, je dispute déjà mes premiers tournois. Les coachs sont au top et l'ambiance est dingue." },
      { name: "Thomas & Léa", role: "Location de terrain", rating: 5, quote: "On réserve notre terrain chaque semaine en deux clics. Courts impeccables, éclairage parfait le soir. Notre rituel padel préféré." },
      { name: "Sofia M.", role: "Initiation", rating: 5, quote: "Première séance et déjà accro ! En une heure on tape déjà de vrais échanges. Le padel, c'est le sport le plus fun que j'ai testé." },
      { name: "L'équipe Marlow", role: "Padel Corporate", rating: 5, quote: "Notre team-building le plus réussi. Organisation millimétrée, fous rires garantis et tout le monde réclame déjà la revanche." },
    ],
  },
  reservation: {
    eyebrow: "Réservation",
    title: "Réservez votre terrain",
  },
  footer: {
    ctaTitle: "Prêt à entrer sur le court ?",
    ctaButton: "Réserver un terrain",
    mapTitle: "8 terrains, un seul club",
    email: "bonjour@padel-house.fr",
    phone: "+33 6 00 00 00 00",
    hours: "Ouvert 7j/7 · 7h–23h",
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

/** Renvoie un tableau Payload s'il contient des éléments, sinon le défaut. */
function arr<T>(value: unknown, fallback: T[]): unknown[] | T[] {
  if (Array.isArray(value) && value.length > 0) return value;
  return fallback;
}

// ---------------------------------------------------------------------------
// Lecture du contenu depuis Payload, avec repli sur le contenu par défaut.
// ---------------------------------------------------------------------------
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

  return {
    seo: {
      title: str(g.seo?.title, d.seo.title),
      description: str(g.seo?.description, d.seo.description),
      keywords: str(g.seo?.keywords, d.seo.keywords),
      ogImage: imageUrl(g.seo?.ogImage, d.seo.ogImage),
    },
    brand: str(g.brand, d.brand),
    hero: {
      eyebrow: str(g.hero?.eyebrow, d.hero.eyebrow),
      title1: str(g.hero?.title1, d.hero.title1),
      title2: str(g.hero?.title2, d.hero.title2),
      subtitle: str(g.hero?.subtitle, d.hero.subtitle),
      ctaPrimary: str(g.hero?.ctaPrimary, d.hero.ctaPrimary),
      ctaSecondary: str(g.hero?.ctaSecondary, d.hero.ctaSecondary),
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
        image: imageUrl(it.image, d.offres.items[i]?.image ?? ""),
      })),
    },
    parcours: {
      eyebrow: str(g.parcours?.eyebrow, d.parcours.eyebrow),
      items: (arr(g.parcours?.items, d.parcours.items) as any[]).map((it, i) => ({
        step: str(it.step, d.parcours.items[i]?.step ?? ""),
        title: str(it.title, d.parcours.items[i]?.title ?? ""),
        text: str(it.text, d.parcours.items[i]?.text ?? ""),
        image: imageUrl(it.image, d.parcours.items[i]?.image ?? ""),
      })),
    },
    chiffres: {
      title: str(g.chiffres?.title, d.chiffres.title),
      items: (arr(g.chiffres?.items, d.chiffres.items) as any[]).map((it, i) => ({
        value: num(it.value, d.chiffres.items[i]?.value ?? 0),
        suffix: str(it.suffix, d.chiffres.items[i]?.suffix ?? ""),
        label: str(it.label, d.chiffres.items[i]?.label ?? ""),
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
      })),
    },
    reservation: {
      eyebrow: str(g.reservation?.eyebrow, d.reservation.eyebrow),
      title: str(g.reservation?.title, d.reservation.title),
    },
    footer: {
      ctaTitle: str(g.footer?.ctaTitle, d.footer.ctaTitle),
      ctaButton: str(g.footer?.ctaButton, d.footer.ctaButton),
      mapTitle: str(g.footer?.mapTitle, d.footer.mapTitle),
      email: str(g.footer?.email, d.footer.email),
      phone: str(g.footer?.phone, d.footer.phone),
      hours: str(g.footer?.hours, d.footer.hours),
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
