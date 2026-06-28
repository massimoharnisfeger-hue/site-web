import type { CollectionConfig } from "payload";

// Les comptes qui peuvent se connecter au back-office /admin.
export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Utilisateur", plural: "Utilisateurs" },
  auth: true,
  admin: {
    useAsTitle: "email",
    group: "Réglages",
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nom",
    },
  ],
};
