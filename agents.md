# Agents — Padel House

Les skills disent **comment**. Les agents disent **qui**. Déléguer a un second
effet, souvent le plus utile : l'agent travaille dans son propre contexte, donc
une grosse lecture n'encombre pas la session principale.

Tous les agents ci-dessous existent dans les types disponibles de ce dépôt.

## L'équipe

| Agent | Sa mission ici | Skills qu'il charge | Quand on l'appelle | Ce qu'il rend |
|---|---|---|---|---|
| `code-explorer` | tracer ce qui dépend d'un champ, d'un composant ou d'un type | — | avant de modifier `globals/Home.ts` ou `lib/content.ts` | la liste des fichiers touchés et l'ordre de modification |
| `code-reviewer` | relire un diff : régression, contenu en dur, repli manquant | `security-review` | après chaque incrément, avant le commit | les défauts classés par gravité |
| `build-error-resolver` | remettre `next build` et les types au vert | — | build ou types rouges | le correctif minimal, sans élargir |
| `a11y-architect` | contrastes, navigation clavier, cibles tactiles | `ui-ux-pro-max` | tout travail sur une section visible | les écarts WCAG et leur correction |
| `doc-updater` | tenir `README.md` et `HANDOVER.md` à jour | — | après un changement de procédure | les fichiers mis à jour |
| `Plan` | découper une fonctionnalité en incréments ordonnés | `cadre-projet` | avant un jalon non trivial | les incréments, leurs dépendances, l'ordre |
| `gardien-cadre` | vérifier que le pilotage ne ment pas | `cadre-projet` | avant chaque porte, avant toute annonce de fin | un verdict PASSE/ÉCHEC et les incohérences trouvées |

## Les gardiens de la boucle

| Moment | Rôle attendu | Agent | Il bloque si |
|---|---|---|---|
| COMPRENDRE | explorer sans modifier | `code-explorer` | une dépendance n'est pas tracée |
| CONSTRUIRE | tenir le build et les types | `build-error-resolver` | build rouge |
| PROUVER | relire le diff, chercher la régression | `code-reviewer` | régression, ou texte en dur |
| STABILISER | cas limites, clavier, contrastes | `a11y-architect` | un parcours casse au clavier |
| VALIDER | contrôle de cadre | `gardien-cadre` | un point en échec, ou une incohérence entre les fichiers |

## Le contrôle de cadre

Il prouve que **le pilotage ne ment pas** — `verify.md` prouve que le produit
marche. Deux questions différentes, les deux nécessaires.

```bash
bash .claude/skills/cadre-projet/scripts/controle-cadre.sh
```

**Dernier passage :** 2026-09-14

Le seul point irréversible est celui des clés dans l'historique. Une clé trouvée
là se **révoque**, elle ne s'efface pas.

## Manques

| Fait à la main | Occurrences | Agent à écrire ? |
|---|---|---|
| Vérifier qu'un nouveau champ a bien ses quatre fichiers | 6+ | oui, si le skill correspondant ne le couvre pas |
