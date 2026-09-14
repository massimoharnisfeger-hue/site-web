# Phase 3 — CONSTRUCTION

**On y entre avec** des fondations qui tournent.
**On en sort avec** tous les jalons du périmètre **validés**.
**Porte de sortie :** chaque `O` a sa ligne verte dans `verify.md` niveau 2, et
le contrôle de cadre passe.

C'est la phase la plus longue, donc celle où le pilotage se perd. Deux défenses :
le **cycle**, qui s'applique à chaque incrément, et `ETAT.md`, tenu à jour.

## Le cycle — un incrément à la fois

« Fait » n'existe pas dans ce cadre. Un incrément est **validé**, ou il ne l'est
pas. Entre les deux, cinq étapes qu'on ne saute pas.

```
COMPRENDRE → CONSTRUIRE → PROUVER → STABILISER → VALIDER
```

Un incrément = une chose utilisable seule. S'il faut plus d'une journée, ce n'est
pas un incrément : c'est un jalon, et il se redécoupe.

### 1. COMPRENDRE — avant de toucher

Cette étape n'est pas facultative et n'est pas de la lecture polie. Elle répond
à trois questions :

- **Qu'est-ce qui existe déjà** qui fait ça, ou presque ? On ne réécrit pas ce
  qui est là.
- **Qui dépend de ce que je vais toucher ?** Chercher les usages avant de
  modifier une fonction, un champ, un fichier de configuration. *Rien ne se
  supprime dont on n'a pas tracé les dépendances.*
- **Qu'est-ce qui casse si je me trompe ?** La réponse dicte la prudence.

Quand le fichier est gros ou le projet inconnu, déléguer cette lecture à un agent
d'exploration : ça garde le contexte principal léger et la réponse est meilleure.

### 2. CONSTRUIRE

Quatre qualités, dans cet ordre de priorité :

| Qualité | Ce que ça veut dire concrètement |
|---|---|
| **Ciblé** | Le diff ne touche que ce que la tâche demande. Le reste attend. |
| **Réversible** | Un commit, une chose. On peut revenir en arrière sans démonter le reste. |
| **Prouvable** | On sait déjà comment on montrera que ça marche. |
| **Documenté** | Ce qui surprendrait quelqu'un d'autre est écrit — dans le code si c'est local, dans `CLAUDE.md` si c'est une décision. |

**Une tâche trop vague ne se commence pas.** « Améliorer la page d'accueil » n'est
pas une tâche. La rendre concrète avant de toucher au clavier :

> ✗ Améliorer la page d'accueil
> ✓ Afficher les horaires d'ouverture sous le titre, lus depuis le back-office,
>   avec repli sur les horaires par défaut si la base ne répond pas.
>   **Fini quand :** les horaires s'affichent avec la base coupée.

Une tâche concrète porte toujours son critère de fin.

### 3. PROUVER

`verify` **rapide** : lint, build, tests. La sortie sous les yeux, pas « ça
devrait passer ».

Puis **ajouter la preuve du nouvel incrément** à `verify.md`. Si l'incrément sert
un `O`, sa ligne niveau 2 se remplit maintenant — pas « plus tard », parce que
plus tard on ne saura plus comment on voulait le prouver.

Un incrément qui n'a rien ajouté à `verify.md` n'a rien prouvé.

### 4. STABILISER — l'étape qu'on saute et qui coûte

C'est ici que « ça marche chez moi » devient « ça marche ». Six contrôles :

| Contrôle | La question |
|---|---|
| **Usage réel** | L'utiliser pour de vrai, comme un utilisateur, pas comme un test. |
| **Cas limites** | Vide, très long, caractère accentué ou emoji, zéro, négatif, double clic, réseau coupé, deux onglets. |
| **Régression** | Ce qui marchait avant marche-t-il encore ? Le parcours voisin, pas seulement le nouveau. |
| **Comportement en panne** | Quand ça casse, l'utilisateur comprend-il ? Ou voit-il une page blanche ? |
| **Nettoyage** | Code mort, `TODO`, traces de débogage, valeurs en dur laissées « pour tester ». |
| **Transmission** | Ce que quelqu'un doit savoir pour reprendre est écrit quelque part. |

Ce qu'on trouve ici se répare **maintenant**. Ce qu'on choisit de ne pas réparer
devient une ligne de **dette technique** dans `ETAT.md`, avec la date et
l'échéance à laquelle on la paie. Une dette non écrite n'est pas une dette :
c'est une surprise.

### 5. VALIDER

Trois gestes, dans l'ordre :

1. La ligne `verify.md` de l'incrément passe au vert, **avec sa date**.
2. `ETAT.md` est mis à jour : l'incrément change d'état, la prochaine action est
   réécrite.
3. `memory.md` reçoit ce qui a été appris — et si quelque chose a coûté du temps,
   **la règle qui en sort, le jour même**.

Le troisième geste est celui qu'on saute quand on est pressé. C'est celui qui
fait qu'on repaie la même erreur en octobre.

## Tenir `ETAT.md`

Le tableau de bord ne vaut que s'il est vrai. Deux disciplines suffisent :

- **À la fin de chaque incrément** — pas à la fin de la journée : l'état change
  quand le travail change.
- **Toujours une seule « prochaine action »**, et elle est assez concrète pour
  être commencée sans réfléchir. Trois « prochaines actions », c'est aucune.

Si la date en tête d'`ETAT.md` a plus d'une semaine, le fichier ment déjà : le
signaler avant de répondre à quoi que ce soit sur l'avancement.

## L'ordre de travail

Quand plusieurs choses sont possibles, trancher dans cet ordre :

1. **Ce qui est bloqué le sera moins** — débloquer sert tout le monde.
2. **Le chemin critique** — le retard y est irrattrapable.
3. **Les inconnues** — tôt, jamais en dernière semaine.
4. **L'ESSENTIEL** avant tout le reste de l'échelle.
5. **Un gain rapide** quand le moral du projet baisse. Ce n'est pas un luxe :
   un projet qui semble immobile se fait abandonner.

## Ce qui n'a pas sa place ici

Une idée qui arrive en pleine construction ne se code pas au fil de l'eau : elle
passe par `manoeuvres/changement.md`. Même bonne. Surtout si elle est bonne — ce
sont les bonnes idées qui font exploser les périmètres.

## La porte

- [ ] Chaque jalon du périmètre est **validé** au sens du cycle.
- [ ] `verify` **complet** (niveaux 1 et 2) passe, la sortie sous les yeux.
- [ ] Chaque `O` de `CLAUDE.md` a sa ligne verte datée.
- [ ] `ETAT.md` n'a aucun blocage ouvert non expliqué.
- [ ] La dette technique est écrite, avec son échéance.
- [ ] `scripts/controle-cadre.sh` passe.

**Ensuite :** `phases/4-lancement.md`.
