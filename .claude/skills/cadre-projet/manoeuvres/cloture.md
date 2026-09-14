# Manœuvre — CLÔTURER

Le projet est fini, arrêté, ou passe à quelqu'un d'autre. Une clôture propre
prend une heure et vaut trois jours plus tard.

Une clôture n'est pas un abandon en silence : c'est un état déclaré.

## 1. Dire de quelle clôture il s'agit

| Type | Ce que ça veut dire |
|---|---|
| **Livré** | Les `O` sont atteints, le produit vit, quelqu'un s'en occupe |
| **Transmis** | Il continue sans toi. C'est la clôture la plus exigeante |
| **Arrêté** | On ne continue pas. Écrire **pourquoi** : c'est ce qu'on relira avant de recommencer la même chose dans deux ans |
| **En pause** | On reprendra. Alors c'est un gel, pas une clôture — voir plus bas |

## 2. La dernière preuve

`verify` **complet**, la sortie sous les yeux, et le résultat écrit dans
`verify.md` avec sa date. C'est l'état dans lequel on laisse le projet, et c'est
ce qu'on reprochera ou pas plus tard.

Si quelque chose est rouge et qu'on clôture quand même, **ça s'écrit** : quoi,
depuis quand, ce qu'il faudrait. Un rouge connu et documenté est acceptable ; un
rouge découvert par le suivant ne l'est pas.

## 3. Le test de la transmission

La seule question qui compte : **quelqu'un d'autre peut-il reprendre sans
t'appeler ?**

- [ ] Il sait **démarrer** le projet — les commandes sont écrites et exactes.
- [ ] Il sait **déployer**, et revenir en arrière.
- [ ] Il a **les accès** : dépôt, hébergeur, base, nom de domaine, back-office.
- [ ] Il sait **où sont les clés**, comment les regénérer, où elles sont
      déclarées en production.
- [ ] Il connaît les **pièges** — c'est `memory.md`, et c'est là qu'il vaut son
      poids.
- [ ] Il sait ce qui **reste à faire** — c'est « Plus tard » et la dette
      technique d'`ETAT.md`.

Ce test se passe pour de vrai : faire démarrer le projet par quelqu'un d'autre,
depuis un dossier vide, sans aide. Ce qui coince est ce qui manquait.

## 4. Les clés

À la transmission, **les clés personnelles se révoquent** — pas se transmettent.
Le repreneur génère les siennes. Une clé partagée est une clé qu'on ne pourra
plus retirer proprement le jour où il faudra.

Mettre à jour la colonne « rotation » du fichier de clés avant de partir.

## 5. L'état final

Dans `ETAT.md`, remplacer le tableau de bord par un **bloc de clôture** :

```markdown
## CLÔTURÉ — <type> — <date>

**Ce qui est livré :** <les O atteints>
**Ce qui ne l'est pas :** <les O abandonnés, et pourquoi>
**Ce qui reste connu comme cassé :** <ou « rien »>
**Dette laissée :** <ou « aucune »>
**Ce qu'on referait autrement :** <deux ou trois lignes — c'est ce qui sert
le plus au projet suivant>
**Repris par :** <qui, ou « personne »>
```

Le dernier point n'est pas de la littérature. C'est la seule trace qui fera
gagner du temps au prochain projet, et elle ne s'écrit qu'à chaud.

## 6. Le cas de la pause

Une pause n'est pas une clôture, et la traiter comme telle fait perdre le projet.
Écrire dans `ETAT.md` : **la date du gel**, **la prochaine action** telle qu'elle
était (assez concrète pour être reprise sans réfléchir), et **ce qui va pourrir
pendant l'attente** — dépendances qui vieillissent, clés qui expirent, données
qui se périment.

Puis lancer `verify` complet une dernière fois : on gèle sur du vert, ou on sait
exactement sur quel rouge on s'arrête.
