# Vérification — <Nom du projet>

Ce fichier est la seule chose qui autorise le mot « fini ».
**Aucune case ne se coche sans avoir vu la sortie de la commande.**

**Dernier passage :** <AAAA-MM-JJ> — <tout vert / N échecs>

## Niveau 1 — est-ce que ça tourne

<Commandes réelles, copiables, dans l'ordre. Si le projet a un lanceur de
scripts (npm, make), câbler ce niveau dedans plutôt que dans un script isolé.>

| # | Commande | Attendu | Dernier résultat |
|---|---|---|---|
| 1 | `<installation>` | termine sans erreur |  |
| 2 | `<lint>` | 0 erreur |  |
| 3 | `<build>` | build réussi |  |
| 4 | `<tests>` | tout passe |  |
| 5 | `<démarrage>` | l'app répond sur <url> |  |

## Niveau 2 — l'objectif est-il atteint

<Une ligne par objectif de CLAUDE.md. Aucun objectif sans preuve. Quand ça ne se
prouve pas par une commande, écrire le parcours exact à refaire à la main — assez
précis pour que quelqu'un d'autre le refasse sans poser de question.>

| Objectif | Comment on le prouve | Dernier résultat |
|---|---|---|
| **O1** |  |  |
| **O2** |  |  |
| **O3** |  |  |

## Échecs ouverts

<Un échec sans ligne ici est un échec oublié. La troisième colonne est la plus
importante : elle empêche qu'un contournement provisoire devienne définitif.>

| Depuis | Ce qui échoue | Pourquoi ce n'est pas encore réparé |
|---|---|---|
|  |  |  |
