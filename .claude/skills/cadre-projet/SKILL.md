---
name: cadre-projet
description: "Système de pilotage de projet de bout en bout dans Claude Code : comprendre et challenger une idée, la cadrer, la découper en jalons et en tâches, construire, prouver, stabiliser, lancer, puis exploiter. Tient un tableau de bord vivant (ETAT.md), une mémoire des erreurs (memory.md), des preuves exécutables (verify.md), un registre de tests de sécurité (securite.md), un plan (CLAUDE.md), l'outillage (skill.md, agents.md) et les clés hors de git. Range et nomme aussi les projets : où poser un dossier (le code hors OneDrive, les documents dans OneDrive), comment le nommer (client-objet, minuscules et tirets), et le rituel qui propose un renommage sans jamais l'imposer. Déclencher dès que l'utilisateur dit : nouveau projet, j'ai une idée, on démarre, on commence, initialise, mets ça en place, reprends le projet, où on en est, quelle est la prochaine étape, c'est quoi la priorité, quel est le plan, la roadmap, le périmètre, le MVP, ajoute cette fonctionnalité, change ça, on est bloqué, ça ne marche pas, note pour ne pas refaire l'erreur, quel skill, quel agent, clé API, secret, .env, délègue ça, quel agent, brief d'agent, sous-agent, range mes projets, mes dossiers sont en désordre, comment nommer ce projet, renomme ce dossier, quel nom donner, où je mets ce projet, OneDrive, Bureau, arborescence, vérifie que ça marche, est-ce bien structuré, est-ce stable, est-ce sécurisé, audit de sécurité, faille, vulnérabilité, npm audit, injection, XSS, en-têtes de sécurité, RGPD, sauvegarde, on peut lancer, c'est fini, on clôture. Déclencher aussi avant d'écrire la première ligne de code d'un projet neuf, avant toute modification importante d'un projet existant, et avant d'annoncer qu'un travail est terminé."
metadata:
  version: 3.0.0
  langue: fr
---

# Cadre projet — le système de pilotage

Ce skill est un routeur. Il tient les **invariants** (vrais à toute heure du
projet) et renvoie vers le **playbook de la phase en cours**. Rien d'autre n'est
chargé : un projet a cinq phases, on n'en vit qu'une à la fois.

## Ce que tu fais en premier, toujours

1. Lire `ETAT.md` à la racine du projet → il donne la **phase** et le **jalon**.
2. Charger `phases/<n>-<phase>.md` de ce skill. Celui-là seulement.
3. Appliquer les invariants ci-dessous, qui ne dépendent d'aucune phase.

**Pas d'`ETAT.md` ?** Alors :
- du code existe déjà → `manoeuvres/reprise.md` ;
- rien n'existe → phase CADRAGE, `phases/1-cadrage.md`.

## Les cinq phases

| # | Phase | Ce qu'on y fait | **Porte de sortie** |
|---|---|---|---|
| 1 | **CADRAGE** | Comprendre, challenger, décider quoi construire et quoi ne pas construire | Les `O` sont écrits, vérifiables, et le hors-périmètre est explicite |
| 2 | **FONDATIONS** | Le squelette : dépôt, arborescence, conventions, les fichiers du cadre, les clés | `verify.md` niveau 1 passe sur un projet vide |
| 3 | **CONSTRUCTION** | Le cycle, répété par jalon | Tous les jalons du périmètre sont **validés** (pas « faits ») |
| 4 | **LANCEMENT** | Mise en ligne et check-list de go/no-go | Le produit tourne en production, surveillé |
| 5 | **EXPLOITATION** | Trier ce qui remonte, décider la suite | Permanent, ou clôture via `manoeuvres/cloture.md` |

**Une porte ne se franchit pas à l'estime.** Tant qu'elle n'est pas passée, on
reste dans la phase — même si le calendrier dit autre chose.

**Revenir en arrière est légal et se déclare.** Si CONSTRUCTION révèle que le
cadrage était faux, on retourne en CADRAGE, on l'écrit dans `ETAT.md` et la
décision va dans `CLAUDE.md`. Ce qui est interdit, c'est d'avancer en faisant
comme si.

### Pourquoi cinq et pas douze

Le découpage courant (idée → discovery → spec → planning → setup → build → test
→ review → stabilisation → lancement → post-lancement → itération) a trois
défauts. **Douze phases, on n'en habite aucune** : une phase qu'on ne décide pas
d'ouvrir n'existe pas. **Tester, relire et stabiliser ne sont pas des phases** :
en faire des étapes de fin de projet, c'est précisément la faute qu'on veut
éviter — elles appartiennent à *chaque* incrément. Et **spécifier et planifier
sont un seul geste** : on ne planifie bien que ce qu'on vient de spécifier.

D'où : cinq phases, et le reste devient le **cycle** qui tourne à l'intérieur de
CONSTRUCTION — décrit dans `phases/3-construction.md`.

## Les manœuvres

Ce qui arrive sans prévenir, quelle que soit la phase. Charger le fichier, faire
ce qu'il dit, revenir à la phase en cours.

| Ça arrive | Charger |
|---|---|
| « ajoute donc… », « finalement je voudrais… » | `manoeuvres/changement.md` |
| ça casse, ça ne marche pas, on tourne en rond | `manoeuvres/blocage.md` |
| un projet existe déjà, ou part dans tous les sens | `manoeuvres/reprise.md` |
| on arrête, on livre, on passe la main | `manoeuvres/cloture.md` |

## Les fichiers du projet, et qui possède quoi

**Un fait, un seul endroit.** Un fait écrit à deux endroits diverge — c'est une
question de semaines. Les autres fichiers **renvoient**, ils ne recopient pas.

| Fichier | Possède | Ne contient jamais |
|---|---|---|
| `CLAUDE.md` | Pourquoi le projet existe, les objectifs `O1..On`, le périmètre, les contraintes, les décisions, la carte du projet | l'avancement, les tâches |
| `ETAT.md` | Où on en est : phase, jalons, en cours, bloqué, prochaine action, risques, dette | le pourquoi, les décisions |
| `verify.md` | Ce qui est **prouvé** : les commandes et leur dernier résultat | des intentions |
| `securite.md` | Le registre des tests de sécurité et leur dernier résultat | des failles sans gravité ni échéance |
| `memory.md` | Ce qu'on a **appris** : les règles, puis le journal | les problèmes encore ouverts (→ `ETAT.md`) |
| `skill.md` | Quels outils, et quand ne pas les sortir | des noms inventés |
| `agents.md` | Qui fait, qui contrôle, à quel moment — et **le brief de chaque agent**, qui est leur seule mémoire | des noms inventés |
| `.env.local` | Les clés et mots de passe | — et **jamais** dans git |

`CLAUDE.md` est chargé automatiquement à chaque session : il tient sur un écran
et importe les autres (`@ETAT.md`, `@memory.md`, `@skill.md`, `@agents.md`, `@verify.md`,
`@securite.md`). Le fichier de clés ne s'importe jamais.

Modèles prêts à copier : `modeles/`. Table de correspondance en bas de fichier.

## La boucle — invariant, à chaque tâche

**Avant** — quel `O` cette tâche sert-elle ? (aucun → ne pas la faire, l'ajouter
au plan d'abord) · les règles en haut de `memory.md` · les outils de `skill.md`,
l'agent d'`agents.md` si on délègue, **dit en une ligne**.

**Pendant** — comprendre avant de modifier. Ce qu'on s'apprête à toucher, qui en
dépend ? Un changement se veut **ciblé, réversible, documenté, prouvable**. On
ne supprime rien dont on n'a pas tracé les dépendances.

**Après** — `verify` **rapide** (niveau 1) · écrire dans `memory.md` · mettre
`ETAT.md` à jour (c'est le geste qu'on oublie, et c'est celui qui fait mentir
tout le reste).

## Le point de situation

Quand on demande « où on en est », « c'est quoi la suite », « qu'est-ce qui
reste » : **lire `ETAT.md` et répondre dans cet ordre**, court, sans broder.

```
Phase · jalon en cours
Fait          <les jalons validés, en une ligne>
En cours      <la tâche, et depuis quand>
Bloqué        <quoi, la cause, chez qui — ou « rien »>
Reste         <les jalons à faire>
Prochaine     <l'action, et pourquoi elle passe devant>
Risques       <ceux qui peuvent frapper cette semaine — ou « rien de neuf »>
```

**Avant de répondre, vérifier la date en tête d'`ETAT.md`.** Si elle a plus
d'une semaine, le fichier ment déjà : le dire d'abord, proposer de le remettre à
jour, et ne pas présenter son contenu comme l'état réel. Une réponse confiante
tirée d'un fichier périmé est pire que pas de réponse — elle fait décider sur du
faux.

Trois choses ne s'inventent jamais dans un point de situation : un avancement
qu'on n'a pas vu, une preuve qu'on n'a pas lancée, une date qu'on ne lit nulle
part. En l'absence d'information, la réponse est « on ne sait pas, et voilà
comment on le saurait ».

## Déléguer

Un agent travaille dans un contexte vide : il ne sait rien du projet et ne se
souviendra de rien. **Donc un agent n'apprend pas — son brief apprend.** Ce qu'on
a dû lui réexpliquer une deuxième fois appartient au brief, et s'écrit le jour
même dans `agents.md`.

Trois réflexes, à chaque délégation :

- **Choisir la forme** — solo, parallèle, en chaîne, ou en contradiction (deux
  agents sur la même question, sans qu'ils le sachent) pour une décision
  irréversible.
- **Recopier le brief tel quel**, pas une version improvisée de mémoire.
- **Juger le retour** : une affirmation sans `fichier:ligne` ni sortie de
  commande n'a pas été vérifiée, elle a été supposée. Et « tout va bien » n'est
  pas un résultat.

Un retour raté se corrige d'abord **dans le brief**, pas en blâmant l'agent :
neuf fois sur dix la cause y est. Détail dans `modeles/agents.md`.

## Les trois preuves, qui ne prouvent pas la même chose

Elles se confondent facilement, et alors on se croit couvert alors qu'on ne
l'est que sur un tiers.

| | Prouve que… | Répond à | Quand |
|---|---|---|---|
| `verify.md` | **le produit fait** ce qu'il promet | « est-ce que ça marche ? » | rapide après chaque tâche, complet à chaque jalon |
| `securite.md` | **le produit ne fait pas** ce qu'il ne doit pas | « qu'est-ce qu'on peut me faire ? » | à chaque incrément touchant entrée, authentification, dépendance ou clé ; complet avant chaque lancement |
| `controle-cadre.sh` | **le pilotage ne ment pas** | « est-ce que ce qu'on lit est vrai ? » | avant tout « fini », et à chaque fin de phase |

Le premier suit le chemin prévu, le deuxième cherche ceux qui ne le sont pas.
Un produit qui passe `verify.md` et échoue `securite.md` marche parfaitement —
pour l'attaquant aussi.

**Deux régimes pour `verify`**, sinon la règle est trop lourde et meurt :
- **rapide** = niveau 1 (lint, build, tests) — après chaque tâche ;
- **complet** = niveaux 1 et 2 (chaque `O` prouvé) — à chaque jalon, avant chaque
  franchissement de porte, avant toute annonce de fin.

## Les douze règles non négociables

1. **Rien ne se code avant que `CLAUDE.md` et `ETAT.md` existent.**
2. **Un projet se nomme et se range avant son premier fichier** — et **un
   projet ne se renomme jamais sans accord** : on propose, on explique ce que
   ça touche, on attend un oui. Voir `conventions/nommage.md`.
3. **Le `.gitignore` avant le fichier de clés** — jamais l'inverse.
4. **Aucune valeur de clé ne sort du fichier de clés**, même cinq minutes.
5. **Une faille Critique ne se lance pas.** Sans discussion, sans « on corrigera
   après ». Les autres gravités s'acceptent, mais par écrit et signées.
6. **On ne note jamais un résultat qu'on n'a pas vu.** Ni « OK », ni « ça devrait
   marcher ».
7. **« Fait » n'existe pas.** Un incrément est **validé** ou il ne l'est pas — au
   sens du cycle de `phases/3-construction.md`.
8. **Une porte ne se franchit pas à l'estime.**
9. **Ce qui n'est pas dans le périmètre ne se code pas** — ça va dans « Plus
   tard » d'`ETAT.md`, avec son niveau de priorité.
10. **Une erreur qui a coûté du temps produit une règle le jour même.**
11. **Un skill ou un agent nommé existe.** Vérifier avant d'écrire la ligne.
12. **`CLAUDE.md` et `ETAT.md` décrivent ce qui est**, pas ce qu'on espérait.

## Être proactif : les sept signaux

Ne pas attendre qu'on demande. Quand l'un de ces signaux apparaît, **le dire
avant de continuer**, en une ou deux phrases, puis proposer la correction.

| Le signal | Ce qu'on dit |
|---|---|
| Une information manque pour bien faire | ce qui manque, et ce que ça change selon la réponse |
| Une décision porte un risque | le risque, sa probabilité, ce qui l'éteint |
| Il existe une meilleure approche | l'alternative et ce qu'elle coûte, sans imposer |
| Une tâche est trop vague pour être commencée | sa version concrète, avec un critère de fin |
| Une étape n'est pas validée | qu'on ne peut pas encore dire « fini », et ce qui manque |
| Le code, le plan et la doc divergent | lequel des trois ment, et la correction proposée |
| Une demande sort du périmètre | qu'elle est intéressante mais pas prioritaire, et où on la range |

Le septième est le plus utile, et le plus impopulaire. Le dire quand même.

## L'échelle de priorité

Un seul vocabulaire, partout — `ETAT.md`, arbitrages, roadmap V2.

| Niveau | Définition opérationnelle |
|---|---|
| **ESSENTIEL** | Sans lui, le projet ne remplit aucun `O`. C'est le MVP, rien d'autre. |
| **IMPORTANT** | Le projet marche sans, mais mal. Première vague après le lancement. |
| **UTILE** | Gain réel, mesurable, mais personne ne bloque dessus. |
| **OPTIONNEL** | Ça fait plaisir. Se fait s'il reste du temps, ce qui n'arrive jamais. |
| **PLUS TARD** | Bonne idée, mauvais moment. Datée et rangée, pas jetée. |

Règle du MVP : **seul l'ESSENTIEL entre dans le périmètre de la V1.** Tout le
reste va dans « Plus tard » d'`ETAT.md` — rangé, pas perdu.

## Profils de projet

Les phases ne changent pas ; les portes s'ajustent.

| Profil | Ce qui s'allège | Ce qui ne s'allège jamais |
|---|---|---|
| **Site vitrine / landing** | pas de tests unitaires ; le niveau 2 de `verify` est un parcours manuel écrit | le `O` sur le contenu réel, l'accessibilité, le référencement |
| **Application / SaaS** | — | tests, migrations de données, sécurité, sauvegardes |
| **Script / outil interne** | pas de lancement, pas d'exploitation | `verify` niveau 1, et le README qui dit comment le lancer |
| **Contenu / marketing** | pas de build | les `O` chiffrés, et la source de chaque donnée avancée |

Dans le doute, garder la porte. On l'allège quand elle a prouvé qu'elle gênait.

## Où est quoi

| Dossier | Contenu | Chargé |
|---|---|---|
| `phases/` | un playbook par phase | la phase en cours, une seule |
| `manoeuvres/` | changement · blocage · reprise · clôture | à l'événement |
| `conventions/nommage.md` | comment un projet se nomme et où il vit | à la création, à la reprise |
| `modeles/` | les fichiers du projet prêts à copier | au démarrage |
| `scripts/controle-cadre.sh` | le contrôle de cadre, exécutable | avant chaque porte |
| `scripts/controle-securite.sh` | la part mécanisable de `securite.md` | à l'incrément sensible, et avant le lancement |
| `scripts/ranger-projets.sh` | constate noms et emplacements d'un dossier de projets | à la demande, ou en croisant du désordre |

| Modèle | Destination | Commité ? |
|---|---|---|
| `modeles/CLAUDE.modele.md` | `<projet>/CLAUDE.md` | oui |
| `modeles/ETAT.md` | `<projet>/ETAT.md` | oui |
| `modeles/memory.md` | `<projet>/memory.md` | oui |
| `modeles/skill.md` | `<projet>/skill.md` | oui |
| `modeles/agents.md` | `<projet>/agents.md` | oui |
| `modeles/verify.md` | `<projet>/verify.md` | oui |
| `modeles/securite.md` | `<projet>/securite.md` | oui |
| `modeles/cles.env.modele` | `<projet>/.env.local` | **jamais** |

Les deux extensions bizarres sont voulues : un fichier nommé `CLAUDE.md` posé
n'importe où est chargé comme mémoire de projet (un gabarit vide chargé à chaque
session est du bruit), et le modèle de clés ne doit jamais ressembler à un vrai
fichier de clés. **Renommer à la copie, jamais avant.**
