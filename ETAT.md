# ÉTAT — Padel House

**Phase :** LANCEMENT
**Jalon en cours :** M6 — Mise en service réelle
**Mis à jour :** 2026-09-14
**Dernier `verify` complet :** 2026-09-14 — 2 objectifs prouvés sur 5

---

## ▸ Prochaine action

> **Créer le compte administrateur sur `/admin` (formulaire « premier
> utilisateur »), puis renseigner la ville du club dans « Réservation & Pied de
> page ».**
>
> **Pourquoi elle :** ce n'est pas une formalité de mise en service. Vérifié le
> 2026-09-14 : `/admin` en production sert le formulaire « créer le premier
> utilisateur ». **Le back-office est réclamable par n'importe qui** — la
> première personne qui ouvre cette adresse devient administratrice du site.
> Accessoirement, O1 et O4 restent en défaut tant que c'est vide. Faille
> Critique ouverte dans `securite.md` : elle prime sur tout le reste.

---

## ▸ Avancement

| Jalon | Ce qu'il livre | Sert | État | Porte |
|---|---|---|---|---|
| M1 | Tout le contenu piloté depuis `/admin` | O1 | ✅ validé | 2026-08 |
| M2 | Contenu de repli : le site ne s'affiche jamais vide | O2 | ✅ validé | 2026-08 |
| M3 | Tunnel de réservation honnête | O3 | ✅ validé | 2026-08 |
| M4 | Ville, coordonnées, données structurées, pages légales | O4 | 🔨 code fait, **contenu manquant** | — |
| M5 | Contrastes AA, mobile, images responsives | O5 | ✅ validé | 2026-08 |
| M6 | Mise en service réelle | O1, O4 | 🚧 bloqué | — |

---

## ▸ En cours

| Tâche | Jalon | Depuis | Prochain geste concret |
|---|---|---|---|
| Passer `verify.md` niveau 2 en entier | — | 2026-09-14 | prouver O2 en coupant `DATABASE_URI` |

---

## ▸ Bloqué

| Quoi | Depuis | Cause identifiée | Ce qui débloque | Chez qui |
|---|---|---|---|---|
| M6 — compte admin | 2026-08 | Le formulaire « premier utilisateur » n'a jamais été rempli | ouvrir `/admin`, créer le compte (40 s) | Massimo |
| M6 — ville du club | 2026-08 | Champ vide en base | `/admin` → Réservation & Pied de page (2 min) | Massimo |
| M6 — mentions légales | 2026-08 | Informations juridiques que personne d'autre ne peut inventer | raison sociale, SIRET, RCS, directeur de publication, e-mail RGPD (15 min) | Massimo |

---

## ▸ Risques

| Risque | Probabilité | Impact si ça arrive | Ce qu'on fait |
|---|---|---|---|
| Sauvegardes MongoDB / Vercel Blob jamais vérifiées | moyenne | Perte du contenu et des photos, sans retour possible | vérifier la politique réelle d'Atlas, tester une restauration |
| Retour arrière Vercel jamais essayé | moyenne | Déploiement raté = apnée le jour J | déclencher un retour arrière une fois, à froid |
| Site public sans mentions légales | forte | Non-conformité, dès la première visite réelle | c'est M6, déjà bloqué ci-dessus |
| Polices chargées depuis Fontshare | faible | Fontshare tombe → affichage dégradé au premier rendu | passer sur `next/font/local` |
| **`/admin` réclamable par n'importe qui** | **forte** | Perte du back-office du site en ligne | créer le compte — c'est la prochaine action |
| 12 failles de dépendances, dont 1 critique | moyenne | Surface d'attaque élargie ; l'essentiel ferme avec Next 16 | inscrit dans `securite.md`, ferme avec la montée de version |
| En-têtes de sécurité absents (dont `X-Frame-Options`) | moyenne | `/admin` encadrable par un site tiers | à poser dans `next.config.mjs` |

---

## ▸ Dette technique

| Dette | Contractée le | Pourquoi on l'a prise | Échéance |
|---|---|---|---|
| Polices externes (Fontshare) au lieu de `next/font/local` | 2026-08 | Plus rapide à poser | à la prochaine passe performance |
| Rendu dynamique intégral, aucun cache | 2026-08 | Les modifications du back-office doivent se voir tout de suite | à revoir si le trafic monte |
| Montées de version majeures reportées (Next 16, Tailwind 4, ESLint 10, TS 7) | 2026-08 | Chacune est une migration entière | Next 16 d'abord — ferme aussi 2 avis de sécurité |
| Aucun test automatisé hors `npm run verify` | 2026-08 | Projet vitrine, filet lint+build jugé suffisant | à reconsidérer si le tunnel se complexifie |
| Avis clients = exemples, champs date et provenance vides | 2026-08 | Écrire « Google » sur un faux avis serait le défaut que l'audit reproche | remplacer par de vrais avis, ou retirer la section |

---

## ▸ Plus tard — hors périmètre V1

| Idée | Priorité | Pourquoi pas maintenant | Reçue le |
|---|---|---|---|
| Vrais avis clients avec provenance | IMPORTANT | Demande des avis réels à collecter | 2026-08 |
| Mise en cache de la page publique | UTILE | Aucun problème de charge aujourd'hui | 2026-08 |
| `next/image` avec liste d'hôtes déclarés | UTILE | Casse le rendu si le back-office pointe ailleurs | 2026-08 |

---

## ▸ Validation

| | |
|---|---|
| `verify` niveau 1 | 2026-09-14 — vert (lint, build) |
| `verify` niveau 2 | **2 sur 5 prouvés** (O2, O3) · O4 partiel · O1 et O5 non prouvables aujourd'hui |
| Contrôle de cadre | 2026-09-14 — voir dernier passage |
| `securite.md` | 2026-09-14 — **2 échecs critiques**, 5 alertes |
| Portes franchies | CADRAGE, FONDATIONS, CONSTRUCTION (M1–M3, M5) |
