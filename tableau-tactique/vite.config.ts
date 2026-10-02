import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Le dossier parent contient un postcss.config.mjs de l'ancien projet :
  // une configuration PostCSS vide ici évite que Vite ne le charge.
  css: { postcss: { plugins: [] } },
  build: { target: "es2022" },
});
