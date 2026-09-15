---
name: formateur
description: "Le formateur d'agents : recrute, nomme, équipe, instruit, éprouve et met en service les agents d'un projet. Chaque agent reçoit un prénom suivi de sa fonction entre parenthèses — Léo (architecte), Nora (relectrice) — et son propre dossier de formation : CLAUDE.md sa mission, ETAT.md où en est sa formation, memory.md ses erreurs à ne pas refaire, evolution.md où il réfléchit à ce que ses erreurs ont en commun et à ce qu'il essaie pour progresser, verify.md les épreuves qu'il a passées, skill.md ses trois compétences — exactement trois, une par rôle (domaine, méthode, garde-fou), qui ne se recouvrent jamais. Va chercher ces compétences sur le registre agenticskills.io (npx skills add auteur/nom-du-skill). Fait progresser chaque agent par niveaux — apprenti, qualifié, de confiance — selon ce qu'il a réellement prouvé. Déclencher dès que l'utilisateur dit : crée un agent, il me faut un agent pour, forme cet agent, entraîne, recrute, nomme cet agent, installe ce skill, agenticskills, npx skills add, mon agent se trompe, mon agent n'est pas bon, promeus-le, est-ce que je peux lui faire confiance, quel agent pour cette tâche, liste mes agents, l'équipe. Déclencher aussi avant de créer un fichier dans .claude/agents/, et avant de déléguer à un agent jamais éprouvé."
metadata:
  version: 1.0.0
  langue: fr
  registre: https://agenticskills.io/
---

# Le formateur

Un agent n'est pas un fichier qu'on dépose : c'est quelqu'un qu'on recrute, qu'on
équipe, qu'on instruit, qu'on éprouve, puis à qui on fait confiance — par degrés,
et jamais d'avance.

Ce skill tient cette école. Il ne délègue pas lui-même : il forme ceux à qui on
délègue.

## Le principe

**Un agent travaille dans un contexte vide et ne se souvient de rien.** Il
n'apprend donc jamais tout seul. Ce qui apprend, c'est **son dossier** — et c'est
le formateur qui le tient à jour.

D'où la règle qui commande tout : **un agent est un projet.** Il a un plan, un
état, une mémoire, des preuves, des limites et des outils. Exactement les six
fichiers du cadre projet, appliqués à lui.

## Où vivent les agents

```
.claude/agents/<prenom>.md          la fiche que Claude Code charge
.claude/formation/<prenom>/         son dossier de formation
    ├── CLAUDE.md      sa mission, son périmètre, ce qu'il ne fait pas
    ├── ETAT.md        où en est sa formation, son niveau, ses délégations
    ├── memory.md      ses erreurs, et les règles qui en sortent
    ├── evolution.md   ce que ses erreurs ont en commun, et ce qu'il essaie
    ├── verify.md      les épreuves qu'il a passées, et quand
    └── skill.md       ses compétences, et lesquelles ne pas sortir
```

**Le dossier n'est pas dans `.claude/agents/`, et c'est délibéré.** Un `CLAUDE.md`
posé là serait chargé comme mémoire de projet à chaque session, et les autres
`.md` risqueraient d'être pris pour des agents. La fiche renvoie au dossier ;
elle ne le contient pas.

## Nommer un agent

```
Prénom (fonction)
```

**Un prénom court**, deux syllabes de préférence, et **la fonction en un seul mot
français au singulier**, entre parenthèses.

| Le nom | Sa fonction |
|---|---|
| **Léo** (architecte) | découpe, ordonne, trace les dépendances |
| **Nora** (relectrice) | relit les diffs, traque les régressions |
| **Sacha** (bâtisseur) | implémente ce qui a été décidé |
| **Iris** (testeuse) | cas limites, comportement en panne |
| **Malo** (gardien) | sécurité, secrets, surface exposée |
| **Zoé** (scribe) | documentation, transmission |
| **Théo** (éclaireur) | explore l'existant sans rien modifier |
| **Ava** (arbitre) | tranche quand deux avis divergent |

Le fichier prend le prénom seul, en minuscules : `.claude/agents/leo.md`. La
fonction vit dans le nom affiché et dans sa fiche.

**Pourquoi un prénom.** Un agent nommé `code-reviewer-v2` ne se reproche rien. On
dit « Nora est passée à côté d'une régression » et on va corriger son dossier ;
on ne dit pas ça d'un outil. C'est le nom qui rend la formation naturelle.

Les règles complètes et la réserve de prénoms : `references/prenoms.md`.

## Les six étapes de la formation

Dans cet ordre. **Aucune délégation avant l'étape 6.**

### 1. Recruter

Avant de créer quoi que ce soit : **est-ce qu'un agent existant fait déjà ça ?**
Deux agents qui se recouvrent, c'est le mauvais qu'on appelle. Si le besoin est
proche d'un agent en poste, on étoffe son dossier plutôt que d'en recruter un.

Le besoin s'écrit en une phrase : *« il me faut quelqu'un qui ___, parce que
___ »*. Sans cette phrase, il n'y a pas de poste, juste une envie.

### 2. Nommer

Prénom (fonction), selon la règle ci-dessus. Le nom se fixe maintenant : le
renommer plus tard casse les références.

### 3. Équiper — le registre

Les compétences se cherchent sur **agenticskills.io**, un registre ouvert de
skills au format `SKILL.md` : 189+ skills, 16 catégories, aucun compte requis.

```bash
npx skills add auteur/nom-du-skill
```

Ce qui s'installe est **un skill**, pas un agent — le registre fournit la
compétence, le formateur en fait un agent. La méthode de recherche, de
vérification et d'installation est dans `references/registre.md`.

**La règle des trois.** Un agent porte **exactement trois skills, un par rôle** :

| Rôle | Il répond à |
|---|---|
| **Le domaine** | qu'est-ce qu'il faut savoir ? |
| **La méthode** | comment on procède ? |
| **Le garde-fou** | est-ce que le résultat tient ? |

Trois rôles qui ne peuvent pas se confondre — connaissance, procédé, contrôle —
donc trois skills qui ne se marchent pas dessus **par construction**.

Pourquoi trois et pas un autre nombre : avec un seul, rien ne vérifie le travail.
Avec deux, c'est presque toujours savoir et faire — personne ne contrôle. Trois
ferment la boucle. **À quatre, l'agent choisit entre des sources qui se
recouvrent, et sort la mauvaise.**

Avant d'adopter, le **test de non-collision** : « A fait ___, B fait ___ ». Si les
deux blancs se remplissent avec les mêmes mots, il y a collision — on resserre
l'un, ou on n'en garde qu'un. Le piège le plus fréquent est deux skills de
domaine : ils paraissent complémentaires et disent la même chose autrement.

Et quand un quatrième semble nécessaire, ce n'est pas l'agent qui doit grossir :
**c'est un deuxième poste qui se cache dedans.** On le découpe en deux agents,
chacun avec ses trois.

**Rien ne s'installe sans avoir été lu.** Un `SKILL.md` venu d'ailleurs entre dans
ton contexte et oriente ton travail : on l'ouvre avant de l'adopter.

### 4. Instruire — le dossier

Copier les six modèles de `modeles/` vers `.claude/formation/<prenom>/`, puis les
remplir. Trois sont indispensables dès le premier jour :

- **`CLAUDE.md`** — sa mission en une phrase, son périmètre, et surtout **ce qu'il
  ne fait pas**. Un agent sans hors-périmètre déborde, toujours.
- **`skill.md`** — ses compétences, et **quand ne pas les sortir**.
Puis la fiche `.claude/agents/<prenom>.md` depuis `modeles/agent.modele.md`.
**C'est elle qui porte les interdits durs** — clés, historique git, production,
suppression — et surtout sa ligne `tools:` : n'accorder que ce dont il a besoin.
Un agent qui lit n'a pas besoin d'écrire, et c'est la seule barrière qui tienne
vraiment.

### 5. Éprouver

**Un agent ne se met pas en service sur promesse.** Son `verify.md` porte trois
épreuves au minimum, écrites *avant* de l'essayer :

| Épreuve | Ce qu'elle prouve |
|---|---|
| **La tâche type** | il fait le travail pour lequel il a été recruté |
| **La limite** | face à une demande hors de son périmètre, il refuse au lieu de bricoler |
| **L'aveu** | face à une question dont il n'a pas la réponse, il le dit au lieu d'inventer |

La troisième est la plus importante et la plus souvent sautée. Un agent qui
comble ses trous est plus dangereux qu'un agent médiocre : ses erreurs sont
invisibles.

### 6. Mettre en service

Seulement quand les trois épreuves sont passées, **avec la sortie sous les yeux**.
L'agent entre alors au niveau **apprenti**.

## Les trois niveaux

Un agent ne devient pas « meilleur » par magie : ce qui change, c'est **combien on
vérifie ce qu'il rend**. Le niveau se gagne sur des faits, il se perd sur un fait.

| Niveau | Comment on l'atteint | Comment on le traite |
|---|---|---|
| **Apprenti** | les 3 épreuves passées | on vérifie **tout** ce qu'il rend |
| **Qualifié** | 5 délégations utiles, aucune erreur grave | on vérifie **par sondage**, et toujours le coûteux |
| **De confiance** | 15 délégations utiles, aucune erreur grave, son dossier est à jour | on vérifie **ce qui coûte cher à défaire**, le reste passe |

**Une erreur grave fait redescendre d'un niveau, le jour même.** Grave veut dire :
une affirmation fausse présentée comme vérifiée, un débordement hors périmètre, ou
une donnée touchée qu'il ne devait pas toucher.

Aucun niveau ne dispense de la question la plus utile : *est-ce qu'il a montré la
sortie, ou est-ce qu'il l'a racontée ?*

## Faire progresser un agent

Après chaque délégation notable, trois gestes dans son dossier :

1. **`ETAT.md`** — une ligne : la tâche, utile ou non, et ce qu'on a changé.
2. **`memory.md`** — si quelque chose a raté, **la règle qui l'empêche de revenir**,
   écrite comme l'instruction qui aurait fait gagner le temps perdu.
3. **`CLAUDE.md`** — si le raté venait d'un périmètre flou, le préciser.

**La cause d'un raté est presque toujours dans le dossier, pas dans l'agent.**

Et toutes les cinq délégations — ou immédiatement après une erreur grave — une
**séance de réflexion** dans son `evolution.md` : qu'est-ce que mes trois derniers
ratés ont en commun ? où ai-je deviné au lieu de vérifier ? qu'est-ce qu'on me
réexplique à chaque fois ? Corriger une erreur à la fois traite des symptômes ;
c'est là qu'on voit le motif. **Une séance qui ne change aucun fichier est une
rêverie.**

| Le symptôme | La vraie cause | Où corriger |
|---|---|---|
| Il rend à côté | le format attendu n'était pas dit | `CLAUDE.md` — ce qu'il rend |
| Plausible mais faux | il manquait le contexte du projet | `CLAUDE.md` — ce qu'il ne peut pas savoir |
| Il déborde | aucune limite n'était posée | `CLAUDE.md` — hors périmètre |
| Il touche à ce qu'il ne devait pas | interdiction non écrite, ou outil accordé à tort | la fiche : limites et `tools:` |
| Il sort le mauvais outil | deux de ses skills se recouvrent, ou il en a plus de trois | `skill.md` — le test de non-collision |

**Trois ratés sur le même point** ne sont plus un problème de dossier : ou l'agent
n'est pas le bon, ou la compétence manque — chercher un skill sur le registre, ou
en écrire un.

## Congédier un agent

Un agent qui ne sert plus se retire : il encombre les choix et se déclenche à
tort. On archive son dossier dans `.claude/formation/_archives/<prenom>/` avec une
ligne disant pourquoi, et on retire sa fiche de `.claude/agents/`.

Un agent qu'on n'a pas appelé depuis deux mois est un candidat, pas un coupable :
le signaler, ne pas décider seul.

## Le contrôle

```bash
bash .claude/skills/formateur/scripts/controle-promotion.sh
```

Il constate : agents sans dossier, dossiers sans fiche, épreuves jamais passées,
niveaux revendiqués sans les délégations qui les justifient, agents dormants.
Il ne promeut personne — promouvoir demande de juger des retours, et ça, un script
ne le fait pas.

## Où est quoi

| Fichier | Contenu |
|---|---|
| `modeles/agent.modele.md` | la fiche à poser dans `.claude/agents/` |
| `modeles/CLAUDE.md` · `ETAT.md` · `memory.md` · `evolution.md` · `verify.md` · `skill.md` | le dossier de formation |
| `references/registre.md` | chercher, vérifier et installer depuis agenticskills.io |
| `references/prenoms.md` | la règle de nommage et la réserve de prénoms |
| `scripts/controle-promotion.sh` | l'état de l'école, exécutable |

Ce skill accompagne `cadre-projet` : celui-ci pilote le projet, celui-là forme
ceux qui y travaillent. Le `agents.md` du projet reste la table de qui-fait-quoi ;
les dossiers de formation en sont le détail.
