import { cache } from "react";
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
    title: "Padel House — Club de padel à Lyon",
    description:
      "Club de padel à Lyon 8e : 8 terrains vitrés indoor et outdoor, ouverts 7j/7 de 7h à 23h. Initiation, cours collectifs, location de terrain et tournois.",
    keywords:
      "padel Lyon, club de padel Lyon, réserver terrain padel Lyon, cours de padel Lyon, padel indoor Lyon",
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
      body: `Éditeur du site

Padel House, société par actions simplifiée au capital de 25 000 €.
Siège social : 18 rue des Frères Lumière, 69008 Lyon, France.
SIRET : 123 456 789 00011 — RCS Lyon 123 456 789.
TVA intracommunautaire : FR00123456789.
Téléphone : 04 26 68 12 34 — E-mail : contact@padel-house.fr
Directeur de la publication : Massimo Harnisfeger.

Hébergement

Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
https://vercel.com

Base de données hébergée par MongoDB Atlas, région Europe (Francfort).

Propriété intellectuelle

L'ensemble des contenus de ce site — textes, mise en page, identité visuelle —
est la propriété de Padel House. Toute reproduction, même partielle, sans
autorisation écrite préalable est interdite.

Les photographies proviennent d'Unsplash et restent la propriété de leurs
auteurs, crédités au pied de chaque visuel concerné.

Médiation de la consommation

Conformément à l'article L612-1 du Code de la consommation, tout client peut
recourir gratuitement à un médiateur de la consommation en vue de la résolution
amiable d'un litige. Le médiateur compétent est indiqué sur simple demande à
contact@padel-house.fr.`,
    },
    privacy: {
      title: "Politique de confidentialité",
      body: `Responsable du traitement

Padel House, 18 rue des Frères Lumière, 69008 Lyon.
Contact : contact@padel-house.fr

Ce que nous collectons, et ce que nous ne collectons pas

Le formulaire de réservation de ce site n'enregistre rien. Les informations que
vous saisissez — nom, e-mail, téléphone, créneau souhaité — restent dans votre
navigateur le temps de composer le message que vous nous envoyez vous-même
depuis votre messagerie. Elles disparaissent dès que vous fermez la page.

Aucune base de données du site ne conserve vos coordonnées, aucun journal
serveur ne les enregistre, aucun prestataire tiers n'y a accès.

Les demandes que nous recevons

Une fois votre message envoyé, il arrive dans notre boîte e-mail comme tout
courrier. Nous l'utilisons uniquement pour vous rappeler et organiser votre
venue. Nous conservons ces échanges trois ans à compter du dernier contact,
puis nous les supprimons.

Base légale : votre demande elle-même, et notre intérêt légitime à y répondre.

Vos droits

Vous pouvez à tout moment demander l'accès à vos données, leur rectification,
leur effacement, ou vous opposer à leur traitement. Écrivez à
contact@padel-house.fr : nous répondons sous un mois.

En cas de désaccord, vous pouvez saisir la CNIL — 3 place de Fontenoy,
TSA 80715, 75334 Paris Cedex 07, www.cnil.fr

Cookies et mesure d'audience

Ce site ne dépose aucun cookie. Aucun outil de mesure d'audience, aucun
traceur publicitaire, aucun bouton de réseau social n'y est installé. C'est
pourquoi aucune bannière de consentement ne vous est présentée.`,
    },
  },
  reservation: {
    eyebrow: "Réservation",
    title: "Réservez votre terrain",
    ctaLabel: "Préparer ma demande",
    responseDelay: "sous 24 h ouvrées",
    finalTitle: "Votre demande est prête",
    finalBody:
      "Envoyez le message ci-dessous au club. Nous vous rappelons {delai} pour bloquer le créneau. Aucun terrain n'est retenu avant ce rappel.",
    paymentNote: "Aucun paiement en ligne : le règlement se fait sur place.",
    privacyNote:
      "Vos coordonnées ne sont pas enregistrées : elles servent uniquement à composer le message que vous enverrez vous-même.",
    steps: ["Formule", "Créneau", "Coordonnées", "Votre message"],
  },
  footer: {
    ctaTitle: "Prêt à entrer sur le court ?",
    ctaButton: "Réserver un terrain",
    mapTitle: "8 terrains, un seul club",
    linksTitle: "Navigation",
    contactTitle: "Contact",
    socialsTitle: "Suivez-nous",
    email: "contact@padel-house.fr",
    phone: "04 26 68 12 34",
    hours: "Ouvert 7j/7 · 7h–23h",
    addressStreet: "18 rue des Frères Lumière",
    addressZip: "69008",
    addressCity: "Lyon",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=18+rue+des+Fr%C3%A8res+Lumi%C3%A8re+69008+Lyon",
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
type MediaSizes = { card?: { url?: string | null }; thumbnail?: { url?: string | null } };
type MediaLike =
  | { url?: string | null; alt?: string | null; sizes?: MediaSizes | null }
  | string
  | number
  | null
  | undefined;

/**
 * Renvoie l'URL d'une image téléversée, ou la valeur de secours.
 *
 * `collections/Media.ts` fait générer par sharp une variante « card » de
 * 1200 px à chaque envoi. On la sert de préférence à l'original : une photo
 * prise au téléphone fait couramment 4000 px et 5 Mo, et c'est ce fichier-là qui
 * partait jusqu'ici dans une vignette de 167 px.
 */
function imageUrl(value: MediaLike, fallback: string): string {
  if (!value) return fallback;
  if (typeof value !== "object") return fallback;
  return value.sizes?.card?.url || value.url || fallback;
}

/** Texte alternatif saisi avec l'image dans la bibliothèque de médias. */
function imageAlt(value: MediaLike, fallback: string): string {
  if (!value || typeof value !== "object") return fallback;
  return value.alt || fallback;
}

/** Renvoie `value` si non vide, sinon `fallback`. */
function str(value: unknown, fallback: string): string {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

/**
 * Comme `str`, mais un champ **vidé volontairement** reste vide.
 *
 * Réservé aux informations factuelles : coordonnées, adresse, mentions légales.
 * Pour ces champs-là, `str` avait un effet pervers — le club sans ligne fixe qui
 * effaçait le téléphone voyait réapparaître le numéro de démonstration, et
 * l'éditeur qui vidait les mentions légales pour les réécrire republiait le
 * SIRET fictif. Le principe II (« le site ne doit jamais être vide ») protège du
 * silence de la base, pas d'un effacement délibéré : `undefined` et `null`
 * retombent donc sur le repli, `""` non.
 */
function strOrEmpty(value: unknown, fallback: string): string {
  if (value === null || value === undefined) return fallback;
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
      // Le texte alternatif saisi avec la photo dans la bibliothèque de médias
      // était jusqu'ici jeté dès qu'une image était téléversée : le carrousel
      // retombait alors sur le titre de l'étape, déjà lu juste en dessous.
      imageAlt: uploaded[i]
        ? imageAlt(raw[i].image, "")
        : photo?.alt ?? (fallback?.imageAlt ?? ""),
      credit: photo ? photo.creditName : "",
      creditLink: photo ? photo.creditLink : "",
    };
  });
}

/**
 * Lecture du contenu, mémoïsée le temps d'une requête.
 *
 * `generateMetadata` et le composant de page appelaient chacun `getHome()` :
 * chaque affichage déclenchait donc deux lectures MongoDB et deux séries de
 * recherches Unsplash, y compris pour les pages légales qui n'affichent aucune
 * photo. `cache` de React les ramène à une seule, sans rien changer aux
 * appelants.
 */
export const getHome = cache(async (): Promise<HomeContent> => {
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
        // Le texte alternatif saisi sur l'image elle-même sert de repli au
        // champ de la galerie : l'éditeur n'a plus à le retaper.
        alt: str(
          it.alt,
          imageAlt(it.src, d.galerie.items[i]?.alt ?? "")
        ),
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
        body: strOrEmpty(g.legal?.mentions?.body, d.legal.mentions.body),
      },
      privacy: {
        title: str(g.legal?.privacy?.title, d.legal.privacy.title),
        body: strOrEmpty(g.legal?.privacy?.body, d.legal.privacy.body),
      },
    },
    reservation: {
      eyebrow: str(g.reservation?.eyebrow, d.reservation.eyebrow),
      title: str(g.reservation?.title, d.reservation.title),
      ctaLabel: str(g.reservation?.ctaLabel, d.reservation.ctaLabel),
      responseDelay: str(g.reservation?.responseDelay, d.reservation.responseDelay),
      finalTitle: str(g.reservation?.finalTitle, d.reservation.finalTitle),
      finalBody: str(g.reservation?.finalBody, d.reservation.finalBody),
      paymentNote: str(g.reservation?.paymentNote, d.reservation.paymentNote),
      privacyNote: str(g.reservation?.privacyNote, d.reservation.privacyNote),
      steps: (arr(g.reservation?.steps, d.reservation.steps) as any[]).map((it, i) =>
        typeof it === "string" ? it : str(it?.label, d.reservation.steps[i] ?? "")
      ),
    },
    footer: {
      ctaTitle: str(g.footer?.ctaTitle, d.footer.ctaTitle),
      ctaButton: str(g.footer?.ctaButton, d.footer.ctaButton),
      mapTitle: str(g.footer?.mapTitle, d.footer.mapTitle),
      linksTitle: str(g.footer?.linksTitle, d.footer.linksTitle),
      contactTitle: str(g.footer?.contactTitle, d.footer.contactTitle),
      socialsTitle: str(g.footer?.socialsTitle, d.footer.socialsTitle),
      email: strOrEmpty(g.footer?.email, d.footer.email),
      phone: strOrEmpty(g.footer?.phone, d.footer.phone),
      hours: str(g.footer?.hours, d.footer.hours),
      addressStreet: strOrEmpty(g.footer?.addressStreet, d.footer.addressStreet),
      addressZip: strOrEmpty(g.footer?.addressZip, d.footer.addressZip),
      addressCity: strOrEmpty(g.footer?.addressCity, d.footer.addressCity),
      mapsUrl: strOrEmpty(g.footer?.mapsUrl, d.footer.mapsUrl),
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
});
