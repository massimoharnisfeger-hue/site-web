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

/**
 * Plafonds par champ, exprimés en **longueur encodée** et non en caractères.
 *
 * Compter les points de code ne suffit pas : un emoji pèse quatre octets, donc
 * douze caractères une fois passé dans `encodeURIComponent`. Cent vingt emoji
 * dans le nom d'une formule suffisaient à faire déborder le lien, et la
 * troncature finale — qui coupe par la fin — supprimait alors exactement le
 * bloc de coordonnées. Le club recevait une demande sans aucun moyen de
 * rappeler le visiteur, soit l'inverse du but.
 *
 * Les plafonds sont dimensionnés pour que le pire cas tienne sous MAX_URL.
 * Attention : formule, date et créneau comptent **deux fois**, puisqu'ils
 * figurent dans l'objet autant que dans le corps. Le pire cas vaut donc
 * 2 × (160 + 40 + 40) + 180 + 150 + 50 = 860, auxquels s'ajoutent le texte fixe
 * et l'en-tête `mailto:`. Il reste ainsi de la marge pour une adresse de club
 * longue, qui n'est ni encodée ni bornée. La troncature en devient
 * inatteignable, et les coordonnées survivent par construction : `npm run
 * verify` le vérifie sur 20 000 cas aléatoires.
 */
const PLAFONDS = {
  formule: 160,
  date: 40,
  creneau: 40,
  nom: 180,
  email: 150,
  telephone: 50,
} as const;

/**
 * Ramène une valeur sous `maxEncode` caractères une fois encodée, en retirant
 * des points de code entiers — jamais la moitié d'une paire de substitution,
 * qui ferait lever `URIError` à l'encodage.
 */
function borner(valeur: string, maxEncode: number): string {
  const points = [...String(valeur ?? "")];
  if (encodeURIComponent(points.join("")).length <= maxEncode) {
    return points.join("");
  }
  let bas = 0;
  let haut = points.length;
  while (bas < haut) {
    const milieu = Math.ceil((bas + haut) / 2);
    if (encodeURIComponent(points.slice(0, milieu).join("")).length <= maxEncode) {
      bas = milieu;
    } else {
      haut = milieu - 1;
    }
  }
  return points.slice(0, bas).join("");
}

export function buildBookingMessage(
  demande: BookingRequest,
  emailClub: string
): BookingMessage {
  const d = {
    formule: borner(demande.formule, PLAFONDS.formule),
    date: borner(demande.date, PLAFONDS.date),
    creneau: borner(demande.creneau, PLAFONDS.creneau),
    joueurs: Number.isFinite(demande.joueurs) ? demande.joueurs : 0,
    nom: borner(demande.nom, PLAFONDS.nom),
    email: borner(demande.email, PLAFONDS.email),
    telephone: borner(demande.telephone, PLAFONDS.telephone),
  };

  const objet = `Demande de réservation — ${d.formule} — ${d.date} ${d.creneau}`.trim();

  const corps = [
    "Bonjour,",
    "",
    "Je souhaite réserver :",
    "",
    ligne("Formule", d.formule),
    ligne("Date", d.date),
    ligne("Créneau", d.creneau),
    ligne("Joueurs", String(d.joueurs)),
    "",
    "Mes coordonnées :",
    "",
    ligne("Nom", d.nom),
    ligne("E-mail", d.email),
    ligne("Téléphone", d.telephone),
    "",
    "Merci de me confirmer la disponibilité.",
  ].join(NL);

  // Sans adresse de club, un mailto: serait cassé : mieux vaut aucun lien, et
  // l'appelant se rabat sur le texte affiché.
  if (!emailClub.trim()) return { objet, corps, mailtoUrl: "" };

  const base = `mailto:${emailClub.trim()}?subject=${encodeURIComponent(objet)}&body=`;
  let mailtoUrl = base + encodeURIComponent(corps);

  // Le lien est complet ou absent, jamais amputé.
  //
  // L'ancienne version tronquait le corps par la fin. Or le corps se termine
  // par le nom, l'e-mail et le téléphone : couper revenait à envoyer au club une
  // demande sans aucun moyen de rappeler le visiteur — exactement l'inverse du
  // but. Les plafonds par champ rendent ce cas inatteignable ; s'il survenait
  // malgré tout (adresse de club démesurée), mieux vaut aucun lien. L'interface
  // sait s'en passer : le texte complet reste affiché et copiable, et les
  // coordonnées du club sont données en clair juste à côté.
  if (mailtoUrl.length > MAX_URL) {
    return { objet, corps, mailtoUrl: "" };
  }

  return { objet, corps, mailtoUrl };
}
