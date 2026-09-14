---
name: cadre-projet
description: "Cadre de démarrage et de conduite de tout projet Claude Code : un dossier au nom du projet et six fichiers — CLAUDE.md (le plan, l'idée, les objectifs numérotés), memory.md (les modifications, les erreurs et les règles qui en sortent pour ne plus les refaire), skill.md (les skills disponibles et lesquels choisir avant d'agir), agents.md (l'équipe d'agents, les gardiens de la boucle et le contrôle de cadre), verify.md (la preuve que le projet tourne et que l'objectif du plan est atteint), et le fichier de clés API et mots de passe, ignoré par git. Déclencher dès que l'utilisateur dit : nouveau projet, on démarre, on commence, initialise le projet, mets ça en place, reprends le projet, quel est le plan, note ça pour ne pas refaire l'erreur, mémoire du projet, apprentissages, quel skill utiliser, quel agent, clé API, mot de passe, variable d'environnement, .env, secret, vérifie que ça marche, est-ce bien structuré, l'objectif est-il atteint, c'est fini. Déclencher aussi avant d'écrire la première ligne de code d'un projet neuf, et avant d'annoncer qu'un travail est terminé."
metadata:
  version: 2.0.0
  langue: fr
---

# Cadre projet — six fichiers, une boucle

Un projet tient dans un dossier et six fichiers. On lit avant d'agir, on prouve
avant de dire « fini », on écrit après. Le reste est du code.

Ces fichiers ne sont pas de la documentation : ce sont les fichiers de travail.
Créés le premier jour puis jamais rouverts, ils ne servent à rien. C'est **la
boucle**, plus bas, qui les rend utiles.

## Le principe

| Fichier | Répond à | Lu | Écrit |
|---|---|---|---|
| `CLAUDE.md` | Qu'est-ce qu'on construit, et c'est fini quand ? | avant chaque tâche | quand une décision change |
| `memory.md` | Qu'est-ce qui a déjà été payé cher ? | avant chaque tâche | après chaque tâche |
| `skill.md` | Avec quels outils j'attaque ça ? | avant chaque tâche | quand un outil fait ses preuves |
| `agents.md` | Qui fait le travail, et qui le contrôle ? | avant de déléguer | quand l'équipe bouge |
| `verify.md` | Ça tourne ? L'objectif est-il atteint ? | avant de dire « fini » | à chaque passage |
| `.env.local` | Où sont les clés et les mots de passe ? | quand une clé manque | quand une clé arrive ou tourne |

Les cinq premiers vivent **à la racine du dossier du projet** et se commitent.
Le sixième vit à la racine aussi et **ne se commite jamais**.

## Démarrer un projet neuf

Dans cet ordre. **Aucune ligne de code avant l'étape 6.**

1. **Le dossier** porte le nom du projet : minuscules, tirets, ni accent ni
   espace. `padel-house`, `passclub-landing`, `grosjean-devis`.
2. **Le `.gitignore` d'abord.** Avant même qu'un fichier de clés existe :

   ```bash
   grep -qx '.env.local' .gitignore || echo '.env.local' >> .gitignore
   ```

   Cet ordre n'est pas une préférence. Créer le fichier avant la ligne, c'est
   risquer le `git add .` qui brûle toutes les clés d'un coup.
3. **`CLAUDE.md`** — copier `modeles/CLAUDE.modele.md` vers `<projet>/CLAUDE.md`,
   puis le remplir **avec l'utilisateur**. L'idée, les objectifs numérotés, le
   hors-sujet, les contraintes. C'est la seule étape qui exige sa présence :
   inventer un objectif à sa place, c'est construire le mauvais projet vite.
4. **Les quatre autres** — copier `memory.md`, `skill.md`, `agents.md`,
   `verify.md`. Ils partent presque vides, sauf `verify.md` : y inscrire dès
   maintenant une ligne par objectif, même sans savoir encore comment le
   prouver. Une ligne vide est une question ouverte ; une ligne absente est un
   objectif oublié.
5. **Le fichier de clés** — copier `modeles/cles.env.modele` vers
   `<projet>/.env.local`, puis vérifier qu'il est bien ignoré :

   ```bash
   git check-ignore -v .env.local   # doit répondre
   ```
6. **Relire les objectifs.** Si l'un d'eux ne se répond pas par oui ou par non,
   il est mal écrit. Le corriger maintenant coûte cinq minutes ; plus tard, il
   coûte le projet.
7. Coder.

## Les six fichiers

### `CLAUDE.md` — le plan

Claude Code charge ce fichier **automatiquement, à chaque session**. Le plan est
donc lu sans que personne n'ait à y penser. Deux conséquences :

- **Il tient sur un écran.** Tout ce qui est chargé à chaque session et n'est
  pas relu à chaque session est du bruit. Le détail va dans un fichier à part,
  appelé depuis le plan.
- **Il importe les autres**, en dernière ligne : `@memory.md` · `@skill.md` ·
  `@agents.md` · `@verify.md`. Ils cessent d'être une lecture optionnelle.
  Le fichier de clés, lui, ne s'importe jamais — ses valeurs n'ont rien à faire
  dans un contexte de session.

Ce qu'il contient : l'idée en une phrase · les objectifs numérotés `O1`, `O2`,
`O3` · le hors-sujet · les contraintes · les décisions datées avec leur pourquoi
· l'état actuel en une ligne.

**Un objectif se formule pour qu'un tiers réponde oui ou non sans appeler
personne.** « Faire un beau tunnel de réservation » n'est pas un objectif :
c'est une humeur. « Un visiteur envoie une demande sans créer de compte » en est
un. Chaque `O` est repris tel quel dans `verify.md` — pas d'objectif sans
preuve, pas de preuve sans objectif.

Ce qu'il ne contient jamais : l'historique des séances (c'est `memory.md`), le
détail d'implémentation (c'est le code), une clé (c'est `.env.local`), ni un
état optimiste. **`CLAUDE.md` décrit ce qui est, pas ce qu'on espérait.**

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
  que pas de table du tout : on se croit outillé et on ne l'est pas.
- **Une section « manques »** recense ce qu'on a dû faire à la main faute de
  skill. Trois occurrences de la même chose à la main, c'est un skill à écrire.

### `agents.md` — l'équipe et les gardiens

Les skills disent *comment*. Les agents disent *qui*. Le fichier tient trois
choses :

1. **L'équipe** — par agent : sa mission sur ce projet, les skills qu'il charge,
   quand on l'appelle, et **ce qu'il rend**. Sans cette dernière colonne, on le
   relance trois fois faute de savoir ce qu'on attendait.
2. **Les gardiens de la boucle** — qui contrôle quoi, à quel moment, et sur quoi
   il bloque. Une case vide est un moment non gardé ; c'est là que les projets
   se cassent.
3. **Le contrôle de cadre** — neuf points qui vérifient que les six fichiers
   tiennent debout : ils existent, chaque `O` a sa preuve, `verify.md` a tourné
   récemment, les leçons sont devenues des règles, les skills et agents cités
   existent, les clés sont hors de git et **hors de l'historique**, et l'état
   déclaré correspond au réel.

Ce contrôle se lance avant toute annonce de fin, et à intervalle régulier. C'est
lui qui répond à « est-ce que tout est bien structuré et tourne bien ».

Même garde-fou que pour les skills : **un agent listé existe pour de vrai.**

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

### `.env.local` — les clés

Toutes les clés API et tous les mots de passe du projet, à un seul endroit.

**Le nom est celui que l'outil charge tout seul** : `.env.local` pour Next et
Vite, `.env` pour Node, Python, Docker. Un fichier joliment nommé que le code ne
lit pas ne sert à personne.

Pour chaque clé, trois lignes de commentaire au-dessus — ce qu'on cherche
toujours six mois plus tard : **à quoi elle sert**, **où on l'obtient** (le
chemin exact pour la regénérer), **où elle est déclarée en production**. Plus la
date de dernière rotation.

Les trois règles, dans l'ordre d'importance :

1. **Le `.gitignore` avant le fichier.** Toujours. L'inverse, c'est le `git add .`
   qui brûle tout.
2. **Aucune valeur ne sort d'ici** — ni dans le code, ni dans un commit, ni dans
   un message, ni dans une capture.
3. **Une clé commitée est une clé brûlée.** Elle reste dans l'historique après
   suppression : elle se **révoque** et se régénère. C'est la seule erreur de ce
   cadre qui ne se rattrape pas.

Projet partagé ? Garder à côté un `.env.example` : mêmes clés, valeurs vides.
Lui se commite, et il devient la liste de courses d'un nouvel arrivant.

## La boucle

C'est elle qui fait vivre les six fichiers.

**Avant d'agir**
1. `CLAUDE.md` — quel objectif cette tâche sert-elle ? Si aucun, ne pas la faire :
   l'ajouter au plan d'abord, ou s'en passer.
2. `memory.md` — les règles en haut. Cette erreur a-t-elle déjà été payée ?
3. `skill.md` et `agents.md` — choisir les skills, et l'agent si on délègue.
   Le dire en une ligne.

**Pendant**
4. Faire ce que la tâche demande. Rien de plus.

**Après**
5. Lancer `verify.md`. Vraiment le lancer.
6. Écrire dans `memory.md` : ce qui a changé, ce qui a raté, la règle qui en sort.
7. Corriger `CLAUDE.md` si une décision a bougé ou si l'état actuel a changé.

**Avant de dire « fini »**
8. Lancer le **contrôle de cadre** d'`agents.md`. Les neuf points, y compris les
   deux sur les clés.

## Règles non négociables

1. **Pas de code avant les six fichiers.**
2. **Le `.gitignore` avant le fichier de clés** — jamais l'inverse.
3. **Aucune valeur de clé ne sort du fichier de clés.**
4. **Rien n'est « fini » tant que `verify.md` n'est pas passé**, en vrai, la
   sortie sous les yeux.
5. **On ne note jamais un résultat qu'on n'a pas vu.**
6. **Une erreur qui a coûté du temps produit une règle le jour même.**
7. **Un skill ou un agent nommé existe.**
8. **`CLAUDE.md` décrit ce qui est**, pas ce qu'on espérait.
9. **Ce qui n'est pas dans le plan ne se code pas** — on l'ajoute au plan
   d'abord, ou on s'abstient.

## Les pièges

| Le piège | Ce qu'on voit | La sortie |
|---|---|---|
| `memory.md` devient un journal intime | Personne ne le relit, l'erreur revient | Les règles en haut, une ligne chacune. Le journal est l'archive, pas l'outil. |
| `CLAUDE.md` enfle | Chargé à chaque session, il encombre au lieu d'orienter | Le plan tient sur un écran. Le détail part dans un fichier appelé depuis le plan. |
| `skill.md` ou `agents.md` listent des noms inventés | On croit être outillé, on perd du temps à chercher | Vérifier l'existence avant d'ajouter la ligne. |
| `verify.md` coché sans être lancé | « Tout est vert » puis la production casse | Règle 5. La sortie ou rien. |
| La clé « juste pour tester » dans le code | Elle part au premier commit et ne revient jamais | Règle 3. Elle passe par le fichier de clés, même pour cinq minutes. |
| Le fichier de clés créé avant le `.gitignore` | Un `git add .` et tout est brûlé | Règle 2. L'ordre est la protection. |
| Les six fichiers, puis plus rien | Six fichiers datés du premier jour | La boucle, pas la cérémonie. Le fichier qu'on n'a pas rouvert depuis dix séances ment déjà. |

## Reprendre un projet déjà commencé

La plupart des projets existent avant ce cadre. Les adopter rétroactivement,
dans cet ordre :

1. **Les clés d'abord.** Vérifier que le fichier de clés existe, qu'il est
   ignoré, et surtout qu'aucune clé n'est **déjà** dans l'historique :

   ```bash
   git log --all --oneline -- .env .env.local
   ```

   Si cette commande renvoie quoi que ce soit, révoquer ces clés avant toute
   autre chose. Le reste du cadre peut attendre une heure ; une clé publiée, non.
2. **`CLAUDE.md`** — reconstituer l'idée et les objectifs depuis ce qui tourne
   déjà, pas depuis ce qui était rêvé au départ. Ce qui est construit et hors
   plan : soit ça devient un objectif, soit ça part.
3. **`verify.md`** — écrire les commandes qui existent déjà (le `README` et les
   scripts `package.json` les donnent), puis une ligne par objectif. **Lancer le
   tout tout de suite.** Le premier passage dit l'état réel du projet, qui est
   rarement celui qu'on croyait.
4. **`memory.md`** — n'inventer aucun journal. Écrire directement les règles
   déjà connues : les pièges du projet, les commandes interdites, les ordres à
   respecter.
5. **`skill.md` et `agents.md`** — lister ce qui est réellement utilisé sur ce
   projet, puis lancer le contrôle de cadre pour voir ce qui manque.

## Les modèles

`modeles/` contient les six fichiers prêts à copier :

| Modèle | Destination | Commité ? |
|---|---|---|
| `modeles/CLAUDE.modele.md` | `<projet>/CLAUDE.md` | oui |
| `modeles/memory.md` | `<projet>/memory.md` | oui |
| `modeles/skill.md` | `<projet>/skill.md` | oui |
| `modeles/agents.md` | `<projet>/agents.md` | oui |
| `modeles/verify.md` | `<projet>/verify.md` | oui |
| `modeles/cles.env.modele` | `<projet>/.env.local` | **jamais** |

Deux extensions sont volontaires. `CLAUDE.modele.md` : un fichier nommé
`CLAUDE.md` posé n'importe où dans un dépôt est chargé comme mémoire de projet,
et un gabarit vide chargé à chaque session est du bruit. `cles.env.modele` : le
modèle ne doit surtout pas ressembler à un vrai fichier de clés, pour qu'on ne
le confonde jamais avec celui qui en contient. **Renommer à la copie**, jamais
avant.
