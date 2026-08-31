/**
 * Vérifie les propriétés du contrat du message de demande.
 * Exécution : npm run verify
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

// 8 — campagne aléatoire : la fonction est appelée pendant le rendu, une
// exception y ferait tomber la page entière. On vérifie donc sur des saisies
// hostiles (emoji, séquences ZWJ, sauts de ligne, %, &, guillemets) qu'elle ne
// lève jamais, que le plafond tient, et surtout que le lien est **complet ou
// absent** : l'ancienne troncature coupait par la fin, c'est-à-dire pile sur le
// bloc de coordonnées, et le club recevait une demande sans moyen de rappeler.
const alphabet = [
  "A", "é", "😀", "汉", "%", "&", "#", "?", " ", "/", "\\", '"', "'", "<", ">",
  "👨‍👩‍👧", "🇫🇷", "\u200d", "\r", "\n",
];
const alea = (n: number) =>
  Array.from({ length: n }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");

let leve = 0;
let depasse = 0;
let ampute = 0;
const CAS = 5000;
for (let i = 0; i < CAS; i++) {
  const L = () => Math.floor(Math.random() * 900);
  try {
    const r = buildBookingMessage(
      {
        formule: alea(L()), date: alea(L()), creneau: alea(L()),
        joueurs: Math.floor(Math.random() * 99),
        nom: alea(L()), email: alea(L()), telephone: alea(L()),
      },
      "c".repeat(Math.floor(Math.random() * 110)) + "@club.example.fr"
    );
    if (r.mailtoUrl.length > 1500) depasse++;
    if (r.mailtoUrl && decodeURIComponent(r.mailtoUrl.split("&body=")[1] ?? "") !== r.corps) {
      ampute++;
    }
  } catch {
    leve++;
  }
}
verifier(`${CAS} saisies hostiles : aucune exception`, leve === 0);
verifier(`${CAS} saisies hostiles : plafond toujours tenu`, depasse === 0);
verifier(`${CAS} saisies hostiles : lien complet ou absent, jamais amputé`, ampute === 0);

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
