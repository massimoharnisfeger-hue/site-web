# Vérification — Padel House

Prouve que **le produit** fait ce qu'il promet.
Qu'il ne fasse pas ce qu'il ne doit pas, c'est `securite.md`.
Que le pilotage ne mente pas, c'est le contrôle de cadre — voir `agents.md`.

**Aucune case ne se coche sans avoir vu la sortie de la commande.**

**Dernier passage rapide :** 2026-09-14 — vert
**Dernier passage complet :** 2026-09-14 — **2 objectifs prouvés sur 5**

## Les deux régimes

| Régime | Ce qu'on lance | Quand |
|---|---|---|
| **Rapide** | niveau 1 | après chaque incrément |
| **Complet** | niveaux 1 et 2 | à chaque jalon, avant chaque porte, avant toute annonce de fin |

## Niveau 1 — est-ce que ça tourne

| # | Commande | Attendu | Dernier résultat |
|---|---|---|---|
| 1 | `npm ci` | termine sans erreur | ✅ 2026-09-14 — 604 paquets |
| 2 | `npm run lint` | 0 erreur | ✅ 2026-09-14 — aucun avertissement |
| 3 | `npm run build` | build réussi | ✅ 2026-09-14 — 8 routes |
| 4 | `npm run verify` | 10/10 | ✅ 2026-09-14 — 10/10 |
| 5 | `npm run start` | la page répond | ✅ 2026-09-14 — HTTP 200 |

**Jamais** `payload generate:importmap` : le fichier produit casse `next build`.
La raison est écrite dans `app/(payload)/admin/importMap.js`.

## Niveau 2 — l'objectif est-il atteint

| Objectif | Comment on le prouve | Dernier résultat |
|---|---|---|
| **O1** — tout modifiable depuis `/admin` | Ouvrir `/admin`, modifier le titre de la section Offres, recharger la page publique : le nouveau titre s'affiche | ⬜ **impossible aujourd'hui** — aucun compte administrateur n'existe (voir blocage M6) |
| **O2** — jamais vide, base coupée | `npm run build && PORT=3210 npm run start` **sans `DATABASE_URI`**, puis `curl localhost:3210` | ✅ 2026-09-14 — HTTP 200, 122 ko, contenu de repli affiché |
| **O3** — la réservation ne ment pas | `npm run verify` (10 propriétés sur `lib/booking-message.ts`) + relire qu'aucun appel réseau ni stockage n'existe dans le tunnel | ✅ 2026-09-14 — 10/10 |
| **O4** — trouvable localement | `curl localhost:3210 \| grep 'application/ld+json'` → la fiche d'établissement ; **et** la ville doit apparaître dans `<title>` | 🔶 **partiel** — 2 blocs structurés présents, mais la ville est vide en base (blocage M6) |
| **O5** — mobile, clavier, contrastes AA | Parcours complet au clavier seul sur la page d'accueil ; contrôle des contrastes sur les six sections ; affichage sur un vrai téléphone | ⬜ non repassé depuis le commit `9d9d05c` |

## Rattrapages

| Le bug | Comment on le rattrape | Ajouté le |
|---|---|---|
| `importMap.js` régénéré casse le build | `npm run build` en niveau 1 le rattrape immédiatement | 2026-08 |
| Message de réservation tronqué ou mal encodé | `npm run verify` — 10 propriétés, dont 5000 saisies hostiles | 2026-08 |

## Échecs ouverts

| Depuis | Ce qui échoue | Pourquoi ce n'est pas encore réparé | Échéance |
|---|---|---|---|
| 2026-08 | O1 et O4 ne sont pas prouvables en production | Le compte administrateur n'existe pas et la ville est vide — seul le propriétaire peut le faire | dès que M6 est débloqué |
| 2026-08 | O5 n'a pas de preuve reproductible | Le contrôle est manuel et n'a pas été repassé depuis | à la prochaine passe accessibilité |
