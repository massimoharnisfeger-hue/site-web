# Agents — <Nom du projet>

Les skills disent **comment** faire. Les agents disent **qui** le fait : un
exécutant à qui on confie une tâche cadrée, avec les skills qu'il charge et ce
qu'il doit rendre.

Même garde-fou que `skill.md` : **un agent listé ici existe pour de vrai.**
Vérifier la liste des types d'agents disponibles avant d'ajouter une ligne.

## L'équipe

| Agent | Sa mission sur ce projet | Skills qu'il charge | Quand on l'appelle | Ce qu'il rend |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |

> Un agent sans colonne « ce qu'il rend » est un agent qu'on relancera trois
> fois faute de savoir ce qu'on attendait de lui.

## Les gardiens de la boucle

Qui contrôle quoi, et à quel moment. **Une case vide est un moment non gardé** —
c'est là que les projets se cassent.

| Moment de la boucle | Agent | Ce qu'il vérifie | Il bloque si |
|---|---|---|---|
| Avant d'agir |  | la tâche sert un `O` de CLAUDE.md, les règles de memory.md sont lues | aucun `O` concerné |
| Pendant |  | le build et les types tiennent | build rouge |
| Après |  | la qualité du diff, pas de régression | régression |
| Avant de dire « fini » |  | `verify.md` est passé **en vrai** | une ligne non prouvée |
| Régulièrement |  | le contrôle de cadre ci-dessous | un point échoue |

## Le contrôle de cadre

À lancer avant toute annonce de fin, et à intervalle régulier. C'est ce qui
empêche les six fichiers de devenir du décor.

| # | Ce qu'on vérifie | Comment | Dernier passage |
|---|---|---|---|
| 1 | Les six fichiers sont à la racine | `ls CLAUDE.md memory.md skill.md verify.md agents.md .env.local` |  |
| 2 | Chaque `O` de CLAUDE.md a sa ligne dans `verify.md` | lecture croisée |  |
| 3 | `verify.md` a un passage daté de moins de \<N\> jours | en-tête du fichier |  |
| 4 | Chaque entrée coûteuse de `memory.md` a produit une règle | lecture du journal |  |
| 5 | Les skills et les agents listés existent | liste des skills / des types d'agents |  |
| 6 | Le fichier de clés est ignoré par git | `git check-ignore -v .env.local` |  |
| 7 | **Aucune clé n'est dans l'historique** | `git log --all --oneline -- .env.local` → doit être vide |  |
| 8 | L'« état actuel » de CLAUDE.md dit la vérité | le comparer au dernier passage de `verify.md` |  |
| 9 | L'arborescence réelle correspond à celle déclarée | `ls` contre ce qu'annonce CLAUDE.md |  |

> **Le point 7 est le seul irréversible.** Une clé trouvée dans l'historique ne
> s'efface pas : on la **révoque**, on en génère une nouvelle, et on note la
> règle dans `memory.md` le jour même. Réécrire l'historique ne suffit pas —
> la clé a déjà voyagé.

## Manques

Ce qu'on a dû faire à la main faute d'agent. Trois occurrences : c'est un agent
à écrire.

| Fait à la main | Occurrences | Agent à écrire ? |
|---|---|---|
|  |  |  |
