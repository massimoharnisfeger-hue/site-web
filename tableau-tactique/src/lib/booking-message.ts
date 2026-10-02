// Composition du message de réservation. Fonction pure : aucun accès au DOM,
// aucun envoi, aucun stockage. C'est le visiteur qui envoie le message.

export type BookingRequest = {
  formule: string;
  /** Date au format jj/mm/aaaa. */
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
  /** Vide si l'URL dépasse 1 500 caractères ou si l'e-mail du club est vide. */
  mailtoUrl: string;
};

export const CRLF = "\r\n";
const MAILTO_MAX_LENGTH = 1500;
const LABEL_WIDTH = 10;

const row = (label: string, value: string) => `${label.padEnd(LABEL_WIDTH, " ")}: ${value}`;

export function buildBookingMessage(demande: BookingRequest, emailClub: string): BookingMessage {
  const objet = `Demande de réservation — ${demande.formule} — ${demande.date} ${demande.creneau}`;

  const corps = [
    "Bonjour,",
    "",
    "Je souhaite réserver :",
    "",
    row("Formule", demande.formule),
    row("Date", demande.date),
    row("Créneau", demande.creneau),
    row("Joueurs", String(demande.joueurs)),
    "",
    "Mes coordonnées :",
    "",
    row("Nom", demande.nom),
    row("E-mail", demande.email),
    row("Téléphone", demande.telephone),
    "",
    "Merci de me confirmer la disponibilité.",
  ].join(CRLF);

  const email = emailClub.trim();
  let mailtoUrl = email
    ? `mailto:${email}?subject=${encodeURIComponent(objet)}&body=${encodeURIComponent(corps)}`
    : "";
  if (mailtoUrl.length > MAILTO_MAX_LENGTH) mailtoUrl = "";

  return { objet, corps, mailtoUrl };
}

/** Le texte affiché et copié : la ligne d'objet, une ligne vide, puis le corps. */
export function bookingMessageText(message: BookingMessage): string {
  return `Objet : ${message.objet}${CRLF}${CRLF}${message.corps}`;
}
