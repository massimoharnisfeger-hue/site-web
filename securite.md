# Sécurité — Padel House

Prouve que le produit **ne fait pas ce qu'il ne doit pas faire**.
(`verify.md` prouve qu'il fait ce qu'il promet. Questions opposées.)

**Aucune case ne se coche sans avoir vu la sortie.**

**Dernier passage :** 2026-09-14 — **1 échec critique**, 3 alertes
*(en-têtes corrigés le 2026-09-14 ; effectifs en production au prochain déploiement)*
**Prochaine revue :** 2026-12-14

```bash
bash .claude/skills/cadre-projet/scripts/controle-securite.sh https://site-web-seven-chi.vercel.app
```

## La gravité

| Niveau | Conséquence |
|---|---|
| **Critique** | bloque le lancement, sans discussion |
| **Élevée** | bloque, sauf décision écrite dans « risques acceptés » |
| **Moyenne** | à corriger dans la vague en cours |
| **Faible** | dette technique, avec échéance |

---

## ⚠ Le point qui prime sur tout

**Le back-office en production est libre.** `https://<domaine>/admin` sert le
formulaire « créer le premier utilisateur » : aucun compte n'existe, donc la
première personne qui ouvre cette adresse devient administratrice du site — elle
peut réécrire tout le contenu, téléverser des fichiers et bloquer l'accès au
propriétaire.

Vérifié le 2026-09-14 : `HTTP 200`, la page contient `create-first-user`.

Ce point était rangé dans `ETAT.md` comme une formalité de mise en service de
quarante secondes. Ce n'en est pas une : c'est une porte ouverte, et elle le
reste jusqu'à ce que le compte soit créé.

---

## 1. Secrets

| # | Le test | Gravité | Dernier résultat |
|---|---|---|---|
| S1 | Aucun fichier de clés suivi par git | Critique | ✅ 2026-09-14 |
| S2 | Aucune clé dans l'historique | Critique | ✅ 2026-09-14 — historique complet vérifié |
| S3 | Aucune valeur de clé en clair dans le code | Critique | ✅ 2026-09-14 |
| S4 | Aucun secret dans le paquet livré au navigateur | Critique | ✅ 2026-09-14 — `.next` et `public` fouillés |
| S5 | Chaque clé a une date de rotation connue | Moyenne | ⬜ `DATABASE_URI` et `PAYLOAD_SECRET` n'ont jamais tourné |

## 2. Dépendances

| # | Le test | Gravité | Dernier résultat |
|---|---|---|---|
| D1 | Aucune faille haute ou critique | Élevée | ❌ **12 failles : 1 critique, 2 hautes, 8 moyennes, 1 faible** |
| D2 | Versions verrouillées | Moyenne | ✅ `package-lock.json` suivi |
| D3 | Aucune dépendance abandonnée sur un chemin sensible | Moyenne | ✅ aucune |

**Ce qui touche réellement ce projet** — une faille annoncée n'est pas une faille
exploitable ici :

| Paquet | Gravité | S'applique ? |
|---|---|---|
| `next` | critique | **Partiellement.** L'avis critique vise l'optimiseur d'images des applications **auto-hébergées** ; ce site tourne sur Vercel. Mais `next.config.mjs` déclare `images.remotePatterns` alors que `next/image` n'est utilisé nulle part : configuration morte qui élargit la surface pour rien. Les avis « contrebande de requêtes » et « déni de service sur les Server Components » restent applicables. |
| `postcss` | haute | **Non.** PostCSS ne tourne qu'à la compilation, sur nos propres feuilles de style. Les avis exigent une CSS fournie par un attaquant. |
| `sharp` | haute | **Oui, mais surface réduite.** Traite les images téléversées, donc uniquement par un administrateur connecté. |
| `payload` | moyenne | **Non aujourd'hui.** L'avis concerne le déverrouillage de comptes entre utilisateurs ; il n'y aura qu'un seul compte. |
| `dompurify` | moyenne | **Surface administrateur seulement** — l'éditeur de texte riche du back-office. |

**Ce qu'il faut en faire :** monter Next (l'étape déjà inscrite en dette
technique) ferme la critique et deux moyennes. Le reste attend cette montée.

## 3. Accès et authentification

| # | Le test | Gravité | Dernier résultat |
|---|---|---|---|
| A1 | L'administration est inaccessible sans compte | Critique | ❌ **2026-09-14 — `/admin` ouvre « créer le premier utilisateur »** |
| A2 | Aucun compte ni mot de passe par défaut | Critique | ✅ aucun compte n'est créé par le code |
| A3 | Cookies `HttpOnly`, `Secure`, `SameSite` | Élevée | ⬜ non vérifié — impossible sans compte |
| A4 | La déconnexion invalide la session | Élevée | ⬜ non vérifié — impossible sans compte |
| A5 | Pas d'énumération de comptes | Moyenne | ⬜ non vérifié — impossible sans compte |

## 4. Entrées visiteur

Le tunnel de réservation **n'envoie rien au serveur** : le message est composé
côté navigateur puis remis au visiteur (`lib/booking-message.ts`, fonction pure).
La surface d'entrée publique est donc presque nulle — c'est la conséquence
directe de O3, et c'est la meilleure défense du projet.

| # | Le test | Gravité | Dernier résultat |
|---|---|---|---|
| E1 | Injection en base | Critique | ✅ sans objet côté public — aucune écriture visiteur |
| E2 | Script injecté et exécuté | Critique | ✅ 2026-08 — `npm run verify`, 5 000 saisies hostiles, aucune exception |
| E3 | Taille des entrées plafonnée | Élevée | ✅ plafond de 1 500 caractères tenu (vérifié 10/10) |
| E4 | Téléversement contrôlé côté serveur | Élevée | ⬜ non vérifié — surface administrateur |
| E5 | Redirection ouverte | Moyenne | ✅ aucun paramètre de retour dans le code |

## 5. Transport et en-têtes

| # | Le test | Gravité | Dernier résultat |
|---|---|---|---|
| T1 | HTTPS partout | Élevée | ✅ 2026-09-14 |
| T2 | `Strict-Transport-Security` | Moyenne | ✅ présent (Vercel) |
| T2 | `Content-Security-Policy` | Moyenne | ✅ 2026-09-14 — posée, **0 violation** sur le site public (vérifié dans Chromium) |
| T2 | `X-Content-Type-Options` | Moyenne | ✅ 2026-09-14 — `nosniff` |
| T2 | `Referrer-Policy` | Moyenne | ✅ 2026-09-14 — `strict-origin-when-cross-origin` |
| T2 | `X-Frame-Options` | **Élevée ici** | ✅ 2026-09-14 — `SAMEORIGIN`, doublé par `frame-ancestors 'self'` |
| T2 | `Permissions-Policy` | Faible | ✅ 2026-09-14 — caméra, micro, position, paiement, USB refusés |
| T3 | Pas de cartes de source en production | Moyenne | ✅ aucune dans la sortie de build |

## 6. Données personnelles

| # | Le test | Gravité | Dernier résultat |
|---|---|---|---|
| P1 | On sait quelles données sont stockées | Élevée | ✅ **aucune donnée de visiteur n'est enregistrée** — c'est O3 |
| P2 | Aucune donnée personnelle dans les journaux | Élevée | ✅ sans objet, rien n'est transmis |
| P3 | Durée de conservation définie | Moyenne | ✅ sans objet |
| P4 | Mentions légales et exercice des droits atteignables | Élevée | ❌ les pages existent, **le contenu est un gabarit à crochets** |

## 7. Surface exposée

| # | Le test | Gravité | Dernier résultat |
|---|---|---|---|
| X1 | Aucun outil de développement joignable | Élevée | ⬜ **non vérifié — `/api/graphql-playground` est déclaré dans les routes** |
| X2 | Aucun fichier sensible servi publiquement | Critique | ✅ 2026-09-14 |
| X3 | Les erreurs ne révèlent ni chemin ni version | Moyenne | ⬜ non vérifié |
| X4 | Pas de liste de répertoire | Moyenne | ✅ sans objet (Vercel) |

## 8. Abus et charge

| # | Le test | Gravité | Dernier résultat |
|---|---|---|---|
| B1 | Formulaires publics protégés de l'envoi en masse | Moyenne | ✅ sans objet — aucun formulaire n'atteint le serveur |
| B2 | Rien d'irréversible sans confirmation | Élevée | ⬜ surface administrateur, non vérifié |

## 9. Sauvegardes

| # | Le test | Gravité | Dernier résultat |
|---|---|---|---|
| G1 | Une sauvegarde récente existe | Critique | ⬜ **non vérifié** — la politique d'Atlas n'a jamais été regardée |
| G2 | La restauration a été essayée | Critique | ⬜ **jamais** |
| G3 | Sauvegardes séparées de la production | Élevée | ⬜ non vérifié |

## 10. Tiers

| # | Le test | Gravité | Dernier résultat |
|---|---|---|---|
| Z1 | On sait quels scripts externes s'exécutent | Élevée | 🔶 les polices viennent de Fontshare (déjà en dette technique) |
| Z2 | Chaque tiers a une raison et une politique connue | Moyenne | ⬜ non vérifié pour Fontshare et Unsplash |

---

## Failles ouvertes

| Depuis | Ce qui est vulnérable | Gravité | Pourquoi pas encore corrigé | Échéance |
|---|---|---|---|---|
| mise en ligne | `/admin` réclamable par n'importe qui | **Critique** | Seul le propriétaire peut créer le compte | **immédiat** |
| 2026-09-14 | 12 failles de dépendances, dont 1 critique | Élevée | Ferme avec la montée en Next 16, qui est une migration à part entière | prochaine vague |
| 2026-09-14 | **`/admin` sous CSP non vérifié** — le back-office n'a pas pu être chargé faute de base de données dans l'environnement de test | Moyenne | Impossible à tester ici ; le site public est vérifié sans violation | **au premier chargement de `/admin` après déploiement** : ouvrir la console, chercher « Refused to ». Si un refus apparaît, ajouter le domaine à la directive concernée dans `next.config.mjs` |
| mise en ligne | Mentions légales à l'état de gabarit | Élevée | Informations juridiques que seul le propriétaire détient | avec la mise en service |
| toujours | Restauration de sauvegarde jamais essayée | Critique | Jamais fait | avant de considérer le site en service |
| 2026-09-14 | `images.remotePatterns` déclaré alors que `next/image` est inutilisé | Moyenne | Découvert aujourd'hui | proposé, en attente de décision |

## Risques acceptés

| Risque | Pourquoi on l'accepte | Ce qui le rendrait inacceptable | Décidé par | Date |
|---|---|---|---|---|
| *(aucun pour l'instant — un risque accepté se signe)* | | | | |
