# Manœuvre — UN CHANGEMENT ARRIVE

« Ajoute donc… », « finalement je préférerais… », « ce serait bien si… ».

Un changement ne se code jamais au fil de l'eau, même petit, **surtout s'il est
bon** : ce sont les bonnes idées qui font exploser les périmètres. Il passe par
ici, ça prend cinq minutes.

## 1. L'analyse d'impact — six questions

| # | Question | Où on regarde |
|---|---|---|
| 1 | **Quel `O` sert-il ?** Aucun ? Alors c'est un nouvel objectif, pas un détail. | `CLAUDE.md` |
| 2 | **Qu'est-ce qu'il touche** — fichiers, données, parcours, pages ? | le code, avant d'ouvrir la bouche |
| 3 | **Quelles tâches naissent, meurent ou changent ?** | `ETAT.md` |
| 4 | **Quelles dépendances bougent ?** Un jalon devient-il tributaire d'un autre ? | `ETAT.md` |
| 5 | **L'architecture doit-elle évoluer ?** Si oui, ce n'est plus un changement : c'est un jalon. | `CLAUDE.md`, la carte |
| 6 | **Qu'est-ce qui doit être réécrit** — plan, état, preuves, conventions ? | les fichiers du cadre |

Si la question 2 n'a pas de réponse **lue dans le code**, l'analyse n'est pas
faite. Estimer l'impact de mémoire est la façon la plus courante de se tromper.

## 2. Le verdict — quatre issues, pas deux

| Issue | Quand | Ce qu'on fait |
|---|---|---|
| **Dans le périmètre** | Sert un `O` existant, impact borné | l'ajouter comme incrément, mettre `ETAT.md` à jour |
| **Échange** | Sert un `O`, mais le périmètre est tenu par une date | l'accepter **contre** autre chose qui sort. Dire quoi. |
| **Plus tard** | Bonne idée, mauvais moment | dans « Plus tard » d'`ETAT.md`, avec son niveau et la date |
| **Nouveau cadrage** | Change un objectif ou l'architecture | ce n'est plus un changement : retour en CADRAGE, assumé |

**La règle de l'échange.** Quand la date est fixe, un périmètre ne grossit
jamais : il se remplace. *« Oui, et on sort quoi ? »* est la question la plus
utile de tout ce cadre. Sans elle, tous les projets finissent en retard pour la
même raison.

## 3. Le dire correctement

Refuser sèchement fait perdre des bonnes idées ; accepter tout fait perdre le
projet. La formulation qui marche :

> *« Bonne idée, et elle sert vraiment O2. Mais elle touche le tunnel de
> réservation, donc elle décale M3 d'environ deux jours. Trois options : on la
> prend et M3 glisse ; on la prend et on sort les avis clients du périmètre ;
> on la range en Plus tard, prioritaire, première chose après le lancement.
> Je pencherais pour la troisième — c'est la seule qui ne touche pas au chemin
> critique. Tu tranches. »*

Impact chiffré, options réelles, recommandation assumée, décision qui reste à
celui dont c'est le projet.

## 4. Après le verdict

Quelle que soit l'issue, **quelque chose est écrit** — un changement qui ne
laisse aucune trace reviendra à l'identique dans trois semaines :

- accepté → `ETAT.md` (tâches, jalons, prochaine action) ;
- accepté contre autre chose → `ETAT.md` **et** le tableau des décisions de
  `CLAUDE.md`, avec ce qui a été sorti et pourquoi ;
- reporté → « Plus tard » d'`ETAT.md`, avec le niveau et la date ;
- refusé → le tableau des décisions de `CLAUDE.md`. Un refus non écrit se
  rediscute indéfiniment.

Puis **retour à la phase en cours**.
