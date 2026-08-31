// Shared content types — data now comes from content/home/index.json (TinaCMS).

export type Activity = {
  name: string;
  tagline: string;
  description: string;
  duration: string;
  level: string;
  price: string;
  image: string;
};

export type StoryStep = {
  step: string;
  title: string;
  subtitle: string;
  text: string;
  image: string;
};

export type Stat = { value: number; suffix: string; label: string };

export type Testimonial = {
  name: string;
  role: string;
  rating: number;
  quote: string;
};

export type GalleryItem = { src: string; alt: string };

export type NavItem = { label: string; target: string };
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
  videoUrl?: string;
};

export type OffresContent = {
  eyebrow: string;
  title: string;
  intro: string;
  items: Activity[];
};

export type ParcoursContent = {
  eyebrow: string;
  ctaLabel: string;
  ctaTarget: string;
  items: StoryStep[];
};
export type ChiffresContent = { title: string; items: Stat[] };
export type GalerieContent = {
  eyebrow: string;
  title: string;
  intro: string;
  items: GalleryItem[];
};
export type AvisContent = {
  eyebrow: string;
  title: string;
  items: Testimonial[];
};
export type ReservationContent = { eyebrow: string; title: string };
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
  legal: string;
  courts: Court[];
  socials: Social[];
};
