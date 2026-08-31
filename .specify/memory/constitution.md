<!--
Sync Impact Report
==================
Version change: (aucune) → 1.0.0 → 1.0.1
Type de bump: 1.0.0 adoption initiale (le gabarit ne contenait que des
placeholders) ; 1.0.1 PATCH — correction factuelle, sans changement de portée.

1.0.1 — la section « Contraintes techniques » affirmait que importMap.js devait
être régénéré par `npm run generate:importmap`. C'est faux : la régénération casse
`next build`. L'exception est désormais documentée explicitement.

Principes ajoutés (aucun renommage, aucun principe préexistant):
  - I. Contenu piloté par Payload (NON NÉGOCIABLE)
  - II. Le site ne doit jamais être vide
  - III. Sobriété des dépendances
  - IV. Secrets hors du dépôt (NON NÉGOCIABLE)
  - V. Immersion sans sacrifice — performance et accessibilité

Sections ajoutées:
  - Contraintes techniques  (remplace [SECTION_2_NAME])
  - Flux de développement   (remplace [SECTION_3_NAME])
  - Gouvernance

Sections supprimées: aucune.

Placeholders restants: aucun.
TODO différés: aucun.
-->

# Constitution Padel House

Ce document fixe les règles non négociables du projet Padel House (site vitrine
immersif + back-office Payload CMS). Il prime sur toute autre habitude de travail.
Les commandes `/speckit-plan` et `/speckit-analyze` vérifient les plans contre ces
principes.

## Core Principles

### I. Contenu piloté par Payload (NON NÉGOCIABLE)

Tout texte, image, chiffre ou lien visible par un visiteur DOIT être modifiable
depuis `/admin` sans toucher au code. Aucun contenu éditorial ne DOIT être écrit en
dur dans un composant JSX.

Ajouter un contenu éditable impose de modifier les trois fichiers, dans cet ordre :

1. `globals/Home.ts` — déclarer le champ Payload (avec un `label` en français)
2. `lib/types.ts` — déclarer le type TypeScript correspondant
3. `lib/content.ts` — ajouter la valeur par défaut ET la lecture avec repli
4. le composant de `components/sections/` — l'afficher via ses props

Un composant de section NE DOIT PAS appeler Payload lui-même : il reçoit son contenu
en props depuis `app/(frontend)/page.tsx`. Cette contrainte garde une seule lecture
de la base par rendu et rend chaque section testable isolément.

*Rationale* : le gérant du club doit pouvoir corriger un prix ou une photo sans
développeur. Un texte en dur est une régression fonctionnelle, pas un détail.

### II. Le site ne doit jamais être vide

`lib/content.ts` DOIT garantir un rendu complet et crédible dans les trois cas
suivants : base de données injoignable, global `home` absent, champ individuel vide.
Le repli DOIT rester champ par champ (`str(g.x, d.x)`), jamais tout-ou-rien : un
titre effacé par erreur ne DOIT pas vider la section entière.

Toute nouvelle section ou tout nouveau champ DOIT arriver avec sa valeur dans
`defaultContent`. Une page qui plante ou affiche du vide quand MongoDB est
indisponible est un bug bloquant.

*Rationale* : le site tourne sur une base MongoDB Atlas gratuite en serverless, avec
des démarrages à froid et des coupures possibles. Le visiteur ne DOIT jamais le voir.

### III. Sobriété des dépendances

Ajouter une dépendance à `package.json` exige de justifier explicitement, dans le
plan de la feature, pourquoi le besoin n'est pas couvert par la stack existante :
Next.js, React, Payload, Tailwind, GSAP, Framer Motion, Lenis, Three.js, sharp.

Les versions de `payload`, `@payloadcms/*` et `next` DOIVENT rester alignées entre
elles ; monter l'une sans les autres est interdit. Une montée de version majeure de
Next ou Payload est un chantier à part entière avec sa propre spec, jamais un effet
de bord d'une autre feature.

*Rationale* : projet maintenu en solo, sans suite de tests. Chaque dépendance est une
dette que personne d'autre ne remboursera.

### IV. Secrets hors du dépôt (NON NÉGOCIABLE)

`DATABASE_URI`, `PAYLOAD_SECRET` et `BLOB_READ_WRITE_TOKEN` NE DOIVENT jamais
apparaître dans un fichier versionné, un commentaire, un message de commit ou une
capture d'écran. Ils vivent dans `.env` en local (ignoré par git) et dans les
variables d'environnement Vercel en production.

Toute nouvelle variable d'environnement DOIT être ajoutée à `.env.example` avec une
valeur vide et un commentaire expliquant où l'obtenir. Le code NE DOIT PAS contenir
de valeur de secours en dur pour un secret : l'absence d'un secret DOIT échouer
visiblement, pas silencieusement.

*Rationale* : le dépôt est public sur GitHub et l'historique git est indélébile.

### V. Immersion sans sacrifice — performance et accessibilité

Les effets visuels (GSAP, Lenis, WebGL, curseur personnalisé, préchargeur) NE
DOIVENT jamais empêcher l'accès au contenu. Toute feature touchant à l'animation
DOIT respecter :

- `prefers-reduced-motion` : les animations sont neutralisées, le contenu reste lu
- le contenu textuel DOIT être présent dans le HTML rendu côté serveur, même si son
  animation d'apparition ne se déclenche jamais
- toute image DOIT porter un `alt` renseigné, éditable depuis `/admin`
- les éléments interactifs DOIVENT rester atteignables au clavier
- le site DOIT rester utilisable sur mobile bas de gamme : pas de WebGL bloquant le
  premier rendu

*Rationale* : un club de padel vend des créneaux à tout le monde, y compris aux gens
sur un vieux téléphone ou sensibles au mouvement. L'effet ne DOIT jamais coûter un
client.

## Contraintes techniques

**Stack figée** : Next.js 15 (App Router), React 19, Payload CMS 3, MongoDB via
`@payloadcms/db-mongodb`, stockage Vercel Blob, Tailwind 3, TypeScript 5, Node >= 20.9.

**Séparation des espaces** : `app/(frontend)/` est le site public ; `app/(payload)/`
est généré par Payload (back-office et API) et NE DOIT PAS être modifié à la main.

**Exception documentée** : `app/(payload)/admin/importMap.js` est volontairement
maintenu vide. La version produite par `npm run generate:importmap` importe
`@payloadcms/storage-vercel-blob/client`, qui tire les internes serveur de Payload
dans le bundle client et fait échouer `next build`. Ce fichier NE DOIT PAS être
régénéré tant que ce conflit n'est pas résolu en amont.

**Rendu** : la page publique reste en `export const dynamic = "force-dynamic"` afin
que les modifications du back-office soient visibles immédiatement. Passer à un
rendu statique ou en cache est un changement d'architecture qui exige une spec.

**Types générés** : `payload-types.ts` est produit par `npm run generate:types` et
reste ignoré par git. Il NE DOIT PAS être édité à la main.

**Base de données** : le schéma de contenu se déclare uniquement dans
`globals/Home.ts` et `collections/`. Aucune écriture directe dans MongoDB en dehors
de Payload.

## Flux de développement

**Périmètre du spec-driven** : `/speckit-specify` s'applique aux features
structurantes (nouvelle section, réservation, formulaire, intégration externe,
nouvelle collection Payload). Les corrections de bug, ajustements de style et
modifications de contenu se font en direct, sans spec.

**Vérifications avant tout commit** — le projet n'a aucun test automatisé, donc ces
deux commandes sont le seul filet :

```
npm run lint
npm run build
```

Les deux DOIVENT passer. Un `build` cassé signifie un déploiement Vercel cassé.

**Validation manuelle obligatoire** pour toute feature touchant au contenu :

1. la page publique s'affiche correctement **sans** `.env` renseigné (contenu de démo)
2. la page publique s'affiche correctement **avec** la base connectée
3. le champ est éditable dans `/admin` et la modification apparaît après rechargement

**Langue** : le code, les commentaires, les `label` Payload et la documentation sont
en français. Les noms de variables et de fichiers restent en anglais lorsque c'est
l'usage du framework.

**Git** : le travail se fait sur une branche, jamais directement sur `main`. Les
messages de commit décrivent l'intention, pas le diff.

## Governance

Cette constitution prime sur toute autre pratique. En cas de conflit entre une
habitude de travail et un principe ci-dessus, le principe gagne.

**Amendements** : toute modification de ce document DOIT être un commit distinct,
sans changement de code applicatif, décrivant ce qui change et pourquoi.

**Versionnement** (sémantique, appliqué à ce document) :

- **MAJOR** — un principe est retiré ou redéfini de façon incompatible
- **MINOR** — un principe ou une section est ajouté, ou sa portée est élargie
- **PATCH** — clarification, reformulation, correction sans changement de portée

**Contrôle de conformité** : `/speckit-plan` DOIT vérifier chaque plan contre les
cinq principes et documenter toute violation dans la section « Complexity Tracking »
du plan, avec sa justification. Une violation non justifiée bloque
`/speckit-implement`.

**Guide d'exécution** : `README.md` reste la référence opérationnelle (installation,
déploiement, structure des dossiers). Il DOIT être mis à jour quand une feature
change l'une de ces trois choses.

**Version**: 1.0.1 | **Ratified**: 2026-08-31 | **Last Amended**: 2026-08-31
