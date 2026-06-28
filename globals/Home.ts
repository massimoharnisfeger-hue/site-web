import type { GlobalConfig } from "payload";

// Tout le contenu éditable de la page d'accueil, organisé par section.
// Chaque champ apparaît dans le back-office /admin.
export const Home: GlobalConfig = {
  slug: "home",
  label: "Page d'accueil",
  admin: { group: "Contenu" },
  access: {
    read: () => true, // le site public peut lire le contenu
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        // ---------------- SEO ----------------
        {
          label: "SEO",
          fields: [
            {
              name: "seo",
              type: "group",
              label: "Référencement (Google)",
              fields: [
                { name: "title", type: "text", label: "Titre de l'onglet / Google" },
                { name: "description", type: "textarea", label: "Description Google" },
                { name: "keywords", type: "text", label: "Mots-clés (séparés par des virgules)" },
                { name: "ogImage", type: "upload", relationTo: "media", label: "Image de partage (réseaux sociaux)" },
              ],
            },
            { name: "brand", type: "text", label: "Nom du club (logo)" },
          ],
        },

        // ---------------- HERO ----------------
        {
          label: "Bannière",
          fields: [
            {
              name: "hero",
              type: "group",
              label: "Bannière (Hero)",
              fields: [
                { name: "eyebrow", type: "text", label: "Petit texte du haut" },
                { name: "title1", type: "text", label: "Titre — 1ʳᵉ ligne" },
                { name: "title2", type: "text", label: "Titre — 2ᵉ ligne (en couleur)" },
                { name: "subtitle", type: "textarea", label: "Sous-titre" },
                { name: "ctaPrimary", type: "text", label: "Bouton principal" },
                { name: "ctaSecondary", type: "text", label: "Bouton secondaire" },
                { name: "videoUrl", type: "text", label: "Vidéo de fond — lien YouTube (vide = fond animé)" },
              ],
            },
          ],
        },

        // ---------------- OFFRES ----------------
        {
          label: "Offres",
          fields: [
            {
              name: "offres",
              type: "group",
              label: "Section Offres",
              fields: [
                { name: "eyebrow", type: "text", label: "Sur-titre" },
                { name: "title", type: "text", label: "Titre" },
                { name: "intro", type: "textarea", label: "Introduction" },
                {
                  name: "items",
                  type: "array",
                  label: "Offres",
                  labels: { singular: "Offre", plural: "Offres" },
                  fields: [
                    { name: "name", type: "text", label: "Nom" },
                    { name: "tagline", type: "text", label: "Accroche" },
                    { name: "description", type: "textarea", label: "Description" },
                    { name: "duration", type: "text", label: "Durée" },
                    { name: "level", type: "text", label: "Niveau" },
                    { name: "price", type: "text", label: "Prix" },
                    { name: "image", type: "upload", relationTo: "media", label: "Photo" },
                  ],
                },
              ],
            },
          ],
        },

        // ---------------- PARCOURS ----------------
        {
          label: "Parcours",
          fields: [
            {
              name: "parcours",
              type: "group",
              label: "Section Parcours",
              fields: [
                { name: "eyebrow", type: "text", label: "Sur-titre" },
                {
                  name: "items",
                  type: "array",
                  label: "Étapes",
                  labels: { singular: "Étape", plural: "Étapes" },
                  fields: [
                    { name: "step", type: "text", label: "Numéro (ex. 01)" },
                    { name: "title", type: "text", label: "Titre" },
                    { name: "text", type: "textarea", label: "Texte" },
                    { name: "image", type: "upload", relationTo: "media", label: "Photo de fond" },
                  ],
                },
              ],
            },
          ],
        },

        // ---------------- CHIFFRES ----------------
        {
          label: "Chiffres",
          fields: [
            {
              name: "chiffres",
              type: "group",
              label: "Section Chiffres",
              fields: [
                { name: "title", type: "text", label: "Titre" },
                {
                  name: "items",
                  type: "array",
                  label: "Chiffres",
                  labels: { singular: "Chiffre", plural: "Chiffres" },
                  fields: [
                    { name: "value", type: "number", label: "Valeur (nombre)" },
                    { name: "suffix", type: "text", label: "Suffixe (ex. +, /5)" },
                    { name: "label", type: "text", label: "Légende" },
                  ],
                },
              ],
            },
          ],
        },

        // ---------------- GALERIE ----------------
        {
          label: "Galerie",
          fields: [
            {
              name: "galerie",
              type: "group",
              label: "Section Galerie",
              fields: [
                { name: "eyebrow", type: "text", label: "Sur-titre" },
                { name: "title", type: "text", label: "Titre" },
                { name: "intro", type: "textarea", label: "Introduction" },
                {
                  name: "items",
                  type: "array",
                  label: "Photos",
                  labels: { singular: "Photo", plural: "Photos" },
                  fields: [
                    { name: "src", type: "upload", relationTo: "media", label: "Photo" },
                    { name: "alt", type: "text", label: "Description (accessibilité / SEO)" },
                  ],
                },
              ],
            },
          ],
        },

        // ---------------- AVIS ----------------
        {
          label: "Avis",
          fields: [
            {
              name: "avis",
              type: "group",
              label: "Section Avis",
              fields: [
                { name: "eyebrow", type: "text", label: "Sur-titre" },
                { name: "title", type: "text", label: "Titre" },
                {
                  name: "items",
                  type: "array",
                  label: "Avis",
                  labels: { singular: "Avis", plural: "Avis" },
                  fields: [
                    { name: "name", type: "text", label: "Nom" },
                    { name: "role", type: "text", label: "Formule / contexte" },
                    { name: "rating", type: "number", label: "Note (1 à 5)", min: 1, max: 5 },
                    { name: "quote", type: "textarea", label: "Témoignage" },
                  ],
                },
              ],
            },
          ],
        },

        // ---------------- RÉSERVATION + FOOTER ----------------
        {
          label: "Réservation & Pied de page",
          fields: [
            {
              name: "reservation",
              type: "group",
              label: "Section Réservation",
              fields: [
                { name: "eyebrow", type: "text", label: "Sur-titre" },
                { name: "title", type: "text", label: "Titre" },
              ],
            },
            {
              name: "footer",
              type: "group",
              label: "Pied de page",
              fields: [
                { name: "ctaTitle", type: "text", label: "Titre d'appel final" },
                { name: "ctaButton", type: "text", label: "Bouton" },
                { name: "mapTitle", type: "text", label: "Titre de la carte" },
                { name: "email", type: "text", label: "E-mail" },
                { name: "phone", type: "text", label: "Téléphone" },
                { name: "hours", type: "text", label: "Horaires" },
                {
                  name: "courts",
                  type: "array",
                  label: "Terrains (carte)",
                  labels: { singular: "Terrain", plural: "Terrains" },
                  fields: [
                    { name: "name", type: "text", label: "Nom du terrain" },
                    { name: "x", type: "number", label: "Position X (0-100)" },
                    { name: "y", type: "number", label: "Position Y (0-100)" },
                  ],
                },
                {
                  name: "socials",
                  type: "array",
                  label: "Réseaux sociaux",
                  labels: { singular: "Réseau", plural: "Réseaux" },
                  fields: [
                    {
                      name: "name",
                      type: "select",
                      label: "Réseau",
                      options: ["Instagram", "TikTok", "YouTube", "Facebook", "LinkedIn"],
                    },
                    { name: "url", type: "text", label: "Lien" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
