# Implementation Plan: Réservation honnête

**Branch**: `001-reservation-honnete` | **Date**: 2026-08-31 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-reservation-honnete/spec.md`

## Summary

Le tunnel de réservation existant garde sa structure en quatre étapes et son
apparence. Seule la dernière étape change de nature : au lieu de simuler un
paiement et d'annoncer une réservation confirmée, elle compose un message
adressé au club que le visiteur envoie lui-même depuis sa messagerie.

Aucune donnée personnelle n'est enregistrée, aucun appel réseau n'est ajouté,
aucune dépendance n'est installée. Le cœur technique est une fonction pure qui
transforme la saisie en message, et un écran final qui affiche ce message en
clair plutôt que de prétendre l'avoir envoyé.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Node ≥ 20.9

**Primary Dependencies**: Next.js 15.4.11 (App Router), Payload CMS 3.85.1,
Framer Motion 11. Aucune nouvelle dépendance.

**Storage**: MongoDB via Payload, **en lecture seule pour cette feature**. Aucune
écriture. Les coordonnées du visiteur ne quittent jamais son navigateur.

**Testing**: aucun cadre de test dans le projet. La fonction de composition du
message est écrite comme fonction pure et vérifiée par un script exécuté avec
`tsx`, sur le modèle de `lib/unsplash.ts`. Le parcours est vérifié sous Chromium.

**Target Platform**: navigateurs modernes, mobile et bureau. Le repli sans
messagerie configurée est un cas nominal, pas une dégradation.

**Project Type**: application web à page unique, rendue côté serveur.

**Performance Goals**: aucun coût réseau ajouté. La composition du message est
synchrone et locale.

**Constraints**: cibles interactives ≥ 44 px ; contraste AA ; parcours complet
au clavier ; `prefers-reduced-motion` respecté ; longueur du lien `mailto:`
maîtrisée pour ne pas être tronquée par les messageries.

**Scale/Scope**: quelques demandes par jour. Un composant réécrit, une fonction
pure ajoutée, quatre champs de contenu.

## Constitution Check

Évaluation contre la constitution v1.0.1. Aucune violation.

| Principe | Verdict | Comment il est tenu |
|---|---|---|
| I. Contenu piloté par Payload | ✅ | Les cinq textes de l'écran final, le libellé du bouton et le délai annoncé deviennent des champs Payload. Aucun texte visible en dur. |
| II. Le site ne doit jamais être vide | ✅ | Chaque nouveau champ a sa valeur dans `defaultContent` et sa lecture avec repli. Si la base tombe, le tunnel affiche les coordonnées du club et reste utilisable. |
| III. Sobriété des dépendances | ✅ | Zéro ajout. `mailto:`, `tel:` et l'API presse-papiers sont natifs. |
| IV. Secrets hors du dépôt | ✅ | Aucun secret. L'adresse du club est un contenu public déjà éditable. |
| V. Immersion sans sacrifice | ✅ | Cibles ≥ 44 px, focus visible, erreurs annoncées aux lecteurs d'écran, texte de repli sélectionnable. |

**Contraintes techniques** : `app/(payload)/` n'est pas touché, `importMap.js`
n'est pas régénéré, le rendu reste dynamique, `payload-types.ts` est régénéré
par l'outillage.

## Project Structure

### Documentation (this feature)

```
specs/001-reservation-honnete/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── message-demande.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```
lib/
├── booking-message.ts        # NOUVEAU — fonction pure : saisie → message
├── types.ts                  # + ReservationContent enrichi
└── content.ts                # + défauts et lectures avec repli

globals/
└── Home.ts                   # + champs de l'onglet Réservation

components/sections/
└── Booking.tsx               # étape 4 réécrite, étape 3 validée
```

**Structure Decision**: aucune nouvelle arborescence. La feature suit la
séparation déjà en place — le contenu dans `globals/`, sa lecture dans `lib/`,
son rendu dans `components/sections/`. La logique de composition du message est
isolée dans `lib/booking-message.ts` précisément pour être testable sans
navigateur, seule façon de la couvrir dans un projet sans cadre de test.

## Complexity Tracking

Aucune violation de la constitution à justifier.
