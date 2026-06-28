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

export type Court = { name: string; x: number; y: number };
export type Social = { name: string; url: string };

export type HeroContent = {
  eyebrow: string;
  title1: string;
  title2: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  videoUrl?: string;
};

export type OffresContent = {
  eyebrow: string;
  title: string;
  intro: string;
  items: Activity[];
};

export type ParcoursContent = { eyebrow: string; items: StoryStep[] };
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
export type FooterContent = {
  ctaTitle: string;
  ctaButton: string;
  mapTitle: string;
  email: string;
  phone: string;
  hours: string;
  courts: Court[];
  socials: Social[];
};
