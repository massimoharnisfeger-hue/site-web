import type { CollectionConfig } from "payload";

// Bibliothèque d'images : tout ce que tu téléverses depuis le back-office.
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Image", plural: "Médias" },
  admin: { group: "Contenu" },
  access: {
    // Les images sont visibles publiquement sur le site
    read: () => true,
  },
  upload: {
    // Tailles générées automatiquement (optimisation)
    imageSizes: [
      { name: "card", width: 1200, height: undefined, position: "centre" },
      { name: "thumbnail", width: 600, height: undefined, position: "centre" },
    ],
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Texte alternatif (accessibilité / SEO)",
    },
  ],
};
