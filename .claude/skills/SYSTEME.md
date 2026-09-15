# Cadre & Formateur

Deux skills. Le premier pilote un projet de l'idée floue jusqu'à l'exploitation,
en refusant de dire « fini » sans preuve. Le second recrute, nomme, forme et
éprouve les agents qui y travaillent.

`2 skills` · `36 fichiers` · `6 scripts exécutables` · `3 492 lignes` · `16 commits`
Branche `claude/create-skill-5aksaf`

---

## Le schéma

Une porte ne se franchit pas à l'estime : tant qu'elle n'est pas passée, on reste
dans la phase — même si le calendrier dit autre chose. Revenir en arrière est
permis, à condition d'être déclaré.

```
/cadre-projet
─────────────

    CADRAGE ──▶ FONDATIONS ──▶ CONSTRUCTION ──▶ LANCEMENT ──▶ EXPLOITATION
       ▲  porte         porte       │    porte         porte
       │                            │
       └──── retour déclaré ────────┤
                                    ▼
   ┌─────────────────────────────────────────────────────────────┐
   │  LE CYCLE — un incrément à la fois                          │
   │                                                             │
   │  COMPRENDRE ▸ CONSTRUIRE ▸ PROUVER ▸ STABILISER ▸ VALIDER    │
   └─────────────────────────────────────────────────────────────┘

   hors phase, chargées à l'événement :
     changement  ·  blocage  ·  reprise  ·  clôture


/formateur
──────────

    recruter ▸ nommer ▸ équiper ▸ instruire ▸ éprouver ▸ mise en service
                                              ▲            ▲
                                     3 épreuves      niveau apprenti
```

---

## Les deux skills

### `/cadre-projet`

Pilote le projet. `SKILL.md` ne porte que les invariants et charge la phase en
cours — **une seule à la fois**, pour que le contexte ne grossisse pas avec le
projet.

- 5 playbooks de phase, 4 manœuvres
- 8 modèles de fichiers
- 12 règles non négociables
- 4 scripts exécutables
- conventions de nommage et de rangement

### `/formateur`

Forme ceux à qui on délègue. Chaque agent reçoit un prénom, sa fonction entre
parenthèses, et un dossier qui accumule son expérience.

- 6 étapes, de recruter à mettre en service
- 6 fichiers par agent, 1 fiche
- 3 épreuves, 3 niveaux de confiance
- 3 sources de capacité : registre, skill écrit, MCP
- 18 prénoms en réserve

> Un agent travaille dans un contexte vide et ne se souvient de rien. Il n'apprend
> donc jamais tout seul : **c'est son dossier qui apprend**. Tout ce qu'on a dû lui
> réexpliquer une deuxième fois y appartient.

---

## Les fichiers — un fait, un seul endroit

Un fait écrit à deux endroits diverge, c'est une question de semaines. Chaque
fichier possède quelque chose ; les autres renvoient, ils ne recopient pas.

### Un projet — 7 fichiers

| Fichier | Ce qu'il possède |
|---|---|
| `CLAUDE.md` | le pourquoi, les objectifs, le périmètre, les décisions |
| `ETAT.md` | où on en est, ce qui bloque, la prochaine action |
| `verify.md` | ce qui est prouvé, et la commande qui le prouve |
| `securite.md` | 10 domaines de tests, leur gravité, leur résultat |
| `memory.md` | les erreurs déjà payées, et les règles qui en sortent |
| `skill.md` | quels outils, et quand ne pas les sortir |
| `agents.md` | qui fait quoi, et le brief de chacun |

### Un agent — 6 fichiers

| Fichier | Ce qu'il possède |
|---|---|
| `CLAUDE.md` | sa mission, son périmètre, ce qu'il ne fait pas |
| `ETAT.md` | son niveau, ses délégations |
| `memory.md` | ses erreurs — il **constate** |
| `evolution.md` | ce qu'elles ont en commun — il **réfléchit** |
| `verify.md` | les épreuves qu'il a passées |
| `skill.md` | ses trois compétences, une par rôle |

---

## D'où vient la capacité — trois sources

Quand il manque quelque chose à un agent, trois chemins, et le bon dépend de ce
qui manque vraiment.

| Source | Quand | Ce que ça apporte |
|---|---|---|
| **Le registre** — agenticskills.io | la compétence existe déjà chez quelqu'un | un savoir-faire, prêt |
| **Un skill écrit** | le registre n'a rien, ou c'est propre au projet | un savoir-faire, sur mesure |
| **Une connexion MCP** | il manque un accès, pas du savoir-faire | une porte vers un service ou des données réelles |

```bash
npx skills add auteur/nom-du-skill
npx skills add Leonxlnx/taste-skill@design-taste-frontend
```

Le suffixe `@` désigne un skill précis dans un dépôt qui en contient plusieurs.
**Sans lui, c'est le skill par défaut qui s'installe** — pas forcément celui qu'on
visait. Toujours vérifier ce qui a été posé dans `~/.claude/skills/`.

Le registre porte aussi une section **MCP Servers**, un skill **MCP Builder** pour
en écrire un, et accepte les contributions — **Submit a Skill**, **Submit MCP**.

> **Un skill apporte un savoir-faire, un MCP apporte un accès.** Un agent qui sait
> parfaitement lire un tableau de bord publicitaire mais n'a aucun accès au compte
> ne rendra rien. Conséquence directe : **un MCP ne compte pas dans la règle des
> trois** — il se déclare à part, avec ce qu'il permet d'atteindre et s'il écrit.

---

## La règle des trois

Deux skills qui revendiquent le même terrain, et c'est le mauvais qui se
déclenche. La parade tient dans le découpage : trois rôles qui ne peuvent pas se
confondre.

| Rôle | Il répond à | Ce qu'il apporte |
|---|---|---|
| **Le domaine** | Qu'est-ce qu'il faut savoir ? | palettes, règles WCAG, patterns d'un framework, normes d'un métier |
| **La méthode** | Comment on procède ? | les étapes, l'ordre, ce qu'on fait avant quoi |
| **Le garde-fou** | Est-ce que le résultat tient ? | la vérification, la relecture, l'audit du travail rendu |

Connaissance, procédé, contrôle : ils ne se marchent pas dessus **par
construction**.

**Pourquoi trois.** Avec un seul skill, rien ne vérifie le travail. Avec deux,
c'est presque toujours savoir et faire — personne ne contrôle. Trois ferment la
boucle. À quatre, l'agent choisit entre des sources qui se recouvrent, et sort la
mauvaise.

**Le test de non-collision**, avant d'adopter :

> « A fait ______, B fait ______. »

Si les deux blancs se remplissent avec les mêmes mots, il y a collision. Le piège
le plus fréquent est **deux skills de domaine** : ils paraissent complémentaires
et disent la même chose autrement.

Et quand un quatrième semble nécessaire, ce n'est pas l'agent qui doit grossir :
**c'est un deuxième poste qui se cache dedans.** On le découpe en deux agents,
chacun avec ses trois.

---

## Les trois preuves

Elles se confondent facilement, et alors on se croit couvert alors qu'on ne l'est
que sur un tiers.

| Ce qui prouve | Répond à | Quand |
|---|---|---|
| `verify.md` | Est-ce que ça marche ? | rapide après chaque tâche, complet à chaque jalon |
| `securite.md` | Qu'est-ce qu'on peut me faire ? | à l'incrément sensible, complet avant tout lancement |
| `controle-cadre.sh` | Est-ce que ce qu'on lit est vrai ? | avant tout « fini », à chaque fin de phase |

> Le premier suit le chemin prévu, le deuxième cherche ceux qui ne le sont pas. Un
> produit qui passe `verify.md` et échoue `securite.md` marche parfaitement — pour
> l'attaquant aussi.

---

## Les trois niveaux d'un agent

Un agent ne devient pas « meilleur » par magie : ce qui change, c'est **combien on
vérifie ce qu'il rend**.

| Niveau | Comment on l'atteint | Comment on le traite |
|---|---|---|
| **Apprenti** | les 3 épreuves passées | on vérifie **tout** ce qu'il rend |
| **Qualifié** | 5 délégations utiles, aucune erreur grave | vérification par sondage, et toujours le coûteux |
| **De confiance** | 15 délégations utiles, aucune erreur grave | on vérifie ce qui coûte cher à défaire |

Une erreur grave fait redescendre d'un niveau, **le jour même**.

Les trois épreuves d'entrée : **la tâche type** (fait-il le travail ?), **la
limite** (refuse-t-il hors périmètre ?), **l'aveu** (dit-il qu'il ne sait pas ?).
La troisième est la plus souvent sautée — un agent qui comble ses trous est plus
dangereux qu'un agent médiocre, ses erreurs sont invisibles.

---

## Depuis le début — les seize étapes

Le système n'a pas été conçu d'un bloc : chaque version a été éprouvée sur un vrai
dépôt, et c'est l'usage qui a dicté la suivante.

| # | | |
|---|---|---|
| 01 | **Quatre fichiers et une boucle** | Le plan, la mémoire, les outils, les preuves. |
| 02 | **Les clés et les agents** | Le `.gitignore` s'écrit avant le fichier de clés — l'ordre est la protection. |
| 03 | **Un système de pilotage** | Douze phases ramenées à cinq. Tester et stabiliser ne sont pas des phases. |
| 04 | **Le registre de sécurité** | 10 domaines. `verify` prouve que le produit fait ; `securite` qu'il ne fait pas. |
| 05 | **Cinq en-têtes posés** | CSP, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`. |
| 06 | **Un mode d'emploi pour l'humain** | `SKILL.md` est écrit pour Claude. Rien ne l'était pour toi. |
| 07 | **Une commande d'installation** | Deux `cp` à recopier, c'est deux occasions de se tromper. |
| 08–10 | **Le tri des skills** | Trois skills se disputaient le design. Un duplicata retiré, un faux duplicata gardé. |
| 11–12 | **Nommage et rangement** | Le code hors OneDrive, les documents dedans. Jamais de renommage sans accord. |
| 13 | **Les briefs** | `agents.md` cesse d'être un annuaire pour devenir la mémoire des agents. |
| 14 | **L'école** | Le formateur : recruter, nommer, équiper, instruire, éprouver, mettre en service. |
| 15 | **La règle des trois** | Trois skills par agent, un par rôle. Ils ne se recouvrent pas par construction. |
| 16 | **Trois sources de capacité** | Le registre, un skill écrit, une connexion MCP. |

---

## Ce que le système a trouvé en tournant

Appliqué pour de vrai au dépôt `site-web` — un projet livré, déployé, et que trois
documents décrivaient comme terminé.

| Gravité | Ce qui a été trouvé |
|---|---|
| **Critique** | **Le back-office en production est réclamable par n'importe qui.** Vérifié : `HTTP 200`, la page sert `create-first-user`. Rangé jusque-là comme une formalité de quarante secondes. |
| **Critique** | **12 failles de dépendances, dont 1 critique.** Le document de reprise en annonçait deux. `npm audit` monte tout seul, sans qu'on touche au code. |
| Élevée | **Cinq en-têtes de sécurité absents**, dont `X-Frame-Options`, qui laissait encadrer `/admin` par un site tiers. |
| Moyenne | **2 objectifs prouvés sur 5.** Le projet était livré techniquement mais jamais mis en service. |
| Moyenne | **Quatre bugs dans mes propres scripts**, trouvés en les exécutant : deux faux positifs de détection de secrets, une clé ratée, un test numérique cassé. |
| Moyenne | **Une CSP naïve aurait tué le référencement local.** Deux blocs JSON-LD en ligne portent la fiche d'établissement ; `script-src` sans `'unsafe-inline'` les bloquait en silence. |
| Moyenne | **Un skill qui ne se déclenchait pas.** La convention de nommage était écrite, mais aucun de ses mots n'était dans la description. |

---

## Ce qui reste faible

**Aucun projet n'a traversé les cinq phases.** `site-web` est entré en phase 4
déjà construit — CADRAGE et FONDATIONS n'ont jamais été éprouvés sur un projet
neuf.

**Rien n'est mécaniquement bloquant.** C'était le choix retenu : la discipline
plutôt qu'un verrou. Le jour où les vérifications se sautent, `delivery-gate` en
fait un hook.

**Le formateur n'a jamais formé personne.** Ses scripts sont testés, sa méthode ne
l'est pas — aucun agent n'est encore passé par ses trois épreuves.

**Et la seule chose qui ne se règle pas au clavier :** `/admin` en production est
toujours réclamable. Quarante secondes, et personne d'autre ne peut le faire.

---

## Installer

```bash
bash .claude/skills/cadre-projet/install.sh
```

Ou extraire l'archive dans `C:\Users\massi\.claude`. Puis relancer Claude Code —
`/cadre-projet` et `/formateur` apparaissent dans tous les projets.

Mode d'emploi complet : `skills/cadre-projet/MODE-EMPLOI.md`
