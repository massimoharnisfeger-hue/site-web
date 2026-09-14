# Agents — <Nom du projet>

Les skills disent **comment** faire. Les agents disent **qui** le fait : un
exécutant à qui on confie une tâche cadrée, avec les skills qu'il charge et ce
qu'il doit rendre.

Déléguer a un second effet, souvent le plus utile : l'agent travaille dans son
propre contexte. Une grosse lecture confiée à un agent ne vient pas encombrer la
session principale.

**Un agent listé ici existe pour de vrai.** Vérifier la liste des types d'agents
disponibles avant d'écrire une ligne — un nom inventé fait perdre plus de temps
qu'une table vide.

## L'équipe

| Agent | Sa mission sur ce projet | Skills qu'il charge | Quand on l'appelle | Ce qu'il rend |
|---|---|---|---|---|
|  |  |  |  |  |

<!-- Un agent sans colonne « ce qu'il rend » se relance trois fois, faute de
     savoir ce qu'on attendait de lui. -->

## Les gardiens de la boucle

Qui contrôle quoi, et quand. **Une case vide est un moment non gardé** — c'est là
que les projets se cassent. Remplir avec les agents réellement disponibles.

| Moment | Rôle attendu | Agent | Il bloque si |
|---|---|---|---|
| COMPRENDRE | explorer l'existant et les dépendances sans rien modifier |  | une dépendance n'est pas tracée |
| CONSTRUIRE | tenir le build et les types |  | build rouge |
| PROUVER | relire le diff, chercher la régression |  | régression trouvée |
| STABILISER | cas limites, comportement en panne |  | un cas limite casse |
| VALIDER | contrôle de cadre |  | un point en échec |

## Le contrôle de cadre

Il prouve que **le pilotage ne ment pas** — à ne pas confondre avec `verify.md`,
qui prouve que le produit marche. Les deux sont nécessaires, ils ne répondent pas
à la même question.

**Il s'exécute, il ne se relit pas :**

```bash
bash .claude/skills/cadre-projet/scripts/controle-cadre.sh
```

À lancer avant chaque franchissement de porte, avant toute annonce de fin, et à
la revue régulière. Le script est la référence : ne pas recopier sa liste de
points ici, elle divergerait à la première évolution du cadre.

**Dernier passage :** <AAAA-MM-JJ — passe / N points en échec>

Le seul point irréversible est celui des clés dans l'historique. Une clé trouvée
là ne s'efface pas : on la **révoque**, on en génère une nouvelle, et la règle va
dans `memory.md` le jour même.

## Manques

Ce qu'on a dû faire à la main faute d'agent. Trois occurrences : c'est un agent
à écrire.

| Fait à la main | Occurrences | Agent à écrire ? |
|---|---|---|
|  |  |  |
