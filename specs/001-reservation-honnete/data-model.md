# Phase 1 — Modèle de données

## Entité transitoire : Demande de réservation

Elle n'est **jamais persistée**. Elle vit dans l'état React du composant le
temps de la visite et disparaît à la fermeture de l'onglet. Aucune écriture en
base, aucun journal, aucun tiers (FR-015, SC-008).

| Champ | Type | Origine | Validation |
|---|---|---|---|
| `formule` | référence | choisie parmi `offres.items` | une formule obligatoire |
| `date` | date | mini-calendrier | ≥ aujourd'hui (D6) |
| `creneau` | texte | liste d'horaires | obligatoire ; passé désactivé le jour même |
| `joueurs` | entier | sélecteur | 1 à 4 |
| `nom` | texte | saisie | non vide, 2 caractères minimum |
| `email` | texte | saisie | permissive (D5) |
| `telephone` | texte | saisie | ≥ 8 chiffres après nettoyage (D5) |

Transitions d'état du tunnel : `formule → créneau → coordonnées → message`.
Le retour arrière est possible à chaque étape et ne perd aucune saisie.

**Aucun état « confirmée »** n'existe : le site ne peut pas le connaître.

---

## Contenu éditable ajouté

Onglet **Réservation & Pied de page** du back-office. Chaque champ a une valeur
par défaut et une lecture avec repli (principe II).

| Champ | Rôle | Valeur par défaut |
|---|---|---|
| `reservation.ctaLabel` | libellé du bouton final | « Préparer ma demande » |
| `reservation.responseDelay` | délai de réponse annoncé | « sous 24 h ouvrées » |
| `reservation.finalTitle` | titre de l'écran final | « Votre demande est prête » |
| `reservation.finalBody` | ce qui va se passer | « Envoyez le message qui vient de s'ouvrir. Le club vous rappelle {délai} pour confirmer le créneau. Rien n'est réservé avant ce rappel. » |
| `reservation.paymentNote` | mention sur le règlement | « Aucun paiement en ligne : le règlement se fait sur place. » |
| `reservation.privacyNote` | usage des coordonnées | « Vos coordonnées ne sont pas enregistrées : elles servent uniquement à composer le message que vous enverrez. » |

## Entités existantes réutilisées

- **Formule** (`offres.items`) — nom, durée, niveau, tarif. Référencée, non dupliquée.
- **Coordonnées du club** (`footer`) — `email`, `phone`, adresse. Alimentent le
  destinataire du message, le lien d'appel et le bloc de repli.
