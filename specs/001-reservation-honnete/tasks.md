---

description: "Tâches d'implémentation — Réservation honnête"
---

# Tasks: Réservation honnête

**Input**: Design documents from `/specs/001-reservation-honnete/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: la spécification demande explicitement une fonction pure vérifiable
(contrats, propriétés 1 à 6). Les tâches de vérification correspondantes sont
donc incluses. Le projet n'a pas de cadre de test : la vérification passe par un
script exécuté avec `tsx`, sur le modèle de `lib/unsplash.ts`.

**Organization**: une phase par histoire utilisateur, chacune livrable et
vérifiable seule.

## Format: `[ID] [P?] [Story] Description`

- **[P]** : parallélisable (fichiers différents, aucune dépendance ouverte)
- **[Story]** : histoire couverte (US1 à US4)

---

## Phase 1: Setup

**But** : rien à installer. Cette feature n'ajoute aucune dépendance
(constitution, principe III).

- [X] T001 Vérifier l'état de départ en exécutant `npm run lint` et `npm run build` à la racine du dépôt

---

## Phase 2: Foundational

**⚠️ Bloquant** : aucune histoire ne peut être livrée avant que le contenu et la
fonction de composition existent.

- [X] T002 [P] Étendre `ReservationContent` dans `lib/types.ts` avec les six champs éditables du modèle de données (ctaLabel, responseDelay, finalTitle, finalBody, paymentNote, privacyNote)
- [X] T003 [P] Créer la fonction pure `buildBookingMessage` dans `lib/booking-message.ts` conformément à `contracts/message-demande.md` (objet, corps, encodage `\r\n`, plafond 1500 caractères, e-mail club vide → lien vide)
- [X] T004 Ajouter les six champs à l'onglet Réservation dans `globals/Home.ts`, chacun avec son libellé français
- [X] T005 Ajouter les six valeurs par défaut dans `defaultContent.reservation` de `lib/content.ts` en reprenant les textes du modèle de données
- [X] T006 Ajouter les six lectures avec repli dans `getHome` de `lib/content.ts` (principe II)
- [X] T007 Écrire le script de vérification `scripts/verifier-message.ts` couvrant les six propriétés du contrat, exécutable par `node_modules/.bin/tsx`
- [X] T008 Exécuter `npm run generate:types` et vérifier que les six champs apparaissent dans `payload-types.ts`

**Checkpoint** : le contenu est éditable et la composition du message est prouvée hors navigateur.

---

## Phase 3: User Story 1 — Le visiteur obtient une réponse vraie (P1) 🎯 MVP

**But** : plus aucun écran n'annonce un paiement, une confirmation ou un e-mail
envoyé.

**Test indépendant** : parcourir le tunnel et vérifier qu'aucun écran n'emploie
« payer », « confirmé », « réservé » ou « récapitulatif envoyé », et que l'écran
final énonce l'état réel de la demande.

- [X] T009 [US1] Supprimer la simulation de paiement dans `components/sections/Booking.tsx` : retirer l'état `processing`, le `setTimeout` et le libellé « Paiement… »
- [X] T010 [US1] Remplacer le libellé du bouton final par `reservation.ctaLabel` dans `components/sections/Booking.tsx` (FR-002)
- [X] T011 [US1] Réécrire l'écran final de `components/sections/Booking.tsx` : titre, corps et mention de paiement issus du contenu, distinguant explicitement demande et réservation (FR-003, FR-009)
- [X] T012 [US1] Afficher sur l'écran final le rappel de la formule, la date, le créneau et le nombre de joueurs saisis (FR-004)
- [X] T013 [US1] Insérer la mention sur les coordonnées non enregistrées avant la saisie, à l'étape 3 de `components/sections/Booking.tsx` (FR-014)
- [X] T014 [US1] Vérifier SC-001 : `curl -s http://127.0.0.1:3000/ | grep -ciE "confirmé|récapitulatif part|Confirmer & payer"` renvoie 0

**Checkpoint** : le mensonge est supprimé. Le site est déjà publiable en l'état.

---

## Phase 4: User Story 2 — Le gérant reçoit la demande par e-mail (P1)

**But** : la demande parvient réellement au club.

**Test indépendant** : valider le tunnel et vérifier que le message proposé est
adressé au club, porte un objet identifiable et contient les sept informations.

- [X] T015 [US2] Brancher `buildBookingMessage` sur l'état du tunnel dans `components/sections/Booking.tsx`, avec `footer.email` comme destinataire (FR-006)
- [X] T016 [US2] Afficher le corps du message en clair dans un élément sélectionnable sur l'écran final, chemin nominal et non repli (décision D1, FR-009b)
- [X] T017 [US2] Ajouter le bouton « Ouvrir ma messagerie » pointant sur `mailtoUrl`, en commodité posée par-dessus le texte affiché
- [X] T018 [US2] Ajouter le bouton de copie via `navigator.clipboard.writeText`, avec repli sur la sélection du texte si l'API échoue (décision D4)
- [X] T019 [US2] Vérifier sous Chromium que le lien contient les sept informations et l'e-mail du club, accents correctement encodés

**Checkpoint** : le club reçoit les demandes. Avec la phase 3, c'est le livrable minimum complet.

---

## Phase 5: User Story 3 — Le visiteur sait quoi faire si c'est urgent (P2)

**But** : offrir une issue immédiate quand le délai de rappel ne convient pas.

**Test indépendant** : depuis l'écran final sur mobile, le bouton d'appel ouvre
le composeur avec le numéro du club.

- [X] T020 [US3] Ajouter le bouton d'appel `tel:` alimenté par `footer.phone` sur l'écran final de `components/sections/Booking.tsx` (FR-010)
- [X] T021 [US3] Afficher l'e-mail et le numéro du club en clair à côté du texte copiable, pour le cas sans messagerie configurée (FR-009b)
- [X] T022 [US3] Vérifier que les deux boutons mesurent au moins 44 px de haut sous Chromium en 390 px (SC-007)

**Checkpoint** : les demandes urgentes ne sont plus perdues.

---

## Phase 6: User Story 4 — Le gérant règle les mots sans développeur (P3)

**But** : aucun texte du tunnel n'est figé dans le code.

**Test indépendant** : modifier le délai annoncé dans le back-office et le voir
apparaître sans redéploiement.

- [X] T023 [US4] Auditer `components/sections/Booking.tsx` et remplacer tout texte restant en dur par un champ de contenu (FR-011, principe I)
- [X] T024 [US4] Insérer `reservation.responseDelay` dans le corps de l'écran final plutôt qu'un délai écrit dans le code (FR-012)
- [X] T025 [US4] Vérifier qu'un champ vidé fait apparaître le texte de démonstration et non un blanc (principe II)

**Checkpoint** : le gérant est autonome sur tous les mots du tunnel.

---

## Phase 7: Polish

- [X] T026 [P] Empêcher la sélection d'une date passée dans le mini-calendrier de `components/sections/Booking.tsx` et désactiver les créneaux déjà écoulés le jour même (FR-008, décision D6)
- [X] T027 [P] Assouplir la validation de l'e-mail et ajouter la validation du téléphone selon la décision D5, avec un message qui dit quoi corriger (FR-007)
- [X] T028 Annoncer les erreurs de validation aux technologies d'assistance via `aria-live` et `aria-invalid` (FR-013)
- [X] T029 Porter toutes les cibles interactives du tunnel à 44 px au minimum (SC-007)
- [X] T030 Vérifier SC-008 : `grep -rn "payload.create\|payload.update" components/ lib/` ne renvoie rien
- [X] T031 Exécuter `npm run lint` et `npm run build`, puis le parcours complet du `quickstart.md` sous Chromium en 1440 et 390 px

---

## Dependencies

```
Phase 1 (T001)
   └── Phase 2 (T002 … T008)        ← bloquant pour toutes les histoires
          ├── Phase 3 · US1 (T009 … T014)   MVP
          │      └── Phase 4 · US2 (T015 … T019)   dépend de l'écran final réécrit
          ├── Phase 5 · US3 (T020 … T022)   indépendante après la phase 4
          └── Phase 6 · US4 (T023 … T025)   indépendante
                 └── Phase 7 (T026 … T031)
```

US1 et US2 se suivent parce qu'elles touchent le même écran. US3 et US4 sont
indépendantes l'une de l'autre une fois l'écran final en place.

## Parallel opportunities

- **Phase 2** : T002 et T003 en parallèle (fichiers distincts, aucune dépendance)
- **Phase 7** : T026 et T027 en parallèle (zones distinctes du composant)
- **Entre histoires** : US3 et US4 peuvent être menées en parallèle après la phase 4

## Implementation Strategy

**MVP** : phases 1 à 4. À l'issue de la phase 4, le tunnel ne ment plus et les
demandes parviennent au club. C'est le seuil de publication : tout ce qui suit
améliore, rien n'est bloquant.

**Livraison incrémentale** : chaque phase se termine sur un point de contrôle
vérifiable. La phase 3 seule vaut déjà d'être mise en ligne — elle supprime la
pratique trompeuse même si le message n'est pas encore composé.
