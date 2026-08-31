/**
 * Vérifie les six propriétés du contrat du message de demande.
 * Exécution : node_modules/.bin/tsx scripts/verifier-message.ts
 */
import { buildBookingMessage, type BookingRequest } from "../lib/booking-message";

const demande: BookingRequest = {
  formule: "Location de terrain",
  date: "12/10/2026",
  creneau: "18:30",
  joueurs: 4,
  nom: "Camille Rousseau",
  email: "camille@exemple.fr",
  telephone: "06 12 34 56 78",
};

const resultats: [string, boolean][] = [];
const verifier = (nom: string, ok: boolean) => resultats.push([nom, ok]);

const m = buildBookingMessage(demande, "bonjour@padel-house.fr");

// 1 — les sept informations figurent dans le corps
const sept = [
  demande.formule, demande.date, demande.creneau, String(demande.joueurs),
  demande.nom, demande.email, demande.telephone,
];
verifier("les sept informations sont dans le corps", sept.every((v) => m.corps.includes(v)));

// 2 — l'objet porte formule, date et créneau
verifier(
  "l'objet contient formule, date et créneau",
  m.objet.includes(demande.formule) && m.objet.includes(demande.date) && m.objet.includes(demande.creneau)
);

// 3 — le destinataire vient de l'argument, jamais d'une valeur en dur
const autre = buildBookingMessage(demande, "contact@autre-club.fr");
verifier(
  "le destinataire vient de l'argument",
  m.mailtoUrl.startsWith("mailto:bonjour@padel-house.fr?") &&
    autre.mailtoUrl.startsWith("mailto:contact@autre-club.fr?")
);

// 4 — accents et espaces correctement encodés
verifier(
  "accents et espaces encodés",
  m.mailtoUrl.includes("%C3%A9") && !m.mailtoUrl.includes(" ") && decodeURIComponent(m.mailtoUrl.split("&body=")[1]).includes("Créneau")
);

// 5 — plafond de 1500 caractères tenu même sur une saisie anormale
const enorme = buildBookingMessage(
  { ...demande, nom: "É".repeat(900), formule: "Formule ".repeat(80) },
  "bonjour@padel-house.fr"
);
verifier(`plafond de 1500 tenu (${enorme.mailtoUrl.length})`, enorme.mailtoUrl.length <= 1500);

// 6 — e-mail de club vide → lien vide plutôt qu'un mailto cassé
const sansClub = buildBookingMessage(demande, "   ");
verifier(
  "e-mail du club vide → lien vide, corps conservé",
  sansClub.mailtoUrl === "" && sansClub.corps.includes(demande.nom)
);

// 7 — sauts de ligne CRLF
verifier("sauts de ligne en CRLF", m.corps.includes("\r\n"));

for (const [nom, ok] of resultats) console.log(`  ${ok ? "OK   " : "ECHEC"}  ${nom}`);
const passees = resultats.filter(([, o]) => o).length;
console.log(`\n  ${passees}/${resultats.length} propriétés vérifiées`);
process.exit(passees === resultats.length ? 0 : 1);
