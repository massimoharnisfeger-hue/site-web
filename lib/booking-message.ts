/**
 * Composition du message de demande de réservation.
 *
 * Fonction pure : aucun accès au DOM, aucun effet de bord, aucun appel réseau.
 * C'est ce qui la rend vérifiable hors navigateur — la seule couverture
 * possible dans un projet sans cadre de test.
 *
 * Contrat : specs/001-reservation-honnete/contracts/message-demande.md
 */

export type BookingRequest = {
  formule: string;
  date: string;
  creneau: string;
  joueurs: number;
  nom: string;
  email: string;
  telephone: string;
};

export type BookingMessage = {
  objet: string;
  corps: string;
  mailtoUrl: string;
};

/**
 * Plafond du lien. Les clients de messagerie n'ont pas de limite normalisée ;
 * 1500 laisse une marge confortable sous la valeur de sécurité usuelle de 2000,
 * pour un message qui en fait normalement 350 à 450.
 */
const MAX_URL = 1500;

/** Sauts de ligne CRLF : les clients Windows ignorent parfois un \n seul. */
const NL = "\r\n";

function ligne(etiquette: string, valeur: string) {
  return `${etiquette.padEnd(10)}: ${valeur}`;
}

export function buildBookingMessage(
  demande: BookingRequest,
  emailClub: string
): BookingMessage {
  const objet = `Demande de réservation — ${demande.formule} — ${demande.date} ${demande.creneau}`.trim();

  const corps = [
    "Bonjour,",
    "",
    "Je souhaite réserver :",
    "",
    ligne("Formule", demande.formule),
    ligne("Date", demande.date),
    ligne("Créneau", demande.creneau),
    ligne("Joueurs", String(demande.joueurs)),
    "",
    "Mes coordonnées :",
    "",
    ligne("Nom", demande.nom),
    ligne("E-mail", demande.email),
    ligne("Téléphone", demande.telephone),
    "",
    "Merci de me confirmer la disponibilité.",
  ].join(NL);

  // Sans adresse de club, un mailto: serait cassé : mieux vaut aucun lien, et
  // l'appelant se rabat sur le texte affiché.
  if (!emailClub.trim()) return { objet, corps, mailtoUrl: "" };

  const base = `mailto:${emailClub.trim()}?subject=${encodeURIComponent(objet)}&body=`;
  let mailtoUrl = base + encodeURIComponent(corps);

  if (mailtoUrl.length > MAX_URL) {
    // On tronque le corps, jamais l'objet ni le destinataire : une demande
    // amputée reste exploitable, un lien coupé au milieu ne l'est pas.
    const budget = MAX_URL - base.length;

    // Adresse de club anormalement longue : il ne reste aucune place pour le
    // corps. Renvoyer `base` seul produirait une URL plus longue que le plafond
    // et un message vide ; l'interface sait déjà se passer de lien.
    if (budget <= 0) return { objet, corps, mailtoUrl: "" };

    // La découpe se fait sur des points de code, jamais sur des unités UTF-16 :
    // couper entre les deux moitiés d'une paire de substitution (un emoji collé
    // dans le champ « Nom », par exemple) faisait lever `URIError` à
    // `encodeURIComponent`, et l'exception remontait jusqu'à la racine React.
    const points = [...corps];
    let coupe = corps;
    for (let fin = points.length; fin > 0; fin -= 20) {
      coupe = points.slice(0, fin).join("");
      if (encodeURIComponent(coupe).length <= budget) break;
      coupe = "";
    }
    mailtoUrl = base + encodeURIComponent(coupe);
  }

  return { objet, corps, mailtoUrl };
}
