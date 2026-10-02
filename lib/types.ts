// Types partagés — le contenu vient du global `home` de Payload (voir lib/content.ts).

export type Activity = {
  name: string;
  tagline: string;
  description: string;
  duration: string;
  level: string;
  price: string;
  image: string;
  /** Texte alternatif : celui de l'image téléversée, sinon celui de la photo de démonstration. */
  imageAlt: string;
  /** Partie de la photo gardée au recadrage. */
  imageFocus: "top" | "center" | "bottom";
  /** Ruban de mise en avant, ex. « La plus demandée ». Vide = pas de ruban. */
  badge: string;
  /** Libellé du bouton propre à cette formule. */
  ctaLabel: string;
  /** Pictogramme de la carte : joueurs de chaque côté du filet, et un coach. */
  playersLeft: number;
  playersRight: number;
  coach: boolean;
};

export type StoryStep = {
  step: string;
  title: string;
  subtitle: string;
  text: string;
  image: string;
  imageAlt: string;
  /** Photographe à créditer, vide si la photo ne vient pas d'Unsplash. */
  credit: string;
  creditLink: string;
};

export type Stat = { value: number; suffix: string; label: string; caption: string };

export type Testimonial = {
  name: string;
  role: string;
  rating: number;
  quote: string;
  /** Date de l'avis et plateforme d'origine : sans elles, un avis n'est pas crédible. */
  date: string;
  source: string;
};

export type GalleryItem = { src: string; alt: string; caption: string };

export type NavItem = { label: string; target: string };
export type OpeningSlot = { days: string[]; opens: string; closes: string };
export type FaqItem = { question: string; answer: string };
export type Court = { name: string; x: number; y: number };
export type Social = { name: string; url: string };

export type HeroContent = {
  eyebrow: string;
  title1: string;
  title2: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  scrollHint: string;
  /** Lien qui saute la séquence 3D. */
  skipLabel: string;
};

export type SequenceStep = { label: string; title: string; text: string };

/** Séquence 3D du héros : légendes, cotes et repères du plan final. */
export type SequenceContent = {
  steps: SequenceStep[];
  figureLabel: string;
  figureTitle: string;
  figureCaption: string;
  dimLength: string;
  dimWidth: string;
  dimService: string;
  /** Repères des quatre joueurs, séparés par des virgules. */
  players: string;
};

export type OffresContent = {
  eyebrow: string;
  title: string;
  intro: string;
  items: Activity[];
};

export type ParcoursContent = {
  eyebrow: string;
  title: string;
  intro: string;
  ctaLabel: string;
  ctaTarget: string;
  items: StoryStep[];
};
export type ChiffresContent = { title: string; items: Stat[] };
export type FaqContent = { eyebrow: string; title: string; intro: string; items: FaqItem[] };
export type AnnouncementContent = {
  enabled: boolean;
  text: string;
  linkLabel: string;
  linkTarget: string;
};
export type LegalPage = { title: string; body: string };
export type LegalContent = { mentions: LegalPage; privacy: LegalPage };
export type GalerieContent = {
  eyebrow: string;
  title: string;
  intro: string;
  items: GalleryItem[];
};
export type AvisContent = {
  eyebrow: string;
  title: string;
  /** Vrai tant que les avis affichés sont ceux de démonstration. */
  examples: boolean;
  examplesNote: string;
  items: Testimonial[];
};
export type ReservationContent = {
  eyebrow: string;
  title: string;
  intro: string;
  ctaLabel: string;
  responseDelay: string;
  finalTitle: string;
  finalBody: string;
  paymentNote: string;
  privacyNote: string;
  steps: string[];
  /** Heures de début proposées, format HH:MM. */
  slots: string[];
};
export type NavContent = { items: NavItem[] };

export type FooterContent = {
  ctaTitle: string;
  ctaButton: string;
  mapTitle: string;
  linksTitle: string;
  contactTitle: string;
  socialsTitle: string;
  email: string;
  phone: string;
  hours: string;
  addressStreet: string;
  addressZip: string;
  addressCity: string;
  mapsUrl: string;
  openingHours: OpeningSlot[];
  legal: string;
  courts: Court[];
  socials: Social[];
};
