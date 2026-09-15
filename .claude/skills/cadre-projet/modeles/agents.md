# Agents — <Nom du projet>

Les skills disent **comment**. Les agents disent **qui**.

## Le principe qui commande tout le reste

**Un agent travaille dans son propre contexte, vide.** C'est sa force — une
grosse lecture n'encombre pas la session principale — et c'est sa limite : il
ne sait rien de ce projet, et il ne se souviendra de rien la fois d'après.

Donc **un agent n'apprend pas. Son brief apprend.**

Tout ce que tu as dû lui réexpliquer une deuxième fois appartient au brief. Ce
fichier est l'endroit où cette expérience s'accumule — c'est ce qui fait qu'à la
dixième délégation, le résultat n'a rien à voir avec la première.

**Un agent listé ici existe pour de vrai.** Vérifier avant d'écrire la ligne.

---

## L'équipe

| Agent | Sa mission ici | Skills qu'il charge | Ce qu'il rend | Brief |
|---|---|---|---|---|
|  |  |  |  | ↓ |

<!-- Un agent sans colonne « ce qu'il rend » se relance trois fois, faute de
     savoir ce qu'on attendait de lui. -->

---

## Les briefs — la mémoire de chaque agent

Un bloc par agent. **Se recopie tel quel au moment de déléguer.** C'est la partie
du fichier qui grossit avec l'expérience, et la seule qui rend un agent meilleur.

### `<nom-de-l-agent>`

**Ce qu'il ne peut pas savoir** — le contexte du projet qu'il faut lui donner à
chaque fois, parce qu'il démarre à vide :
> 

**Ce que je lui demande** — la forme de la demande, pas le sujet :
> 

**Ce qu'il doit rendre** — format exact, pour ne pas avoir à le relancer :
> 

**Pièges déjà rencontrés** — une ligne par erreur qu'il a commise et qu'on ne
veut plus voir. *C'est cette liste qui fait toute la différence.*
> - 

**Ce qu'il ne doit PAS faire** — les débordements constatés :
> - 

**Dernière révision :** <date> — <ce qui a changé et pourquoi>

---

## Les quatre façons de déléguer

Choisir la forme avant de lancer : elles n'ont ni le même coût ni le même usage.

| Forme | Quand | Ce que ça coûte |
|---|---|---|
| **Solo** | une tâche cadrée, un seul angle | le moins cher, le défaut |
| **Parallèle** | plusieurs angles indépendants sur le même objet — sécurité, performance, accessibilité | n agents en même temps ; ne marche que si les angles ne se chevauchent pas |
| **Chaîne** | explorer → planifier → construire → relire ; la sortie de l'un est l'entrée du suivant | lent, mais c'est la seule forme qui tient sur un gros changement |
| **Contradiction** | une décision coûteuse ou irréversible : deux agents, la même question, posée **sans leur dire qu'un autre y répond** | double coût — réservé aux décisions qu'on ne pourra pas défaire |

La contradiction est la plus sous-employée. Deux avis indépendants qui
convergent valent une certitude ; deux qui divergent viennent de désigner
exactement l'endroit où il fallait réfléchir.

---

## Se remettre en question : juger un retour d'agent

**Un retour d'agent est une proposition, jamais un fait.** Quatre contrôles,
dans l'ordre, avant d'agir dessus :

| # | Le contrôle | Ce qu'on cherche |
|---|---|---|
| 1 | **Est-ce vérifiable ?** | Une affirmation sans `fichier:ligne`, sans commande, sans sortie, n'a pas été vérifiée — elle a été supposée. |
| 2 | **Est-ce trop beau ?** | Un agent qui rend exactement ce qu'on espérait mérite un second regard. Il a peut-être répondu à la question, pas au problème. |
| 3 | **A-t-il dit ce qu'il n'a pas pu faire ?** | Un rapport sans aucune limite déclarée est un rapport incomplet. Tout travail a des angles morts. |
| 4 | **Le coût de l'erreur** | S'il se trompe, qu'est-ce qui casse ? Plus c'est cher, plus on vérifie soi-même au lieu de faire confiance. |

**« Tout va bien » n'est pas un résultat.** C'est l'absence de résultat, et c'est
le signal le plus fiable qu'un agent n'a rien cherché.

---

## Le journal de délégation

Une ligne par délégation notable. **Court, sinon il ne se remplit pas.**

| Date | Agent | Tâche | Utile ? | Ce que j'ai changé dans son brief |
|---|---|---|---|---|
|  |  |  | oui / à moitié / non |  |

<!-- La dernière colonne est la seule qui compte. Une délégation ratée qui ne
     modifie aucun brief est une délégation qu'on refera à l'identique. -->

---

## Comment un agent devient meilleur

La boucle, à chaque délégation. Elle prend deux minutes et c'est elle qui fait
tout le travail.

1. **Déléguer avec le brief**, recopié tel quel — pas une version improvisée.
2. **Juger le retour** avec les quatre contrôles ci-dessus.
3. **Si c'est raté, chercher la cause dans le brief avant de blâmer l'agent.**
   Neuf fois sur dix elle y est : un contexte manquant, un format non dit, une
   limite non posée.
4. **Corriger le brief le jour même**, pendant qu'on sait encore ce qui a manqué.
5. **Trois échecs sur le même point** → ce n'est plus le brief. Changer d'agent,
   ou écrire un skill qui porte la connaissance manquante.

### Les trois façons de rater une délégation

| Le symptôme | La vraie cause | La correction |
|---|---|---|
| Il rend à côté | La demande était vague, ou le format non dit | Préciser « ce qu'il doit rendre » |
| Il rend du plausible mais faux | Il manquait le contexte du projet | Étoffer « ce qu'il ne peut pas savoir » |
| Il déborde et touche à autre chose | Aucune limite n'était posée | Ajouter une ligne à « ce qu'il ne doit PAS faire » |

---

## Les gardiens de la boucle

Qui contrôle quoi, et quand. **Une case vide est un moment non gardé** — c'est là
que les projets se cassent.

| Moment | Rôle attendu | Agent | Il bloque si |
|---|---|---|---|
| COMPRENDRE | explorer l'existant sans rien modifier |  | une dépendance n'est pas tracée |
| CONSTRUIRE | tenir le build et les types |  | build rouge |
| PROUVER | relire le diff, chercher la régression |  | régression trouvée |
| STABILISER | cas limites, comportement en panne |  | un cas limite casse |
| VALIDER | contrôle de cadre |  | un point en échec |

---

## Le contrôle de cadre

Il prouve que **le pilotage ne ment pas** — `verify.md` prouve que le produit
marche, `securite.md` qu'il ne fait pas ce qu'il ne doit pas. Trois questions
différentes.

```bash
bash .claude/skills/cadre-projet/scripts/controle-cadre.sh
```

**Dernier passage :** <AAAA-MM-JJ>

Le seul point irréversible est celui des clés dans l'historique. Une clé trouvée
là se **révoque**, elle ne s'efface pas.

---

## Les manques

Ce qu'on a dû faire à la main faute d'agent. Trois occurrences : c'est un agent
à écrire — ou un brief à extraire de ce qu'on retape à chaque fois.

| Fait à la main | Occurrences | Agent à écrire ? |
|---|---|---|
|  |  |  |
