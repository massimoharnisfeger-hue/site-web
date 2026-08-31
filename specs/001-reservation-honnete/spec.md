# Feature Specification: Réservation honnête

**Feature Branch**: `001-reservation-honnete`

**Created**: 2026-08-31

**Status**: Draft

**Input**: User description: "Refonte honnête du tunnel de réservation de Padel House. Aujourd'hui le formulaire affiche « Confirmer & payer », simule un paiement puis annonce « Terrain réservé — un récapitulatif part vers votre e-mail » : rien n'est enregistré, aucun paiement n'est prélevé, aucun e-mail n'est envoyé. Le visiteur doit choisir sa formule et son créneau, laisser ses coordonnées, et obtenir une confirmation qui correspond exactement à ce que le club sait honorer aujourd'hui."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Le visiteur obtient une réponse vraie (Priority: P1)

Un joueur choisit une formule et un créneau, laisse son nom, son e-mail et son
téléphone, puis valide. L'écran final lui dit exactement ce qui vient de se
passer : son message de demande est prêt à partir vers le club, rien n'est
encore réservé, et le club le recontacte une fois la demande reçue. Aucun paiement ne lui est
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
   **Then** l'écran final indique que rien n'est réservé tant que le club n'a
   pas rappelé, et précise sous quel délai il le fait.
2. **Given** un visiteur sur l'étape finale, **When** il lit le bouton de
   validation, **Then** celui-ci annonce une demande, jamais un paiement.
3. **Given** un visiteur qui a validé, **When** il relit l'écran final,
   **Then** il y retrouve la formule, la date, le créneau et le nombre de
   joueurs qu'il a saisis.

---

### User Story 2 - Le gérant reçoit la demande par e-mail (Priority: P1)

À la validation, le site ouvre chez le visiteur un message pré-rempli adressé
au club, contenant tout ce qu'il faut pour rappeler : formule, date, créneau,
nombre de joueurs, nom, e-mail, téléphone. Le visiteur relit et envoie. Le club
reçoit la demande dans sa boîte habituelle, sans nouvel outil à consulter.

**Why this priority**: une demande que personne ne reçoit ne vaut pas mieux
qu'une fausse confirmation. Les deux premières histoires forment ensemble le
minimum livrable.

**Independent Test**: parcourir le tunnel, valider, et vérifier que le message
proposé est adressé au club, porte un objet identifiable et contient les sept
informations saisies.

**Acceptance Scenarios**:

1. **Given** un visiteur qui valide, **When** le message s'ouvre, **Then** il
   est adressé à l'e-mail du club renseigné dans le back-office, avec un objet
   qui identifie la demande.
2. **Given** le message pré-rempli, **When** le gérant le reçoit, **Then** il y
   trouve les sept informations saisies, en clair et lisibles.
3. **Given** un visiteur dont l'appareil n'a aucune messagerie configurée,
   **When** il valide, **Then** le texte complet de la demande lui est affiché
   à copier, avec l'adresse du club et son numéro de téléphone.

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

- L'appareil du visiteur n'a pas de messagerie configurée — cas fréquent sur un
  mobile sans compte mail : le texte complet reste affiché et copiable, avec
  l'adresse et le numéro du club.
- Le visiteur compose le message mais ne l'envoie jamais : le club ne reçoit
  rien et ne peut pas le savoir. C'est la limite acceptée de ce choix, et
  l'écran final ne doit donc jamais parler de demande « envoyée ».
- Le visiteur soumet deux fois la même demande : le gérant reçoit deux messages
  au même objet et reconnaît le doublon.
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
- **FR-003**: L'écran final DOIT distinguer explicitement une demande envoyée
  au club d'une réservation confirmée, et énoncer la prochaine étape côté club.
- **FR-004**: L'écran final DOIT rappeler au visiteur la formule, la date, le
  créneau et le nombre de joueurs qu'il a saisis.
- **FR-005**: Le message pré-rempli DOIT contenir sept informations : formule,
  date, créneau, nombre de joueurs, nom, e-mail, téléphone.
- **FR-006**: Le message DOIT être adressé à l'e-mail du club renseigné dans le
  back-office, et porter un objet qui identifie la demande au premier coup d'œil.
- **FR-007**: Le système DOIT valider l'e-mail et le téléphone avant l'envoi, et
  indiquer quoi corriger en cas d'erreur.
- **FR-008**: Le système NE DOIT PAS proposer un créneau déjà passé.
- **FR-009**: Le système NE DOIT PAS affirmer que le message a été envoyé : il
  ne peut pas le savoir. L'écran final DOIT indiquer que la demande part une
  fois le message envoyé depuis la messagerie du visiteur.
- **FR-009b**: Si aucune messagerie ne s'ouvre, le texte complet de la demande
  DOIT rester affiché et copiable, accompagné de l'adresse e-mail et du numéro
  du club.
- **FR-010**: L'écran final DOIT proposer un appel direct et un message
  pré-rempli vers les coordonnées du club renseignées dans le back-office.
- **FR-011**: Tous les textes visibles du tunnel DOIVENT être modifiables depuis
  le back-office, avec un texte de repli si le champ est vide.
- **FR-012**: Le délai de réponse annoncé DOIT être un champ éditable, jamais
  une valeur écrite dans le code.
- **FR-013**: Le tunnel DOIT rester utilisable au clavier et annoncer ses
  erreurs aux technologies d'assistance.
- **FR-014**: Le visiteur DOIT être informé, avant de saisir ses coordonnées,
  que le site ne les enregistre pas et qu'elles ne servent qu'à composer le
  message qu'il enverra lui-même.
- **FR-015**: Le système NE DOIT conserver aucune coordonnée de visiteur : ni
  en base, ni dans un journal, ni chez un tiers. Les données saisies vivent dans
  la page le temps de la visite et disparaissent à sa fermeture.

### Key Entities

- **Demande de réservation** : formule choisie, date, créneau, nombre de
  joueurs, nom, e-mail, téléphone. Entité **transitoire** : elle n'existe que
  dans la page du visiteur, le temps de composer le message. Aucune persistance,
  aucune donnée de paiement.
- **Formule** : entité existante (nom, durée, niveau, tarif) ; la demande y fait
  référence sans la dupliquer.
- **Coordonnées du club** : téléphone, e-mail, adresse ; entité existante,
  réutilisée par l'écran final.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Aucun écran du tunnel n'emploie les termes « payer », « confirmé »,
  « réservé » ou « récapitulatif envoyé » — vérifiable par lecture des textes
  servis.
- **SC-002**: 100 % des messages pré-remplis contiennent les sept informations
  saisies et sont adressés à l'e-mail du club.
- **SC-003**: Un visiteur non prévenu, invité à décrire ce qui vient de se
  passer après avoir validé, répond « ma demande est partie, le club va me
  rappeler » et non « mon terrain est réservé ».
- **SC-004**: Le gérant traite une demande depuis sa boîte mail habituelle,
  sans ouvrir d'outil supplémentaire.
- **SC-005**: Le délai de réponse annoncé au visiteur peut être modifié en moins
  de deux minutes, sans mise en production.
- **SC-006**: 0 visiteur voit un message affirmant que sa demande a été envoyée,
  puisque le site ne peut pas le vérifier ; 100 % disposent du texte à copier et
  du numéro du club en cas d'échec d'ouverture de la messagerie.
- **SC-008**: Aucune coordonnée de visiteur n'est trouvable en base ni dans les
  journaux après une demande — vérifiable par inspection.
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
- **Aucune trace côté club tant que le visiteur n'envoie pas.** C'est le prix du
  choix retenu : zéro donnée personnelle stockée, zéro obligation RGPD de
  conservation, mais aucune garantie de réception et aucune statistique de
  demandes. Un enregistrement en base reste la suite naturelle si le volume
  justifie un jour de suivre les demandes perdues.

## Clarifications

### Session 2026-08-31

- Q: Où part la demande une fois validée — enregistrement en base, e-mail
  pré-rempli chez le visiteur, ou redirection vers un logiciel tiers ?
  → A: E-mail pré-rempli ouvert chez le visiteur, aucun stockage.
- Q: Combien de temps conserver les coordonnées du visiteur ?
  → A: Sans objet — le choix précédent supprime toute conservation (FR-015).
