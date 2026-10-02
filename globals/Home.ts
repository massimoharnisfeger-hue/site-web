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
                        { label: "Abonnements", value: "#abonnements" },
                        { label: "Parcours", value: "#parcours" },
                        { label: "Le club", value: "#club" },
                        { label: "Coachs", value: "#coachs" },
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
                { name: "title2", type: "text", label: "Titre — 2ᵉ ligne (suivie du point balle)" },
                { name: "subtitle", type: "textarea", label: "Sous-titre" },
                { name: "ctaPrimary", type: "text", label: "Bouton principal" },
                { name: "ctaSecondary", type: "text", label: "Bouton secondaire" },
                { name: "scrollHint", type: "text", label: "Indice de défilement (sous la bannière)" },
                { name: "skipLabel", type: "text", label: "Lien pour passer la séquence 3D" },
              ],
            },
            {
              name: "sequence",
              type: "group",
              label: "Séquence 3D (raquette → court)",
              admin: {
                description:
                  "Légendes affichées pendant que la raquette frappe la balle et que la caméra s'élève jusqu'au plan du court.",
              },
              fields: [
                {
                  name: "steps",
                  type: "array",
                  label: "Légendes successives",
                  labels: { singular: "Légende", plural: "Légendes" },
                  // Exactement trois : la séquence et le rail sont calés sur
                  // trois temps avant le plan final. En retirer décalerait les
                  // légendes ; en ajouter n'aurait pas de fenêtre d'affichage.
                  minRows: 3,
                  maxRows: 3,
                  fields: [
                    { name: "label", type: "text", label: "Repère (ex. 01 · La raquette)" },
                    { name: "title", type: "text", label: "Titre" },
                    { name: "text", type: "textarea", label: "Texte" },
                  ],
                },
                { name: "figureLabel", type: "text", label: "Plan final — repère (ex. Fig. 1)" },
                { name: "figureTitle", type: "text", label: "Plan final — titre" },
                { name: "figureCaption", type: "textarea", label: "Plan final — légende" },
                { name: "dimLength", type: "text", label: "Cote de longueur (ex. 20 m)" },
                { name: "dimWidth", type: "text", label: "Cote de largeur (ex. 10 m)" },
                { name: "dimService", type: "text", label: "Cote filet → ligne de service (ex. 6,95 m)" },
                { name: "players", type: "text", label: "Repères des joueurs, séparés par des virgules" },
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
                    {
                      name: "imageFocus",
                      type: "select",
                      label: "Cadrage de la photo",
                      options: [
                        { label: "Haut", value: "top" },
                        { label: "Centre", value: "center" },
                        { label: "Bas", value: "bottom" },
                      ],
                      admin: { description: "Partie de la photo gardée quand la fiche la recadre." },
                    },
                    {
                      type: "row",
                      fields: [
                        { name: "playersLeft", type: "number", label: "Pictogramme : joueurs à gauche (0-3)", min: 0, max: 3 },
                        { name: "playersRight", type: "number", label: "Joueurs à droite (0-3)", min: 0, max: 3 },
                        { name: "coach", type: "checkbox", label: "Avec un coach" },
                      ],
                    },
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
                { name: "title", type: "text", label: "Titre" },
                { name: "intro", type: "textarea", label: "Introduction" },
                { name: "ctaLabel", type: "text", label: "Lien sous les étapes" },
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

        // ---------------- PARTENAIRES ----------------
        {
          label: "Partenaires",
          fields: [
            {
              name: "partenaires",
              type: "group",
              label: "Bande partenaires",
              fields: [
                { name: "title", type: "text", label: "Titre (petit, au-dessus de la bande)" },
                {
                  name: "examples",
                  type: "checkbox",
                  label: "Partenaires d'exemple",
                  admin: { description: "Décochez une fois vos vrais partenaires ajoutés : la mention disparaît." },
                },
                { name: "examplesNote", type: "text", label: "Mention affichée tant que ce sont des exemples" },
                {
                  name: "items",
                  type: "array",
                  label: "Partenaires",
                  labels: { singular: "Partenaire", plural: "Partenaires" },
                  admin: { description: "Téléversez le logo ; sans logo, le nom s'affiche en toutes lettres." },
                  fields: [
                    { name: "name", type: "text", label: "Nom" },
                    { name: "logo", type: "upload", relationTo: "media", label: "Logo (facultatif)" },
                    { name: "url", type: "text", label: "Lien (facultatif)" },
                  ],
                },
              ],
            },
          ],
        },

        // ---------------- ABONNEMENTS ----------------
        {
          label: "Abonnements",
          fields: [
            {
              name: "abonnements",
              type: "group",
              label: "Section Abonnements",
              fields: [
                { name: "eyebrow", type: "text", label: "Sur-titre" },
                { name: "title", type: "text", label: "Titre" },
                { name: "intro", type: "textarea", label: "Introduction" },
                {
                  name: "examples",
                  type: "checkbox",
                  label: "Tarifs d'exemple",
                  admin: { description: "Décochez une fois vos vrais tarifs d'abonnement renseignés." },
                },
                { name: "examplesNote", type: "text", label: "Mention affichée tant que ce sont des exemples" },
                { name: "monthlyLabel", type: "text", label: "Libellé « mensuel »" },
                { name: "yearlyLabel", type: "text", label: "Libellé « annuel »" },
                { name: "yearlyNote", type: "text", label: "Note sous la bascule annuelle (ex. « 2 mois offerts »)" },
                {
                  name: "items",
                  type: "array",
                  label: "Forfaits",
                  labels: { singular: "Forfait", plural: "Forfaits" },
                  maxRows: 4,
                  fields: [
                    { name: "name", type: "text", label: "Nom" },
                    { name: "tagline", type: "text", label: "Accroche" },
                    { name: "priceMonthly", type: "text", label: "Prix mensuel (ex. 39 €)" },
                    { name: "priceYearly", type: "text", label: "Prix annuel (ex. 390 €)" },
                    { name: "priceNote", type: "text", label: "Précision sous le prix (ex. / mois)" },
                    { name: "featured", type: "checkbox", label: "Mettre en avant" },
                    { name: "badge", type: "text", label: "Ruban (si mis en avant)" },
                    { name: "ctaLabel", type: "text", label: "Bouton" },
                    {
                      name: "features",
                      type: "array",
                      label: "Avantages",
                      labels: { singular: "Avantage", plural: "Avantages" },
                      fields: [{ name: "text", type: "text", label: "Avantage" }],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ---------------- LE CLUB (ÉQUIPEMENTS) ----------------
        {
          label: "Le club (équipements)",
          fields: [
            {
              name: "equipements",
              type: "group",
              label: "Section Le club",
              fields: [
                { name: "eyebrow", type: "text", label: "Sur-titre" },
                { name: "title", type: "text", label: "Titre" },
                { name: "intro", type: "textarea", label: "Introduction" },
                {
                  name: "items",
                  type: "array",
                  label: "Équipements et services",
                  labels: { singular: "Élément", plural: "Éléments" },
                  maxRows: 7,
                  fields: [
                    { name: "title", type: "text", label: "Titre" },
                    { name: "text", type: "textarea", label: "Texte" },
                    {
                      name: "icon",
                      type: "select",
                      label: "Pictogramme",
                      options: [
                        { label: "Court", value: "court" },
                        { label: "Balle", value: "ball" },
                        { label: "Raquette", value: "racket" },
                        { label: "Horaires", value: "clock" },
                        { label: "Vestiaire / douche", value: "shower" },
                        { label: "Boutique", value: "shop" },
                        { label: "Parking", value: "parking" },
                        { label: "Bar / club-house", value: "bar" },
                      ],
                    },
                    { name: "wide", type: "checkbox", label: "Carte large (occupe deux colonnes)" },
                  ],
                },
              ],
            },
          ],
        },

        // ---------------- COACHS ----------------
        {
          label: "Coachs",
          fields: [
            {
              name: "coachs",
              type: "group",
              label: "Section Nos coachs",
              fields: [
                { name: "eyebrow", type: "text", label: "Sur-titre" },
                { name: "title", type: "text", label: "Titre" },
                { name: "intro", type: "textarea", label: "Introduction" },
                {
                  name: "examples",
                  type: "checkbox",
                  label: "Coachs d'exemple",
                  admin: { description: "Décochez une fois vos vrais coachs ajoutés (avec leur accord pour la photo)." },
                },
                { name: "examplesNote", type: "text", label: "Mention affichée tant que ce sont des exemples" },
                {
                  name: "items",
                  type: "array",
                  label: "Coachs",
                  labels: { singular: "Coach", plural: "Coachs" },
                  fields: [
                    { name: "name", type: "text", label: "Nom" },
                    { name: "role", type: "text", label: "Spécialité / rôle" },
                    { name: "bio", type: "textarea", label: "Courte bio" },
                    { name: "photo", type: "upload", relationTo: "media", label: "Photo (facultatif)" },
                    { name: "tag", type: "text", label: "Badge (ex. diplôme, niveau)" },
                  ],
                },
              ],
            },
          ],
        },

        // ---------------- BANDEAU DÉFILANT ----------------
        {
          label: "Bandeau défilant",
          fields: [
            {
              name: "bandeau",
              type: "group",
              label: "Bandeau défilant (séparateur)",
              fields: [
                { name: "enabled", type: "checkbox", label: "Afficher le bandeau" },
                {
                  name: "words",
                  type: "text",
                  label: "Mots, séparés par des virgules",
                  admin: { description: "Ex. « Réserver, Jouer, Vibrer, Lyon 8e, 7j/7 ». Défile en continu, séparés par une balle." },
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
                    { name: "caption", type: "text", label: "Légende courte sous la photo" },
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
                  name: "examples",
                  type: "checkbox",
                  label: "Ces avis sont des exemples",
                  admin: {
                    description:
                      "Cochée, une mention « avis d'exemple » s'affiche sous les avis. Décochez-la dès que les avis sont réels.",
                  },
                },
                { name: "examplesNote", type: "text", label: "Mention affichée sous les avis d'exemple" },
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
                { name: "intro", type: "textarea", label: "Introduction" },
                { name: "ctaLabel", type: "text", label: "Bouton de la dernière étape" },
                {
                  name: "responseDelay",
                  type: "text",
                  label: "Délai de réponse annoncé",
                  admin: { description: "Ex. « sous 24 h ouvrées ». Repris tel quel dans le message final." },
                },
                { name: "finalTitle", type: "text", label: "Écran final — titre" },
                {
                  name: "finalBody",
                  type: "textarea",
                  label: "Écran final — ce qui va se passer",
                  admin: { description: "{delai} est remplacé par le délai ci-dessus." },
                },
                { name: "paymentNote", type: "text", label: "Mention sur le règlement" },
                { name: "privacyNote", type: "textarea", label: "Mention sur les coordonnées" },
                {
                  name: "steps",
                  type: "array",
                  label: "Libellés des étapes",
                  labels: { singular: "Étape", plural: "Étapes" },
                  admin: { description: "Quatre étapes, dans l'ordre. Évitez « Confirmation » : rien n'est confirmé à ce stade." },
                  fields: [{ name: "label", type: "text", label: "Libellé" }],
                },
                {
                  name: "slots",
                  type: "array",
                  label: "Créneaux proposés",
                  labels: { singular: "Créneau", plural: "Créneaux" },
                  admin: { description: "Heures de début proposées au visiteur, format 24 h (ex. 19:00)." },
                  fields: [{ name: "time", type: "text", label: "Heure" }],
                },
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
                  label: "Terrains (plan du club)",
                  labels: { singular: "Terrain", plural: "Terrains" },
                  admin: {
                    description:
                      "Centre de chaque court sur le plan, en pourcentage de la largeur (X) et de la hauteur (Y).",
                  },
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
