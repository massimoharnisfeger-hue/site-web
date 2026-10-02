import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";

import { searchPhotos } from "@/lib/unsplash";

import type {
  HeroContent,
  SequenceContent,
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
  PartenairesContent,
  AbonnementsContent,
  EquipementsContent,
  EquipementIcon,
  CoachsContent,
  BandeauContent,
} from "@/lib/types";

export type HomeContent = {
  seo: { title: string; description: string; keywords: string; ogImage: string };
  brand: string;
  nav: NavContent;
  hero: HeroContent;
  sequence: SequenceContent;
  offres: OffresContent;
  abonnements: AbonnementsContent;
  parcours: ParcoursContent;
  equipements: EquipementsContent;
  coachs: CoachsContent;
  chiffres: ChiffresContent;
  partenaires: PartenairesContent;
  galerie: GalerieContent;
  avis: AvisContent;
  faq: FaqContent;
  bandeau: BandeauContent;
  announcement: AnnouncementContent;
  legal: LegalContent;
  reservation: ReservationContent;
  footer: FooterContent;
};

// ---------------------------------------------------------------------------
// Contenu par défaut : ce qui s'affiche tant que rien n'a été modifié dans
// le back-office. Garantit que le site n'est jamais vide.
// ---------------------------------------------------------------------------
/** Photo Pexels de démonstration (licence Pexels : gratuite, usage commercial autorisé). */
const pexels = (id: number, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

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
      { label: "Abonnements", target: "#abonnements" },
      { label: "Le club", target: "#club" },
      { label: "Galerie", target: "#galerie" },
      { label: "Avis", target: "#avis" },
    ],
  },
  hero: {
    eyebrow: "Club de padel · Lyon 8e",
    title1: "Le jeu",
    title2: "commence ici",
    subtitle:
      "Réservez un terrain, prenez un cours, vibrez à chaque échange. Huit terrains vitrés, ouverts tous les jours de 7h à 23h.",
    ctaPrimary: "Réserver un terrain",
    ctaSecondary: "Découvrir le club",
    scrollHint: "Faites défiler",
    skipLabel: "Passer la séquence",
  },
  sequence: {
    steps: [
      {
        label: "01 · La raquette",
        title: "Un tamis plein, perforé",
        text: "Pas de cordage au padel : la raquette est pleine, percée, et mesure 38 mm d'épaisseur au plus.",
      },
      {
        label: "02 · Le service",
        title: "À la cuillère, en diagonale",
        text: "On laisse rebondir la balle, on la frappe sous la ceinture, et on vise le carré de service d'en face.",
      },
      {
        label: "03 · Le court",
        title: "20 mètres sur 10, entourés de vitres",
        text: "Après le rebond au sol, la balle peut toucher les vitres : elles font partie du jeu.",
      },
    ],
    figureLabel: "Fig. 1",
    figureTitle: "La sortie de vitre",
    figureCaption:
      "La balle rebondit au sol, touche la vitre du fond, puis revient en jeu : J3 la reprend après le rebond.",
    dimLength: "20 m",
    dimWidth: "10 m",
    dimService: "6,95 m",
    players: "J1, J2, J3, J4",
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
          "Une séance ludique pour découvrir le padel : prise en main, service, vitrage et premiers points. Encadrée par un coach, raquettes fournies.",
        duration: "1 h",
        level: "Débutant",
        price: "Dès 25 €",
        badge: "",
        ctaLabel: "Réserver mon initiation",
        image: pexels(35248374),
        imageFocus: "center",
        imageAlt: "Joueuse sur un court de padel bleu en salle, balle en main, prête à servir",
        playersLeft: 1,
        playersRight: 0,
        coach: true,
      },
      {
        name: "Cours collectifs",
        tagline: "Progressez à plusieurs",
        description:
          "Des sessions par niveau pour travailler technique, placement et tactique, dans une ambiance conviviale.",
        duration: "1 h 30",
        level: "Tous niveaux",
        price: "Dès 19 € / pers.",
        badge: "",
        ctaLabel: "M'inscrire à un cours",
        image: pexels(35248501),
        imageFocus: "center",
        imageAlt: "Quatre joueuses alignées sur un court de padel en salle, raquette en main",
        playersLeft: 3,
        playersRight: 0,
        coach: true,
      },
      {
        name: "Location de terrain",
        tagline: "Réservez, jouez",
        description:
          "Un court rien que pour vous et vos partenaires, vitré et éclairé, disponible 7j/7 de 7h à 23h.",
        duration: "1 h ou 1 h 30",
        level: "Libre",
        price: "Dès 32 € / terrain",
        badge: "La plus demandée",
        ctaLabel: "Réserver un terrain",
        image: pexels(32897040),
        imageFocus: "bottom",
        imageAlt: "Raquette et balles de padel posées au pied du filet, sur un court éclairé",
        playersLeft: 2,
        playersRight: 2,
        coach: false,
      },
      {
        name: "Tournois & ligues",
        tagline: "L'esprit de compétition",
        description:
          "Tournois du week-end, soirées américaines et ligues entre clubs. Tous les niveaux, des lots à gagner.",
        duration: "Demi-journée",
        level: "Compétiteur",
        price: "Dès 15 €",
        badge: "",
        ctaLabel: "M'inscrire au tournoi",
        image: pexels(37980449),
        imageFocus: "top",
        imageAlt: "Joueur de padel en plein smash, photo en noir et blanc",
        playersLeft: 2,
        playersRight: 2,
        coach: false,
      },
      {
        name: "Padel Corporate",
        tagline: "L'événement d'entreprise",
        description:
          "Team building, séminaires et privatisations. On organise tout : terrains, coachs, animation et repas.",
        duration: "Sur mesure",
        level: "Entreprise",
        price: "Sur devis",
        badge: "",
        ctaLabel: "Demander un devis",
        image: pexels(34079998),
        imageFocus: "center",
        imageAlt: "Joueuses en plein échange de part et d'autre du filet",
        playersLeft: 2,
        playersRight: 2,
        coach: true,
      },
    ],
  },
  parcours: {
    eyebrow: "Le club",
    title: "Le club en quatre temps",
    intro:
      "On pousse la porte pour essayer, on revient pour progresser, puis on ne compte plus ses soirées au club.",
    ctaLabel: "Réserver un terrain",
    ctaTarget: "#reservation",
    items: [
      {
        step: "01",
        imageAlt: "Raquette et balle de padel posées sur un court bleu, près du filet",
        credit: "",
        creditLink: "",
        subtitle: "Le premier échange",
        title: "Découvrir",
        text: "Poussez la porte du club. Raquette en main, ressentez l'adrénaline du premier échange contre la vitre. Le padel s'apprend en quelques minutes.",
        image: pexels(31012869, 1600),
      },
      {
        step: "02",
        imageAlt: "Joueuse concentrée qui frappe la balle sur un court de padel intérieur",
        credit: "",
        creditLink: "",
        subtitle: "Avec nos coachs",
        title: "S'entraîner",
        text: "Affûtez votre jeu avec nos coachs : sortie de vitre, bandeja, lob et amorti. Chaque séance, vous sentez vos automatismes progresser.",
        image: pexels(35248286, 1600),
      },
      {
        step: "03",
        imageAlt: "Joueuse en plein échange sur un court de padel bleu",
        credit: "",
        creditLink: "",
        subtitle: "Terrain réservé",
        title: "Jouer",
        text: "Réservez votre terrain, réunissez vos partenaires et vibrez à chaque point. Indoor ou outdoor, le jeu ne s'arrête jamais au club.",
        image: pexels(35248475, 1600),
      },
      {
        step: "04",
        imageAlt: "Joueuse de padel souriante, raquette en main, sous les lumières du club",
        credit: "",
        creditLink: "",
        subtitle: "Tournois & soirées",
        title: "Vibrer",
        text: "Tournois, ligues, soirées : montez en niveau et faites partie de la communauté. Le padel, c'est aussi tout ce qui se passe après le match.",
        image: pexels(33641987, 1600),
      },
    ],
  },
  // Des faits vérifiables, tirés des offres et de la FAQ : pas de promesse
  // chiffrée qu'on ne pourrait pas prouver.
  chiffres: {
    title: "Le club en chiffres",
    items: [
      { value: 8, suffix: "", label: "Terrains vitrés", caption: "indoor et outdoor" },
      { value: 16, suffix: " h", label: "D'ouverture par jour", caption: "de 7h à 23h, 7j/7" },
      { value: 0, suffix: " €", label: "De location de raquette", caption: "balles comprises" },
      { value: 24, suffix: " h", label: "Pour annuler sans frais", caption: "avant le créneau" },
    ],
  },
  // Partenaires : par défaut, des catégories génériques clairement marquées
  // « exemples ». On n'invente aucune marque réelle — le club téléverse ses
  // vrais logos depuis /admin et décoche « exemples ».
  partenaires: {
    title: "Nos partenaires",
    examples: true,
    examplesNote: "Partenaires d'exemple — ajoutez les vôtres dans l'espace d'administration.",
    items: [
      { name: "Équipementier", logo: "", url: "" },
      { name: "Cordage", logo: "", url: "" },
      { name: "Textile", logo: "", url: "" },
      { name: "Boissons", logo: "", url: "" },
      { name: "Média local", logo: "", url: "" },
      { name: "Assurance", logo: "", url: "" },
    ],
  },
  // Abonnements : tarifs d'exemple, à vérifier par le club (comme les avis).
  abonnements: {
    eyebrow: "Abonnements",
    title: "Jouez toute l'année",
    intro:
      "Pour celles et ceux qui reviennent chaque semaine : des formules au mois, sans engagement. Réservez en priorité, à tarif réduit.",
    examples: true,
    examplesNote: "Tarifs d'exemple, à confirmer par le club.",
    monthlyLabel: "Au mois",
    yearlyLabel: "À l'année",
    yearlyNote: "2 mois offerts",
    items: [
      {
        name: "Découverte",
        tagline: "Pour jouer de temps en temps",
        priceMonthly: "19 €",
        priceYearly: "190 €",
        priceNote: "/ mois",
        featured: false,
        badge: "",
        ctaLabel: "Choisir Découverte",
        features: ["−10 % sur la location", "Réservation 5 jours à l'avance", "Prêt de raquette inclus"],
      },
      {
        name: "Passion",
        tagline: "Le bon rythme, chaque semaine",
        priceMonthly: "39 €",
        priceYearly: "390 €",
        priceNote: "/ mois",
        featured: true,
        badge: "La plus choisie",
        ctaLabel: "Choisir Passion",
        features: [
          "−25 % sur la location",
          "Réservation 8 jours à l'avance",
          "Prêt de raquette inclus",
          "1 cours collectif / mois offert",
        ],
      },
      {
        name: "Compétition",
        tagline: "Pour les joueurs réguliers",
        priceMonthly: "69 €",
        priceYearly: "690 €",
        priceNote: "/ mois",
        featured: false,
        badge: "",
        ctaLabel: "Choisir Compétition",
        features: [
          "−40 % sur la location",
          "Réservation 14 jours à l'avance",
          "Accès prioritaire aux tournois",
          "2 cours collectifs / mois offerts",
        ],
      },
    ],
  },
  // Le club en bento : des faits déjà affirmés ailleurs (FAQ, chiffres), donc
  // cohérents et vérifiables.
  equipements: {
    eyebrow: "Le club",
    title: "Tout est prêt, vous n'apportez rien",
    intro: "Huit courts, des vestiaires, de quoi boire un verre après le match. On s'occupe du reste.",
    items: [
      {
        title: "8 courts vitrés",
        text: "Indoor et outdoor, éclairés, ouverts 7j/7 de 7h à 23h.",
        icon: "court",
        wide: true,
      },
      { title: "Raquettes prêtées", text: "Raquettes et balles fournies avec chaque créneau.", icon: "racket", wide: false },
      { title: "Vestiaires & douches", text: "Accessibles à tous les joueurs, sans supplément.", icon: "shower", wide: false },
      { title: "Annulation 24 h", text: "Un imprévu ? Annulez sans frais jusqu'à 24 h avant.", icon: "clock", wide: false },
      { title: "Club-house", text: "Un coin pour se poser et boire un verre après l'échange.", icon: "bar", wide: false },
    ],
  },
  // Coachs : exemples sans visage ni identité réelle (initiales), à compléter
  // par le club avec l'accord des personnes.
  coachs: {
    eyebrow: "L'équipe",
    title: "Vos coachs",
    intro: "Des coachs diplômés qui adaptent chaque séance à votre niveau, du tout premier échange à la compétition.",
    examples: true,
    examplesNote: "Coachs d'exemple — remplacez par votre équipe dans l'espace d'administration.",
    items: [
      { name: "Coach A.", role: "Initiation & perfectionnement", bio: "Met les débutants à l'aise dès le premier échange.", photo: "", tag: "Diplômé·e d'État" },
      { name: "Coach B.", role: "Technique & compétition", bio: "Travaille la sortie de vitre, la bandeja et le jeu au filet.", photo: "", tag: "Ex-circuit" },
      { name: "Coach C.", role: "Cours collectifs", bio: "Des séances par niveau, dans une ambiance qui donne envie de revenir.", photo: "", tag: "Padel & tennis" },
    ],
  },
  galerie: {
    eyebrow: "En images",
    title: "L'énergie du terrain",
    intro: "Huit courts vitrés, des soirées qui finissent tard et une communauté qui grandit.",
    items: [
      { src: pexels(35248338, 1600), alt: "Joueuse au filet pendant un match de padel en salle", caption: "Au filet" },
      { src: pexels(32474981, 1200), alt: "Court de padel intérieur au sol bleu, sous une grande charpente", caption: "Court intérieur" },
      { src: pexels(35248469, 900), alt: "Joueuse souriante qui renvoie la balle sur un court bleu", caption: "Retour de service" },
      { src: pexels(4536850, 900), alt: "Raquette de padel et balles jaunes contre le filet", caption: "Avant le match" },
      { src: pexels(38155778, 900), alt: "Allée entre deux courts de padel vitrés", caption: "Entre deux courts" },
      { src: pexels(31559322, 900), alt: "Joueuse blonde en polo rose, raquette en main, appuyée au filet d'un court extérieur", caption: "En extérieur" },
      { src: pexels(32897038, 1200), alt: "Raquette de padel et balles posées sur le court", caption: "Le matériel" },
      { src: pexels(35248481, 1600), alt: "Joueuse qui se prépare avant un match de padel en salle", caption: "Échauffement" },
    ],
  },
  avis: {
    eyebrow: "Ils jouent chez nous",
    title: "La parole aux joueurs",
    examples: true,
    examplesNote: "Avis d'exemple, en attendant les vôtres.",
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
  bandeau: {
    enabled: true,
    words: ["Réserver", "Jouer", "Vibrer", "Lyon 8e", "7j/7 · 7h–23h", "8 courts vitrés"],
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

[Raison sociale], [forme juridique] au capital de [montant] €.
Siège social : [adresse du siège].
SIRET : [numéro] — RCS [ville] [numéro].
Téléphone : 04 26 68 12 34 — E-mail : contact@padel-house.fr
Directeur de la publication : [prénom et nom].

Hébergement

Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
https://vercel.com

Base de données hébergée par MongoDB Atlas, région Europe (Francfort).

Propriété intellectuelle

L'ensemble des contenus de ce site — textes, mise en page, identité visuelle —
est la propriété de [raison sociale]. Toute reproduction, même partielle, sans
autorisation écrite préalable est interdite.

Les photographies de démonstration proviennent de Pexels et restent la
propriété de leurs auteurs.

Médiation de la consommation

Conformément à l'article L612-1 du Code de la consommation, tout client peut
recourir gratuitement à un médiateur de la consommation en vue de la résolution
amiable d'un litige : [nom et coordonnées du médiateur].`,
    },
    privacy: {
      title: "Politique de confidentialité",
      body: `Responsable du traitement

[Raison sociale], 18 rue des Frères Lumière, 69008 Lyon.
Contact : contact@padel-house.fr

Ce que nous collectons, et ce que nous ne collectons pas

Le formulaire de réservation de ce site n'enregistre rien. Les informations que
vous saisissez — nom, e-mail, téléphone, créneau souhaité — restent dans votre
navigateur le temps de composer le message que vous nous envoyez vous-même
depuis votre messagerie. Elles disparaissent dès que vous fermez la page.

Aucune base de données du site ne conserve vos coordonnées.

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

Cookies et services tiers

Ce site ne dépose aucun cookie et n'installe aucun outil de mesure d'audience
ni traceur publicitaire. C'est pourquoi aucune bannière de consentement ne vous
est présentée. Les photos de démonstration sont chargées depuis Pexels, qui
reçoit votre adresse IP comme pour toute image chargée depuis un autre site.`,
    },
  },
  reservation: {
    eyebrow: "Réservation",
    title: "Réservez votre terrain",
    intro:
      "Composez votre demande en quatre étapes, puis envoyez-la au club. Nous vous rappelons pour confirmer le créneau.",
    ctaLabel: "Préparer ma demande",
    responseDelay: "sous 24 h ouvrées",
    finalTitle: "Votre demande est prête",
    finalBody:
      "Envoyez le message ci-dessous au club. Nous vous rappelons {delai} pour bloquer le créneau. Aucun terrain n'est retenu avant ce rappel.",
    paymentNote: "Aucun paiement en ligne : le règlement se fait sur place.",
    privacyNote:
      "Vos coordonnées ne sont pas enregistrées : elles servent uniquement à composer le message que vous enverrez vous-même.",
    steps: ["Formule", "Créneau", "Coordonnées", "Votre message"],
    slots: ["09:00", "10:30", "12:00", "14:00", "17:30", "19:00", "20:30", "22:00"],
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
    // Centre de chaque court sur le plan du club, en % (plan au format 2:1).
    courts: [
      { name: "Court 1 · Indoor", x: 15, y: 27 },
      { name: "Court 2 · Indoor", x: 38, y: 27 },
      { name: "Court 3 · Indoor", x: 62, y: 27 },
      { name: "Court 4 · Indoor", x: 85, y: 27 },
      { name: "Court 5 · Outdoor", x: 15, y: 73 },
      { name: "Court 6 · Outdoor", x: 38, y: 73 },
      { name: "Court panoramique", x: 62, y: 73 },
      { name: "Court central", x: 85, y: 73 },
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
 * Créneaux saisis dans le back-office : seules les heures bien formées sont
 * gardées, triées et sans doublon. Aucune heure valable → créneaux par défaut.
 */
function readSlots(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  const valid = value
    .map((it) => (typeof it === "string" ? it : str(it?.time, "")).trim())
    .filter((t) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t));
  const unique = Array.from(new Set(valid)).sort();
  return unique.length > 0 ? unique : fallback;
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
      skipLabel: str(g.hero?.skipLabel, d.hero.skipLabel),
    },
    sequence: {
      steps: (arr(g.sequence?.steps, d.sequence.steps) as any[]).map((it, i) => ({
        label: str(it.label, d.sequence.steps[i]?.label ?? ""),
        title: str(it.title, d.sequence.steps[i]?.title ?? ""),
        text: str(it.text, d.sequence.steps[i]?.text ?? ""),
      })),
      figureLabel: str(g.sequence?.figureLabel, d.sequence.figureLabel),
      figureTitle: str(g.sequence?.figureTitle, d.sequence.figureTitle),
      figureCaption: str(g.sequence?.figureCaption, d.sequence.figureCaption),
      dimLength: str(g.sequence?.dimLength, d.sequence.dimLength),
      dimWidth: str(g.sequence?.dimWidth, d.sequence.dimWidth),
      dimService: str(g.sequence?.dimService, d.sequence.dimService),
      players: str(g.sequence?.players, d.sequence.players),
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
        // « Laisser vide pour aucun ruban » : un ruban effacé ne doit pas
        // réapparaître depuis l'offre de démonstration du même rang.
        badge: strOrEmpty(it.badge, d.offres.items[i]?.badge ?? ""),
        ctaLabel: str(it.ctaLabel, d.offres.items[i]?.ctaLabel ?? ""),
        image: imageUrl(it.image, d.offres.items[i]?.image ?? ""),
        // Une photo téléversée sans texte alternatif ne doit pas hériter de la
        // description de la photo de démonstration qu'elle remplace.
        imageAlt: imageUrl(it.image, "")
          ? imageAlt(it.image, "")
          : d.offres.items[i]?.imageAlt ?? "",
        imageFocus: (["top", "center", "bottom"] as const).includes(it.imageFocus)
          ? it.imageFocus
          : imageUrl(it.image, "")
            ? "center"
            : d.offres.items[i]?.imageFocus ?? "center",
        playersLeft: Math.max(0, Math.min(3, num(it.playersLeft, d.offres.items[i]?.playersLeft ?? 2))),
        playersRight: Math.max(0, Math.min(3, num(it.playersRight, d.offres.items[i]?.playersRight ?? 2))),
        coach: bool(it.coach, d.offres.items[i]?.coach ?? false),
      })),
    },
    parcours: {
      eyebrow: str(g.parcours?.eyebrow, d.parcours.eyebrow),
      title: str(g.parcours?.title, d.parcours.title),
      intro: str(g.parcours?.intro, d.parcours.intro),
      ctaLabel: str(g.parcours?.ctaLabel, d.parcours.ctaLabel),
      ctaTarget: str(g.parcours?.ctaTarget, d.parcours.ctaTarget),
      items: parcoursItems,
    },
    chiffres: {
      title: str(g.chiffres?.title, d.chiffres.title),
      items: (arr(g.chiffres?.items, d.chiffres.items) as any[]).map((it, i) => ({
        value: num(it.value, d.chiffres.items[i]?.value ?? 0),
        // Suffixe et légende peuvent être vidés volontairement (« 8 » sans
        // unité) : ne pas les repiocher dans le chiffre de démonstration.
        suffix: strOrEmpty(it.suffix, d.chiffres.items[i]?.suffix ?? ""),
        label: str(it.label, d.chiffres.items[i]?.label ?? ""),
        caption: strOrEmpty(it.caption, d.chiffres.items[i]?.caption ?? ""),
      })),
    },
    abonnements: {
      eyebrow: str(g.abonnements?.eyebrow, d.abonnements.eyebrow),
      title: str(g.abonnements?.title, d.abonnements.title),
      intro: str(g.abonnements?.intro, d.abonnements.intro),
      examples: bool(g.abonnements?.examples, !(Array.isArray(g.abonnements?.items) && g.abonnements.items.length > 0)),
      examplesNote: str(g.abonnements?.examplesNote, d.abonnements.examplesNote),
      monthlyLabel: str(g.abonnements?.monthlyLabel, d.abonnements.monthlyLabel),
      yearlyLabel: str(g.abonnements?.yearlyLabel, d.abonnements.yearlyLabel),
      yearlyNote: strOrEmpty(g.abonnements?.yearlyNote, d.abonnements.yearlyNote),
      items: (arr(g.abonnements?.items, d.abonnements.items) as any[]).map((it, i) => ({
        name: str(it.name, d.abonnements.items[i]?.name ?? ""),
        tagline: strOrEmpty(it.tagline, d.abonnements.items[i]?.tagline ?? ""),
        priceMonthly: str(it.priceMonthly, d.abonnements.items[i]?.priceMonthly ?? ""),
        priceYearly: str(it.priceYearly, d.abonnements.items[i]?.priceYearly ?? ""),
        priceNote: strOrEmpty(it.priceNote, d.abonnements.items[i]?.priceNote ?? ""),
        featured: bool(it.featured, d.abonnements.items[i]?.featured ?? false),
        badge: strOrEmpty(it.badge, d.abonnements.items[i]?.badge ?? ""),
        ctaLabel: str(it.ctaLabel, d.abonnements.items[i]?.ctaLabel ?? ""),
        features: (arr(it.features, d.abonnements.items[i]?.features ?? []) as any[])
          .map((f) => (typeof f === "string" ? f : str(f?.text, "")))
          .filter(Boolean),
      })),
    },
    equipements: {
      eyebrow: str(g.equipements?.eyebrow, d.equipements.eyebrow),
      title: str(g.equipements?.title, d.equipements.title),
      intro: str(g.equipements?.intro, d.equipements.intro),
      items: (arr(g.equipements?.items, d.equipements.items) as any[]).map((it, i) => ({
        title: str(it.title, d.equipements.items[i]?.title ?? ""),
        text: str(it.text, d.equipements.items[i]?.text ?? ""),
        icon: ((["court", "ball", "racket", "clock", "shower", "shop", "parking", "bar"] as EquipementIcon[]).includes(
          it.icon
        )
          ? it.icon
          : d.equipements.items[i]?.icon ?? "court") as EquipementIcon,
        wide: bool(it.wide, d.equipements.items[i]?.wide ?? false),
      })),
    },
    coachs: {
      eyebrow: str(g.coachs?.eyebrow, d.coachs.eyebrow),
      title: str(g.coachs?.title, d.coachs.title),
      intro: str(g.coachs?.intro, d.coachs.intro),
      examples: bool(g.coachs?.examples, !(Array.isArray(g.coachs?.items) && g.coachs.items.length > 0)),
      examplesNote: str(g.coachs?.examplesNote, d.coachs.examplesNote),
      items: (arr(g.coachs?.items, d.coachs.items) as any[]).map((it, i) => ({
        name: str(it.name, d.coachs.items[i]?.name ?? ""),
        role: str(it.role, d.coachs.items[i]?.role ?? ""),
        bio: strOrEmpty(it.bio, d.coachs.items[i]?.bio ?? ""),
        photo: imageUrl(it.photo, ""),
        tag: strOrEmpty(it.tag, d.coachs.items[i]?.tag ?? ""),
      })),
    },
    partenaires: {
      title: str(g.partenaires?.title, d.partenaires.title),
      examples: bool(g.partenaires?.examples, !(Array.isArray(g.partenaires?.items) && g.partenaires.items.length > 0)),
      examplesNote: str(g.partenaires?.examplesNote, d.partenaires.examplesNote),
      items: (arr(g.partenaires?.items, d.partenaires.items) as any[])
        .map((it, i) => ({
          name: str(it.name, d.partenaires.items[i]?.name ?? ""),
          logo: imageUrl(it.logo, ""),
          url: strOrEmpty(it.url, ""),
        }))
        .filter((p) => p.name || p.logo),
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
          imageUrl(it.src, "") ? imageAlt(it.src, "") : d.galerie.items[i]?.alt ?? ""
        ),
        // Comme le texte alternatif : une photo téléversée sans légende ne doit
        // pas hériter de la légende de démonstration du même rang.
        caption: str(it.caption, imageUrl(it.src, "") ? "" : d.galerie.items[i]?.caption ?? ""),
      })),
    },
    avis: {
      eyebrow: str(g.avis?.eyebrow, d.avis.eyebrow),
      title: str(g.avis?.title, d.avis.title),
      examples: bool(
        g.avis?.examples,
        !(Array.isArray(g.avis?.items) && g.avis.items.length > 0)
      ),
      examplesNote: str(g.avis?.examplesNote, d.avis.examplesNote),
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
      // Lien facultatif : vidé, il ne doit pas réafficher le libellé de démo.
      linkLabel: strOrEmpty(g.announcement?.linkLabel, d.announcement.linkLabel),
      linkTarget: str(g.announcement?.linkTarget, d.announcement.linkTarget),
    },
    bandeau: {
      enabled: bool(g.bandeau?.enabled, d.bandeau.enabled),
      words: (() => {
        const raw = strOrEmpty(g.bandeau?.words, d.bandeau.words.join(", "));
        const parts = raw
          .split(",")
          .map((w) => w.trim())
          .filter(Boolean);
        return parts.length > 0 ? parts : d.bandeau.words;
      })(),
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
      intro: str(g.reservation?.intro, d.reservation.intro),
      ctaLabel: str(g.reservation?.ctaLabel, d.reservation.ctaLabel),
      responseDelay: str(g.reservation?.responseDelay, d.reservation.responseDelay),
      finalTitle: str(g.reservation?.finalTitle, d.reservation.finalTitle),
      finalBody: str(g.reservation?.finalBody, d.reservation.finalBody),
      paymentNote: str(g.reservation?.paymentNote, d.reservation.paymentNote),
      privacyNote: str(g.reservation?.privacyNote, d.reservation.privacyNote),
      steps: (arr(g.reservation?.steps, d.reservation.steps) as any[]).map((it, i) =>
        typeof it === "string" ? it : str(it?.label, d.reservation.steps[i] ?? "")
      ),
      slots: readSlots(g.reservation?.slots, d.reservation.slots),
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
