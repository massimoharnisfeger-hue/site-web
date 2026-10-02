import { test } from "node:test";
import assert from "node:assert/strict";
import { buildBookingMessage, bookingMessageText, CRLF } from "./booking-message.ts";

const demande = {
  formule: "Location de terrain",
  date: "14/10/2026",
  creneau: "19:00",
  joueurs: 4,
  nom: "Camille Rivière",
  email: "camille@email.com",
  telephone: "06 12 34 56 78",
};

test("l'objet reprend formule, date et créneau", () => {
  const { objet } = buildBookingMessage(demande, "contact@padel-house.fr");
  assert.equal(objet, "Demande de réservation — Location de terrain — 14/10/2026 19:00");
});

test("le corps suit le gabarit, en CRLF, avec des étiquettes alignées sur 10 caractères", () => {
  const { corps } = buildBookingMessage(demande, "contact@padel-house.fr");
  const attendu = [
    "Bonjour,",
    "",
    "Je souhaite réserver :",
    "",
    "Formule   : Location de terrain",
    "Date      : 14/10/2026",
    "Créneau   : 19:00",
    "Joueurs   : 4",
    "",
    "Mes coordonnées :",
    "",
    "Nom       : Camille Rivière",
    "E-mail    : camille@email.com",
    "Téléphone : 06 12 34 56 78",
    "",
    "Merci de me confirmer la disponibilité.",
  ].join(CRLF);
  assert.equal(corps, attendu);
  assert.ok(!corps.includes("\n".padStart(1) + "") || !/(?<!\r)\n/.test(corps), "aucun LF isolé");
  for (const ligne of corps.split(CRLF).filter((l) => /^(Formule|Date|Créneau|Joueurs|Nom|E-mail|Téléphone)/.test(l))) {
    assert.equal(ligne.indexOf(":"), 10, `deux-points en colonne 10 : « ${ligne} »`);
  }
});

test("le texte affiché commence par la ligne d'objet puis une ligne vide", () => {
  const message = buildBookingMessage(demande, "contact@padel-house.fr");
  const texte = bookingMessageText(message);
  assert.ok(texte.startsWith(`Objet : ${message.objet}${CRLF}${CRLF}Bonjour,`));
});

test("l'URL mailto encode objet et corps, sans la ligne d'objet dans le corps", () => {
  const { objet, corps, mailtoUrl } = buildBookingMessage(demande, "contact@padel-house.fr");
  assert.equal(
    mailtoUrl,
    `mailto:contact@padel-house.fr?subject=${encodeURIComponent(objet)}&body=${encodeURIComponent(corps)}`,
  );
  assert.ok(!decodeURIComponent(mailtoUrl.split("body=")[1]).startsWith("Objet"));
  assert.ok(mailtoUrl.length <= 1500);
});

test("l'URL mailto est vide si l'e-mail du club est vide", () => {
  assert.equal(buildBookingMessage(demande, "").mailtoUrl, "");
  assert.equal(buildBookingMessage(demande, "   ").mailtoUrl, "");
});

test("l'URL mailto est vide au-delà de 1 500 caractères, le texte reste disponible", () => {
  const longue = { ...demande, nom: "N".repeat(1200) };
  const message = buildBookingMessage(longue, "contact@padel-house.fr");
  assert.equal(message.mailtoUrl, "");
  assert.ok(message.corps.includes("N".repeat(1200)));
});
