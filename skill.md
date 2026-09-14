# Skills — Padel House

Table de routage, pas inventaire. Avant chaque tâche notable : choisir, le dire
en une ligne, agir. Plusieurs skills se combinent — c'est le cas courant.

Tous les skills ci-dessous existent dans `.claude/skills/` de ce dépôt.

## Disponibles

| Skill | L'appeler quand | Ne pas l'appeler pour |
|---|---|---|
| `cadre-projet` | démarrer, reprendre, savoir où on en est, un changement, un blocage, préparer le lancement | une question technique ponctuelle |
| `speckit-specify` · `speckit-plan` · `speckit-tasks` | une fonctionnalité assez grosse pour mériter une spécification dans `specs/` | une correction de deux lignes |
| `speckit-analyze` · `speckit-checklist` | vérifier qu'un plan respecte la constitution | relire du code |
| `impeccable` | travailler l'interface : hiérarchie, espacements, typographie, mouvement | un problème de build ou de données |
| `ui-ux-pro-max` | choix de couleurs, polices, accessibilité, composants | la logique métier |
| `react-performance` | temps d'affichage, poids du bundle, rendus inutiles | l'accessibilité |
| `security-review` | toucher aux entrées visiteur, au back-office, aux clés | le style |
| `production-audit` | avant un lancement, ou « qu'est-ce qui casse en prod ? » | pendant la construction |
| `verification-loop` | vérifier un travail avant de le déclarer fini | au début d'une tâche |
| `security-scan` | auditer la configuration `.claude/` elle-même | le code applicatif |

## Combinaisons qui marchent

| Type de tâche | Skills | Ce que ça donne |
|---|---|---|
| Nouvelle section du site | `cadre-projet` + `speckit-specify` + `impeccable` | le champ back-office, le repli et le visuel arrivent ensemble |
| Passe avant lancement | `cadre-projet` (phase 4) + `production-audit` + `security-review` | la check-list de lancement adossée à un vrai audit |
| Retouche visuelle | `impeccable` + `ui-ux-pro-max` | pas de régression d'accessibilité en cherchant le beau |

## Manques

| Fait à la main | Occurrences | Skill à écrire ? |
|---|---|---|
| Ajouter un champ éditable (les 4 fichiers dans l'ordre) | 6+ | **oui** — c'est le geste le plus répété et le plus facile à rater |
| Contrôle d'accessibilité manuel (O5) | 2 | pas encore — `ui-ux-pro-max` couvre une partie |
