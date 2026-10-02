import type { Config } from "tailwindcss";

/**
 * Direction « Tableau tactique » : le site comme le tableau d'un coach.
 * Plans de court au trait blanc sur le bleu du gazon, annotations en mono,
 * une seule touche de jaune — la balle.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F4F6F9", // fond de page
        card: "#FFFFFF", // cartes, panneaux, champs
        ink: "#0D1B2A", // texte principal
        muted: "#526073", // texte secondaire (5,7:1 sur paper)
        rule: "rgba(13, 27, 42, 0.12)", // filets et bordures
        turf: "#1F55A8", // bleu du gazon : plans, boutons, liens
        "turf-deep": "#17417F", // survol, pied de page
        glass: "#CDE8FF", // vitres sur les plans
        ball: "#DFF24A", // la balle — jamais en texte, jamais en aplat
        danger: "#B42318", // erreurs de saisie
      },
      fontFamily: {
        display: ["var(--font-display)", "Helvetica Neue", "Arial", "sans-serif"],
        sans: ["var(--font-sans)", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "Menlo", "Consolas", "monospace"],
      },
      maxWidth: {
        site: "1240px",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
