---
name: cadre-projet
description: "Cadre de démarrage et de conduite de tout projet Claude Code : un dossier au nom du projet et quatre fichiers — CLAUDE.md (le plan, l'idée, les objectifs numérotés), memory.md (les modifications, les erreurs et les règles qui en sortent pour ne plus les refaire), skill.md (les skills disponibles et lesquels choisir avant d'agir), verify.md (la preuve que le projet tourne et que l'objectif du plan est atteint). Déclencher dès que l'utilisateur dit : nouveau projet, on démarre, on commence, initialise le projet, mets ça en place, reprends le projet, quel est le plan, note ça pour ne pas refaire l'erreur, mémoire du projet, apprentissages, quel skill utiliser, vérifie que ça marche, l'objectif est-il atteint, c'est fini. Déclencher aussi avant d'écrire la première ligne de code d'un projet neuf, et avant d'annoncer qu'un travail est terminé."
metadata:
  version: 1.0.0
  langue: fr
---

# Cadre projet — quatre fichiers, une boucle

Un projet tient dans un dossier et quatre fichiers. On lit avant d'agir, on
prouve avant de dire « fini », on écrit après. Le reste est du code.

Ces quatre fichiers ne sont pas de la documentation : ce sont les fichiers de
travail. Créés le premier jour puis jamais rouverts, ils ne servent à rien.
C'est **la boucle**, plus bas, qui les rend utiles.

## Le principe

| Fichier | Répond à | Lu | Écrit |
|---|---|---|---|
| `CLAUDE.md` | Qu'est-ce qu'on construit, et c'est fini quand ? | avant chaque tâche | quand une décision change |
| `memory.md` | Qu'est-ce qui a déjà été payé cher ? | avant chaque tâche | après chaque tâche |
| `skill.md` | Avec quels outils j'attaque ça ? | avant chaque tâche | quand un outil fait ses preuves |
| `verify.md` | Ça tourne ? L'objectif est-il atteint ? | avant de dire « fini » | à chaque passage |

Les quatre vivent **à la racine du dossier du projet**.

## Démarrer un projet neuf

Dans cet ordre. **Aucune ligne de code avant l'étape 5.**

1. **Le dossier** porte le nom du projet : minuscules, tirets, ni accent ni
   espace. `padel-house`, `passclub-landing`, `grosjean-devis`.
2. **`CLAUDE.md`** — copier `modeles/CLAUDE.modele.md` vers `<projet>/CLAUDE.md`,
   puis le remplir **avec l'utilisateur**. L'idée, les objectifs numérotés, le
   hors-sujet, les contraintes. C'est la seule étape qui exige sa présence :
   inventer un objectif à sa place, c'est construire le mauvais projet vite.
3. **Les trois autres** — copier `memory.md`, `skill.md`, `verify.md`. Ils
   partent presque vides, sauf `verify.md` : y inscrire dès maintenant une ligne
   par objectif, même sans savoir encore comment le prouver. Une ligne vide est
   une question ouverte ; une ligne absente est un objectif oublié.
4. **Relire les objectifs.** Si l'un d'eux ne se répond pas par oui ou par non,
   il est mal écrit. Le corriger maintenant coûte cinq minutes ; plus tard, il
   coûte le projet.
5. Coder.

## Les quatre fichiers

### `CLAUDE.md` — le plan

Claude Code charge ce fichier **automatiquement, à chaque session**. Le plan est
donc lu sans que personne n'ait à y penser. Deux conséquences :

- **Il tient sur un écran.** Tout ce qui est chargé à chaque session et n'est
  pas relu à chaque session est du bruit. Le détail va dans un fichier à part,
  appelé depuis le plan.
- **Il importe les trois autres**, en dernière ligne :
  `@memory.md` · `@skill.md` · `@verify.md`. Les trois cessent d'être une
  lecture optionnelle.

Ce qu'il contient : l'idée en une phrase · les objectifs numérotés `O1`, `O2`,
`O3` · le hors-sujet · les contraintes · les décisions datées avec leur pourquoi
· l'état actuel en une ligne.

**Un objectif se formule pour qu'un tiers réponde oui ou non sans appeler
personne.** « Faire un beau tunnel de réservation » n'est pas un objectif :
c'est une humeur. « Un visiteur envoie une demande sans créer de compte » en est
un. Chaque `O` est repris tel quel dans `verify.md` — pas d'objectif sans
preuve, pas de preuve sans objectif.

Ce qu'il ne contient jamais : l'historique des séances (c'est `memory.md`), le
détail d'implémentation (c'est le code), ni un état optimiste. **`CLAUDE.md`
décrit ce qui est, pas ce qu'on espérait.**

### `memory.md` — la mémoire

Deux zones, parce qu'elles n'ont pas la même durée de vie.

**En haut, les règles.** Impératives, une ligne, dédoublonnées. C'est cette
zone qu'on lit avant d'agir — donc elle reste courte, sinon elle n'est plus lue.

**En bas, le journal.** Daté, plus récent en haut : ce qui a été fait, ce qui a
cassé, la cause réelle, le temps perdu.

La règle qui tient l'ensemble : **une entrée qui a coûté du temps produit une
règle en haut, le jour même.** Sinon la leçon est perdue et l'erreur revient
— c'est exactement ce que ce fichier existe pour empêcher.

Ça change la façon d'écrire : on note **l'instruction qui aurait fait gagner le
temps perdu**, pas le récit de ce qui s'est passé.

- ✗ « J'ai galéré avec les types Payload après avoir modifié Home.ts. »
- ✓ « **Toujours** lancer `npm run generate:types` après toute modification de
  `globals/` ou `collections/`. »

Quand une règle cesse de s'appliquer, la supprimer. Ce n'est pas un musée.

### `skill.md` — la boîte à outils

Une table de routage, pas un inventaire. Trois colonnes : le skill · quand
l'appeler · **quand ne pas l'appeler**. La troisième fait tout le travail : elle
empêche d'ouvrir un skill de design pour un problème de build.

Avant chaque tâche notable : choisir, **le dire en une ligne**, agir. Plusieurs
skills peuvent se combiner — c'est même le cas courant.

Deux garde-fous :

- **Un skill listé doit exister pour de vrai.** Un nom inventé coûte plus cher
  que pas de table du tout : on se croit outillé et on ne l'est pas. Dans le
  doute, vérifier la liste des skills disponibles avant d'ajouter une ligne.
- **Une section « manques »** recense ce qu'on a dû faire à la main faute de
  skill. Trois occurrences de la même chose à la main, c'est un skill à écrire.

### `verify.md` — la preuve

C'est le seul fichier qui autorise le mot « fini ».

**Niveau 1 — est-ce que ça tourne.** Installation, lint, build, tests,
démarrage. Des commandes réelles, copiables, dans l'ordre, avec le résultat
attendu.

**Niveau 2 — l'objectif est-il atteint.** Une ligne par objectif de `CLAUDE.md`,
et en face : la commande, ou le parcours exact à refaire à la main.

Plus une date de dernier passage, et une section **échecs ouverts** — ce qui
échoue, depuis quand, et *pourquoi ce n'est pas encore réparé*. Un échec sans
ligne ici est un échec oublié.

La règle, non négociable : **aucune case ne se coche sans avoir vu la sortie de
la commande.** Écrire « OK » sur une vérification qu'on n'a pas lancée
transforme le fichier en décor.

Quand le projet a déjà son lanceur de scripts (`npm`, `make`), le niveau 1 se
câble dedans — `npm run verify` — plutôt que dans un script isolé qui dérivera.

## La boucle

C'est elle qui fait vivre les quatre fichiers.

**Avant d'agir**
1. `CLAUDE.md` — quel objectif cette tâche sert-elle ? Si aucun, ne pas la faire :
   l'ajouter au plan d'abord, ou s'en passer.
2. `memory.md` — les règles en haut. Cette erreur a-t-elle déjà été payée ?
3. `skill.md` — choisir un ou plusieurs skills, et le dire.

**Pendant**
4. Faire ce que la tâche demande. Rien de plus.

**Après**
5. Lancer `verify.md`. Vraiment le lancer.
6. Écrire dans `memory.md` : ce qui a changé, ce qui a raté, la règle qui en sort.
7. Corriger `CLAUDE.md` si une décision a bougé ou si l'état actuel a changé.

## Règles non négociables

1. **Pas de code avant les quatre fichiers.**
2. **Rien n'est « fini » tant que `verify.md` n'est pas passé**, en vrai, la
   sortie sous les yeux.
3. **On ne note jamais un résultat qu'on n'a pas vu.**
4. **Une erreur qui a coûté du temps produit une règle le jour même.**
5. **Un skill nommé dans `skill.md` existe.**
6. **`CLAUDE.md` décrit ce qui est**, pas ce qu'on espérait.
7. **Ce qui n'est pas dans le plan ne se code pas** — on l'ajoute au plan
   d'abord, ou on s'abstient.

## Les pièges

| Le piège | Ce qu'on voit | La sortie |
|---|---|---|
| `memory.md` devient un journal intime | Personne ne le relit, l'erreur revient | Les règles en haut, une ligne chacune. Le journal est l'archive, pas l'outil. |
| `CLAUDE.md` enfle | Chargé à chaque session, il encombre au lieu d'orienter | Le plan tient sur un écran. Le détail part dans un fichier appelé depuis le plan. |
| `skill.md` liste des skills inventés | On croit être outillé, on perd du temps à chercher | Vérifier l'existence avant d'ajouter la ligne. |
| `verify.md` coché sans être lancé | « Tout est vert » puis la production casse | Règle 3. La sortie ou rien. |
| Les quatre fichiers, puis plus rien | Quatre fichiers datés du premier jour | La boucle, pas la cérémonie. Le fichier qu'on n'a pas rouvert depuis dix séances ment déjà. |

## Reprendre un projet déjà commencé

La plupart des projets existent avant ce cadre. Les adopter rétroactivement, dans
cet ordre :

1. **`CLAUDE.md`** — reconstituer l'idée et les objectifs depuis ce qui tourne
   déjà, pas depuis ce qui était rêvé au départ. Ce qui est construit et hors
   plan : soit ça devient un objectif, soit ça part.
2. **`verify.md`** — écrire les commandes qui existent déjà (le `README` et les
   scripts `package.json` les donnent), puis une ligne par objectif. **Lancer le
   tout tout de suite.** Le premier passage dit l'état réel du projet, qui est
   rarement celui qu'on croyait.
3. **`memory.md`** — n'inventer aucun journal. Écrire directement les règles
   déjà connues : les pièges du projet, les commandes interdites, les ordres à
   respecter.
4. **`skill.md`** — lister les skills réellement utilisés sur ce projet.

## Les modèles

`modeles/` contient les quatre fichiers prêts à copier :

| Modèle | Destination |
|---|---|
| `modeles/CLAUDE.modele.md` | `<projet>/CLAUDE.md` |
| `modeles/memory.md` | `<projet>/memory.md` |
| `modeles/skill.md` | `<projet>/skill.md` |
| `modeles/verify.md` | `<projet>/verify.md` |

Le premier porte l'extension `.modele.md` pour une raison : un fichier nommé
`CLAUDE.md` posé n'importe où dans un dépôt est chargé comme mémoire de projet.
Un modèle vide chargé comme mémoire, c'est du bruit dans chaque session.
**Renommer à la copie**, jamais avant.
