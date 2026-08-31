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

        // ---------------- NAVIGATION ----------------
        {
          label: "Navigation",
          fields: [
            {
              name: "nav",
              type: "group",
              label: "Menu du site",
              fields: [
                {
                  name: "items",
                  type: "array",
                  label: "Liens du menu",
                  labels: { singular: "Lien", plural: "Liens" },
                  admin: {
                    description:
                      "Utilisés en haut du site et dans le pied de page. La destination est limitée aux sections existantes.",
                  },
                  fields: [
                    { name: "label", type: "text", label: "Texte affiché" },
                    {
                      name: "target",
                      type: "select",
                      label: "Section visée",
                      options: [
                        { label: "Offres", value: "#offres" },
                        { label: "Parcours", value: "#parcours" },
                        { label: "Galerie", value: "#galerie" },
                        { label: "Avis", value: "#avis" },
                        { label: "FAQ", value: "#faq" },
                        { label: "Réservation", value: "#reservation" },
                      ],
                    },
                  ],
                },
              ],
            },
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
                { name: "scrollHint", type: "text", label: "Indice de défilement (sous la bannière)" },
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
                    {
                      name: "badge",
                      type: "text",
                      label: "Ruban de mise en avant",
                      admin: { description: "Ex. « La plus demandée ». Laisser vide pour aucun ruban." },
                    },
                    { name: "ctaLabel", type: "text", label: "Libellé du bouton" },
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
                { name: "ctaLabel", type: "text", label: "Bouton des cartes" },
                {
                  name: "ctaTarget",
                  type: "select",
                  label: "Destination du bouton",
                  options: [
                    { label: "Réservation", value: "#reservation" },
                    { label: "Offres", value: "#offres" },
                    { label: "Galerie", value: "#galerie" },
                    { label: "Avis", value: "#avis" },
                  ],
                },
                {
                  name: "items",
                  type: "array",
                  label: "Étapes",
                  labels: { singular: "Étape", plural: "Étapes" },
                  fields: [
                    { name: "step", type: "text", label: "Numéro (ex. 01)" },
                    { name: "title", type: "text", label: "Titre" },
                    { name: "subtitle", type: "text", label: "Sous-titre (2ᵉ ligne)" },
                    { name: "text", type: "textarea", label: "Texte" },
                    { name: "image", type: "upload", relationTo: "media", label: "Photo de fond" },
                    {
                      name: "unsplashQuery",
                      type: "text",
                      label: "Mot-clé Unsplash",
                      admin: {
                        description:
                          "Utilisé seulement si aucune photo n'est téléversée ci-dessus. Ex. « padel match ». Laisser vide pour garder la photo de démonstration.",
                      },
                    },
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
                    {
                      name: "caption",
                      type: "text",
                      label: "Précision sous la légende",
                      admin: { description: "Ex. « sur 213 avis Google ». Un chiffre sourcé convainc, un chiffre nu inquiète." },
                    },
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
                    { name: "date", type: "text", label: "Date (ex. mars 2026)" },
                    {
                      name: "source",
                      type: "select",
                      label: "Provenance",
                      options: ["Google", "Facebook", "Sur place", ""],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ---------------- FAQ ----------------
        {
          label: "FAQ",
          fields: [
            {
              name: "faq",
              type: "group",
              label: "Questions fréquentes",
              admin: {
                description:
                  "Affichée juste avant la réservation et publiée au format FAQ pour Google. C'est l'endroit où lever les freins du débutant.",
              },
              fields: [
                { name: "eyebrow", type: "text", label: "Sur-titre" },
                { name: "title", type: "text", label: "Titre" },
                { name: "intro", type: "textarea", label: "Introduction" },
                {
                  name: "items",
                  type: "array",
                  label: "Questions",
                  labels: { singular: "Question", plural: "Questions" },
                  fields: [
                    { name: "question", type: "text", label: "Question" },
                    { name: "answer", type: "textarea", label: "Réponse" },
                  ],
                },
              ],
            },
          ],
        },

        // ---------------- BANDEAU + PAGES LÉGALES ----------------
        {
          label: "Bandeau & mentions",
          fields: [
            {
              name: "announcement",
              type: "group",
              label: "Bandeau d'annonce",
              admin: {
                description:
                  "Barre affichée tout en haut du site. Pour un tournoi, une fermeture exceptionnelle, une offre limitée.",
              },
              fields: [
                { name: "enabled", type: "checkbox", label: "Afficher le bandeau" },
                { name: "text", type: "text", label: "Message" },
                { name: "linkLabel", type: "text", label: "Libellé du lien (facultatif)" },
                {
                  name: "linkTarget",
                  type: "select",
                  label: "Destination du lien",
                  options: [
                    { label: "Réservation", value: "#reservation" },
                    { label: "Offres", value: "#offres" },
                    { label: "FAQ", value: "#faq" },
                    { label: "Galerie", value: "#galerie" },
                  ],
                },
              ],
            },
            {
              name: "legal",
              type: "group",
              label: "Pages légales",
              fields: [
                {
                  name: "mentions",
                  type: "group",
                  label: "Mentions légales",
                  fields: [
                    { name: "title", type: "text", label: "Titre de la page" },
                    { name: "body", type: "textarea", label: "Contenu", admin: { rows: 14 } },
                  ],
                },
                {
                  name: "privacy",
                  type: "group",
                  label: "Politique de confidentialité",
                  fields: [
                    { name: "title", type: "text", label: "Titre de la page" },
                    { name: "body", type: "textarea", label: "Contenu", admin: { rows: 14 } },
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
                { name: "linksTitle", type: "text", label: "Titre de la colonne de liens" },
                { name: "contactTitle", type: "text", label: "Titre de la colonne contact" },
                { name: "socialsTitle", type: "text", label: "Titre de la colonne réseaux" },
                { name: "email", type: "text", label: "E-mail" },
                { name: "phone", type: "text", label: "Téléphone" },
                { name: "hours", type: "text", label: "Horaires" },
                { name: "addressStreet", type: "text", label: "Adresse — rue" },
                { name: "addressZip", type: "text", label: "Adresse — code postal" },
                {
                  name: "addressCity",
                  type: "text",
                  label: "Adresse — ville",
                  admin: {
                    description:
                      "Renseignée, la ville est ajoutée au titre Google et publiée dans les données structurées du club. C'est le levier le plus fort du référencement local.",
                  },
                },
                { name: "mapsUrl", type: "text", label: "Lien Google Maps (facultatif)" },
                {
                  name: "openingHours",
                  type: "array",
                  label: "Horaires d'ouverture",
                  labels: { singular: "Plage", plural: "Plages" },
                  admin: {
                    description:
                      "Publiés dans la fiche Google du club. Format 24 h, ex. 07:00 et 23:00.",
                  },
                  fields: [
                    {
                      name: "days",
                      type: "select",
                      hasMany: true,
                      label: "Jours",
                      options: [
                        { label: "Lundi", value: "Monday" },
                        { label: "Mardi", value: "Tuesday" },
                        { label: "Mercredi", value: "Wednesday" },
                        { label: "Jeudi", value: "Thursday" },
                        { label: "Vendredi", value: "Friday" },
                        { label: "Samedi", value: "Saturday" },
                        { label: "Dimanche", value: "Sunday" },
                      ],
                    },
                    { name: "opens", type: "text", label: "Ouverture (HH:MM)" },
                    { name: "closes", type: "text", label: "Fermeture (HH:MM)" },
                  ],
                },
                { name: "legal", type: "text", label: "Mention légale (après l'année)" },
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
