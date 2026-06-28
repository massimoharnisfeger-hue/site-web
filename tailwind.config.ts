import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B1B3A", // navy profond — texte & contraste
        court: "#1B4DE4", // bleu électrique du terrain — primaire
        sky: "#4FA8FF", // bleu clair
        teal: "#00C2A8", // turquoise sportif — secondaire
        lime: "#CDFF3A", // vert citron de la balle — accent énergie
        cloud: "#EEF3FA", // fond clair
        haze: "#DCE6F4", // gris-bleu clair
      },
      fontFamily: {
        display: ["var(--font-display)", "Clash Display", "sans-serif"],
        sans: ["var(--font-sans)", "General Sans", "Inter", "sans-serif"],
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.05em",
      },
      keyframes: {
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "bounce-ball": {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-10px) scale(1.05)" },
        },
      },
      animation: {
        "gradient-pan": "gradient-pan 12s ease infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "bounce-ball": "bounce-ball 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
