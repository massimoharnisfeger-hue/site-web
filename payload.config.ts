import path from "path";
import { fileURLToPath } from "url";

import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Home } from "./globals/Home";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  // Compte utilisé pour se connecter au back-office
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: "— Padel House",
    },
  },

  // Collections (listes de contenus) et globals (contenu unique)
  collections: [Users, Media],
  globals: [Home],

  // Pas d'éditeur de texte riche : on n'utilise que des champs simples.

  // Clé secrète (signe les sessions). Définie dans les variables d'environnement.
  secret: process.env.PAYLOAD_SECRET || "",

  // Fichier de types TypeScript généré automatiquement
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  // Base de données MongoDB (gratuite via MongoDB Atlas)
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
    // Laisse plus de temps à la connexion lors d'un démarrage à froid (serverless).
    connectOptions: {
      serverSelectionTimeoutMS: 30000,
    },
  }),

  // Redimensionnement / optimisation des images
  sharp,

  // Stockage des images uploadées.
  // En production (Vercel), on utilise Vercel Blob ; en local, le dossier /media.
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
  ],
});
