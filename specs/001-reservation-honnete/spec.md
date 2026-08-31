# Feature Specification: Réservation honnête

**Feature Branch**: `001-reservation-honnete`

**Created**: 2026-08-31

**Status**: Draft

**Input**: User description: "Refonte honnête du tunnel de réservation de Padel House. Aujourd'hui le formulaire affiche « Confirmer & payer », simule un paiement puis annonce « Terrain réservé — un récapitulatif part vers votre e-mail » : rien n'est enregistré, aucun paiement n'est prélevé, aucun e-mail n'est envoyé. Le visiteur doit choisir sa formule et son créneau, laisser ses coordonnées, et obtenir une confirmation qui correspond exactement à ce que le club sait honorer aujourd'hui."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Le visiteur obtient une réponse vraie (Priority: P1)

Un joueur choisit une formule et un créneau, laisse son nom, son e-mail et son
téléphone, puis valide. L'écran final lui dit exactement ce qui vient de se
passer : sa demande est transmise au club, elle n'est pas encore confirmée, et
le club le recontacte pour valider le créneau. Aucun paiement ne lui est
annoncé, aucun e-mail ne lui est promis que le club n'enverra pas.

**Why this priority**: c'est le seul défaut du site qui produit un dommage réel.
Un joueur qui croit son terrain réservé se déplace pour rien, et annoncer un
paiement et une confirmation qui n'existent pas est une pratique commerciale
trompeuse. Tant que ce point n'est pas corrigé, envoyer du trafic sur le site
aggrave le problème.

**Independent Test**: parcourir le tunnel de bout en bout et vérifier qu'aucun
écran n'emploie les mots « payer », « confirmé » ou « récapitulatif envoyé »,
et que l'écran final énonce l'état réel de la demande ainsi que la suite
attendue.

**Acceptance Scenarios**:

1. **Given** un visiteur au bout du tunnel, **When** il valide sa demande,
   **Then** l'écran final indique que la demande est transmise et pas encore
   confirmée, et précise sous quel délai le club répond.
2. **Given** un visiteur sur l'étape finale, **When** il lit le bouton de
   validation, **Then** celui-ci annonce une demande, jamais un paiement.
3. **Given** un visiteur qui a validé, **When** il relit l'écran final,
   **Then** il y retrouve la formule, la date, le créneau et le nombre de
   joueurs qu'il a saisis.

---

### User Story 2 - Le gérant reçoit la demande (Priority: P1)

Le gérant doit recevoir chaque demande avec assez d'informations pour rappeler
le joueur et bloquer le terrain : formule, date, créneau, nombre de joueurs,
nom, e-mail, téléphone, et le moment de la demande.

**Why this priority**: une demande que personne ne reçoit ne vaut pas mieux
qu'une fausse confirmation. Les deux premières histoires forment ensemble le
minimum livrable.

**Independent Test**: soumettre une demande de test et vérifier que le gérant
la retrouve, sans intervention technique, avec les huit informations attendues.

**Acceptance Scenarios**:

1. **Given** une demande soumise, **When** le gérant consulte son canal de
   réception, **Then** il y trouve les huit informations et l'horodatage.
2. **Given** une demande soumise, **When** le gérant la traite, **Then** il
   peut la marquer comme traitée sans supprimer la trace.

---

### User Story 3 - Le visiteur sait quoi faire si c'est urgent (Priority: P2)

Un joueur qui veut jouer ce soir ne peut pas attendre un rappel. L'écran final
lui propose deux actions immédiates : appeler le club, ou lui écrire, avec les
coordonnées réelles du club.

**Why this priority**: convertit les demandes urgentes qui seraient autrement
perdues, et donne une porte de sortie quand le délai de rappel ne convient pas.

**Independent Test**: depuis l'écran final sur mobile, le bouton d'appel ouvre
le composeur avec le numéro du club.

**Acceptance Scenarios**:

1. **Given** l'écran final sur mobile, **When** le visiteur touche « Appeler le
   club », **Then** le composeur s'ouvre avec le numéro renseigné dans le
   back-office.
2. **Given** l'écran final, **When** le visiteur choisit d'écrire au club,
   **Then** un message pré-rempli avec le détail de sa demande est proposé.

---

### User Story 4 - Le gérant règle les mots sans développeur (Priority: P3)

Tous les textes du tunnel — libellés des boutons, message de l'écran final,
délai de réponse annoncé, mention sur le paiement — sont modifiables depuis le
back-office.

**Why this priority**: le délai de rappel et les modalités de paiement vont
changer. Chaque changement ne doit pas demander une mise en production.

**Independent Test**: modifier le délai annoncé dans le back-office et le voir
apparaître sur le site sans redéploiement.

**Acceptance Scenarios**:

1. **Given** un texte du tunnel modifié dans le back-office, **When** le
   visiteur recharge la page, **Then** le nouveau texte s'affiche.
2. **Given** un texte vidé dans le back-office, **When** le visiteur consulte
   le tunnel, **Then** le texte de démonstration s'affiche à la place.

---

### Edge Cases

- Le visiteur valide alors que le service de réception est indisponible : il
  doit être informé que la demande n'est pas partie, et se voir proposer
  l'appel et l'e-mail comme solution de repli. Aucun faux succès.
- Le visiteur soumet deux fois la même demande : le gérant doit pouvoir
  reconnaître le doublon.
- Le créneau demandé n'est plus libre quand le club rappelle : le tunnel
  n'ayant jamais promis la disponibilité, le club propose une alternative.
- Le visiteur saisit un e-mail ou un téléphone invalide : la validation est
  refusée avec un message qui dit quoi corriger, avant l'envoi.
- La base de données est injoignable : le site public reste consultable et le
  tunnel affiche les coordonnées du club plutôt qu'un formulaire cassé.
- Le visiteur demande un créneau dans le passé : le choix est impossible.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le tunnel NE DOIT PAS annoncer de paiement, de confirmation
  ferme, ni d'envoi d'e-mail tant que le club ne réalise pas ces trois actions.
- **FR-002**: Le bouton de validation DOIT décrire l'action réelle (transmettre
  une demande).
- **FR-003**: L'écran final DOIT distinguer explicitement « demande transmise »
  de « réservation confirmée », et énoncer la prochaine étape côté club.
- **FR-004**: L'écran final DOIT rappeler au visiteur la formule, la date, le
  créneau et le nombre de joueurs qu'il a saisis.
- **FR-005**: Le système DOIT transmettre au gérant huit informations : formule,
  date, créneau, nombre de joueurs, nom, e-mail, téléphone, horodatage.
- **FR-006**: Le gérant DOIT pouvoir marquer une demande comme traitée sans en
  perdre la trace.
- **FR-007**: Le système DOIT valider l'e-mail et le téléphone avant l'envoi, et
  indiquer quoi corriger en cas d'erreur.
- **FR-008**: Le système NE DOIT PAS proposer un créneau déjà passé.
- **FR-009**: En cas d'échec de la transmission, le système DOIT le dire et
  proposer l'appel et l'e-mail comme repli. Aucun message de succès ne doit
  s'afficher.
- **FR-010**: L'écran final DOIT proposer un appel direct et un message
  pré-rempli vers les coordonnées du club renseignées dans le back-office.
- **FR-011**: Tous les textes visibles du tunnel DOIVENT être modifiables depuis
  le back-office, avec un texte de repli si le champ est vide.
- **FR-012**: Le délai de réponse annoncé DOIT être un champ éditable, jamais
  une valeur écrite dans le code.
- **FR-013**: Le tunnel DOIT rester utilisable au clavier et annoncer ses
  erreurs aux technologies d'assistance.
- **FR-014**: Le visiteur DOIT être informé de l'usage fait de ses coordonnées
  avant de les transmettre, avec un lien vers la politique de confidentialité.
- **FR-015**: Le système DOIT conserver les demandes [NEEDS CLARIFICATION:
  durée de conservation des coordonnées des visiteurs ?] puis les supprimer.

### Key Entities

- **Demande de réservation** : formule choisie, date, créneau, nombre de
  joueurs, nom, e-mail, téléphone, horodatage de soumission, état (nouvelle /
  traitée). Aucune donnée de paiement.
- **Formule** : entité existante (nom, durée, niveau, tarif) ; la demande y fait
  référence sans la dupliquer.
- **Coordonnées du club** : téléphone, e-mail, adresse ; entité existante,
  réutilisée par l'écran final.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Aucun écran du tunnel n'emploie les termes « payer », « confirmé »
  ou « récapitulatif envoyé » — vérifiable par lecture des textes servis.
- **SC-002**: 100 % des demandes soumises parviennent au gérant avec les huit
  informations attendues.
- **SC-003**: Un visiteur non prévenu, invité à décrire ce qui vient de se
  passer après avoir validé, répond « ma demande est partie, le club va me
  rappeler » et non « mon terrain est réservé ».
- **SC-004**: Le gérant peut traiter une demande de bout en bout sans ouvrir un
  outil technique.
- **SC-005**: Le délai de réponse annoncé au visiteur peut être modifié en moins
  de deux minutes, sans mise en production.
- **SC-006**: Lorsque la transmission échoue, 0 visiteur voit un message de
  succès ; tous se voient proposer un moyen de contact direct.
- **SC-007**: Le tunnel se parcourt entièrement au clavier, et chaque cible
  interactive mesure au moins 44 pixels.

## Assumptions

- **Aucun paiement en ligne.** Aucun prestataire n'est en place ; le règlement
  se fait sur place ou lors du rappel. La spécification ne couvre pas le
  paiement.
- **La disponibilité des créneaux n'est pas vérifiée.** Le site ne connaît pas
  l'agenda réel du club. Le créneau choisi est un souhait, pas une réservation
  ferme — d'où la distinction demande / confirmation.
- **Délai de réponse par défaut : 24 heures ouvrées**, valeur éditable et non
  contractuelle tant que le gérant ne l'a pas confirmée.
- **Volume attendu faible** : quelques demandes par jour. Aucune exigence de
  montée en charge.
- **Le contenu de démonstration reste le repli** : si le back-office n'a pas été
  renseigné, le tunnel affiche des textes cohérents plutôt que du vide.
- **Le gérant dispose d'un accès au back-office** ; la création de son compte
  est un prérequis hors périmètre.

## Clarifications

### Session 2026-08-31

*(à compléter par `/speckit-clarify`)*
