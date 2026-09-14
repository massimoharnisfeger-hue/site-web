# Manœuvre — REPRENDRE UN PROJET EXISTANT

Le projet existe déjà : pas d'`ETAT.md`, du code, peut-être aucune structure.
C'est le cas le plus fréquent, et le cadre s'y adopte rétroactivement.

**Ne rien réorganiser avant l'étape 3.** Ranger un projet qu'on ne comprend pas
est la meilleure façon de le casser en croyant l'aider.

## 1. Les clés d'abord — c'est le seul irréversible

```bash
git log --all --oneline -- .env .env.local .env.production 2>/dev/null
git log --all -p | grep -iE '(api[_-]?key|secret|password|token)\s*[=:]' | head
```

Si l'une des deux renvoie quelque chose : **arrêter tout et révoquer ces clés.**
Elles sont publiques, même si le dépôt est privé — un dépôt change de statut, se
clone, se transfère. Réécrire l'historique ne suffit pas : la clé a déjà voyagé.
On la remplace, on ne l'efface pas.

Le reste du cadre peut attendre une heure. Une clé publiée, non.

## 2. Comprendre ce qui existe

Sans rien modifier. Répondre à six questions :

| Question | Où on cherche |
|---|---|
| **Qu'est-ce que ça fait**, vraiment ? | le lancer, pas lire le README |
| **Comment on le lance** ? | `package.json`, `Makefile`, `README`, les scripts |
| **Qu'est-ce qui tourne déjà** — lint, build, tests ? | les lancer et **regarder la sortie** |
| **Où sont les données**, et où sont les clés ? | `.env*`, la configuration, les variables du service d'hébergement |
| **Qu'est-ce qui est déployé**, et depuis quand ? | l'hébergeur, le dernier commit en ligne |
| **Qu'est-ce qui fait peur** à l'auteur ? | lui demander. La réponse vaut trois heures de lecture. |

**La question 3 est la plus utile.** Un projet dont le build est déjà rouge n'est
pas un projet à améliorer : c'est un projet à réparer, et c'est un autre travail.

## 3. Reconstituer le plan depuis le réel

`CLAUDE.md` s'écrit **depuis ce qui tourne**, pas depuis ce qui était rêvé.

- Les `O` décrivent ce que le produit fait **aujourd'hui** et ce qu'il doit faire.
- Ce qui est construit mais hors plan : soit ça devient un `O`, soit ça part.
  Le laisser sans statut, c'est garder du code que personne n'ose toucher.
- Le tableau des décisions se remplit de ce qu'on peut reconstituer. Une décision
  dont personne ne sait plus le pourquoi se note comme telle : *« raison perdue »*
  est une information utile, elle dit qu'on peut la rediscuter.

## 4. Les preuves tout de suite

Écrire `verify.md` avec les commandes qui existent déjà, **et le lancer
immédiatement**. Le premier passage donne l'état réel du projet, qui n'est
presque jamais celui qu'on croyait. C'est le geste le plus rentable de la
reprise.

Puis une ligne par `O`, colonne « comment on le prouve » remplie autant que
possible.

## 5. Le reste du cadre

`ETAT.md` (phase réelle, pas la phase espérée) · `memory.md` (directement les
règles connues, **aucun journal inventé**) · `skill.md` et `agents.md`.

## Cas particulier — le projet part dans tous les sens

Aucune structure, du code en double, des fichiers `final_v2_ok` , personne ne
sait ce qui sert. Alors on ne range pas : **on cartographie**.

1. **Qu'est-ce qui tourne en production ?** C'est la seule vérité. Tout le reste
   est peut-être mort.
2. **Qu'est-ce qui est atteint depuis le point d'entrée ?** Suivre les liens
   depuis le fichier de démarrage. Ce qui n'est jamais atteint est mort.
3. **Écrire la carte dans `CLAUDE.md`** : ce qui sert, ce qui est mort, ce dont
   on n'est pas sûr. Les trois colonnes, honnêtement.
4. **Ne supprimer que la colonne « mort », et une catégorie à la fois**, chacune
   dans son commit, `verify` entre chaque. La colonne « pas sûr » attend d'être
   tranchée par une preuve, pas par une intuition.
5. **La réorganisation vient après**, jamais avant. Et elle se fait par petits
   déplacements prouvés, pas en un grand soir.

Ce nettoyage **est** un jalon : il s'écrit dans `ETAT.md` et il a une porte.
Sinon il ne finit jamais.

## Après

Retour à la phase réelle du projet, celle qu'`ETAT.md` vient de déclarer. Le plus
souvent CONSTRUCTION — parfois CADRAGE, quand la reprise révèle qu'on ne sait
plus à quoi sert le projet. Ça arrive, et le reconnaître fait gagner des mois.
