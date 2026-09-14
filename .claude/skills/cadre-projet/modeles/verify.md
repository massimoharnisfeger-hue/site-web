# Vérification — <Nom du projet>

C'est le fichier qui prouve que **le produit** fait ce qu'il promet.
(Que le *pilotage* ne ment pas, c'est le contrôle de cadre — voir `agents.md`.)

**Aucune case ne se coche sans avoir vu la sortie de la commande.**

**Dernier passage rapide :** <AAAA-MM-JJ — vert / N rouges>
**Dernier passage complet :** <AAAA-MM-JJ — vert / N rouges>

## Les deux régimes

| Régime | Ce qu'on lance | Quand |
|---|---|---|
| **Rapide** | le niveau 1 seulement | après **chaque** incrément |
| **Complet** | niveaux 1 **et** 2 | à chaque jalon, avant chaque porte, avant toute annonce de fin, avant clôture |

<!-- Deux régimes, sinon la règle est trop lourde et meurt en deuxième semaine. -->

## Niveau 1 — est-ce que ça tourne

<Commandes réelles, copiables, dans l'ordre. Quand le projet a un lanceur de
scripts (npm, make), câbler ce niveau dedans — `npm run verify` — plutôt que
dans un script isolé qui dérivera.>

| # | Commande | Attendu | Dernier résultat |
|---|---|---|---|
| 1 | `<installation>` | termine sans erreur |  |
| 2 | `<lint>` | 0 erreur |  |
| 3 | `<build>` | build réussi |  |
| 4 | `<tests>` | tout passe |  |
| 5 | `<démarrage>` | répond sur <url> |  |

## Niveau 2 — l'objectif est-il atteint

<Une ligne par O de CLAUDE.md. Aucun objectif sans preuve. Quand ça ne se prouve
pas par une commande, écrire le parcours exact à refaire — assez précis pour que
quelqu'un d'autre le refasse sans poser de question.>

| Objectif | Comment on le prouve | Dernier résultat |
|---|---|---|
| **O1** |  |  |
| **O2** |  |  |
| **O3** |  |  |

## Rattrapages

<Une ligne par bug déjà corrigé une fois : ce qui le rattraperait s'il revenait.
Un bug corrigé sans ligne ici est un bug qui reviendra et qu'on redécouvrira.>

| Le bug | Comment on le rattrape | Ajouté le |
|---|---|---|
|  |  |  |

## Échecs ouverts

<Un échec sans ligne ici est un échec oublié. La dernière colonne est la plus
importante : elle empêche qu'un contournement provisoire devienne définitif.>

| Depuis | Ce qui échoue | Pourquoi ce n'est pas encore réparé | Échéance |
|---|---|---|---|
|  |  |  |  |
