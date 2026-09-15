# Nommage et rangement des projets

Un projet mal nommé se perd. Un projet mal rangé casse. Les deux règles
ci-dessous sont mécaniques : elles ne demandent aucun jugement au moment où on
est pressé.

## Où vit un projet

Une seule question à se poser : **est-ce que ça contient du code qui se
construit ?**

| Réponse | Emplacement | Pourquoi |
|---|---|---|
| **Oui** — dépôt git, `package.json`, build | `C:\Users\massi\Projects\` | Hors OneDrive. `node_modules` fait des dizaines de milliers de fichiers que la synchro n'encaisse pas, ses verrous font échouer les builds en plein milieu, et un `.env` synchronisé est un secret publié. La sauvegarde, c'est git. |
| **Non** — documents, livrables client, marketing | `C:\Users\massi\OneDrive\Bureau\` | Rien ne se construit, donc rien ne casse. Et la sauvegarde automatique est ici un vrai gain : ces fichiers ne sont sauvegardés par rien d'autre. |

Un raccourci **« Projets »** sur le Bureau pointe vers `C:\Users\massi\Projects\` :
les deux familles se voient depuis le même endroit, sans que le code soit
synchronisé.

**Cas limite :** un projet mixte (des documents *et* du code) va dans `Projects\`,
et ses livrables finis sont copiés dans OneDrive quand ils sont prêts. Jamais
l'inverse — un dossier de travail dans OneDrive finit toujours par contenir du
code.

**Quel que soit l'emplacement, le fichier de clés n'est jamais dans OneDrive.**
Voir `modeles/cles.env.modele`.

## Comment un projet se nomme

```
<client-ou-domaine>-<objet>
```

Minuscules, tirets, **ni accent ni espace**. Deux à quatre mots.

**Le client ou le domaine vient en premier**, et c'est tout l'intérêt : le
classement alphabétique regroupe tout seul ce qui appartient au même client.

| ✗ | ✓ | Pourquoi |
|---|---|---|
| `site-web` | `padel-house-site` | « site-web » ne dit rien : dans six mois, lequel ? |
| `relance-devis-grosjean` | `grosjean-relance-devis` | Le client devant : tous les Grosjean se suivent |
| `Nouveau dossier (2)` | — | À nommer avant d'y déposer quoi que ce soit |
| `projet-final-v2-OK` | `passclub-boutique` | La version est dans git, pas dans le nom |
| `Relance Devis Client` | `grosjean-relance-devis` | Espaces et majuscules cassent les commandes |

**Interdits, sans exception :** accents · espaces · majuscules · dates dans le
nom · `v2`, `final`, `ok`, `new`, `test`, `copie` · noms génériques (`projet`,
`site`, `dossier`, `travail`).

## Le rituel de renommage

**Un projet ne se renomme jamais sans accord.** Renommer déplace des chemins,
casse des raccourcis, perd des références d'éditeur. C'est réversible, mais
c'est agaçant, et ça doit être choisi.

Quand un projet mal nommé est rencontré — au démarrage, à la reprise, ou en
passant :

1. **Le signaler, une fois**, sans insister : *« Ce dossier s'appelle
   `site-web`. Ça ne dira plus rien dans six mois. »*
2. **Proposer un nom**, avec la raison :
   ```
   site-web  →  padel-house-site
   Le client devant, l'objet derrière. Il se rangera à côté des autres
   projets Padel House.
   ```
3. **Dire ce que ça touche** : le chemin change, donc les raccourcis et les
   sessions d'éditeur ouvertes sur l'ancien chemin. Le dépôt git n'est pas
   affecté — un dossier renommé garde son historique et son dépôt distant.
4. **Attendre un oui.** Pas de renommage silencieux, jamais.
5. Si c'est non : **ne plus le reproposer** pour ce projet. Une proposition
   refusée qui revient à chaque session est une nuisance, pas un service.

## Quand ça se déclenche

| Moment | Ce qu'on fait |
|---|---|
| **Création d'un projet** | Le nom se décide **avant** le premier fichier, avec la règle ci-dessus. C'est l'étape 1 de `phases/1-cadrage.md`. |
| **Reprise d'un projet** | Vérifier le nom et l'emplacement, proposer si besoin — avant de toucher au contenu. |
| **En passant** | Si un dossier mal nommé ou mal placé est croisé pendant autre chose : le signaler en une ligne, **sans interrompre la tâche en cours**. |

## Le contrôle

```bash
bash .claude/skills/cadre-projet/scripts/ranger-projets.sh [dossier]
```

Le script **constate** : noms invalides, projets de code rangés dans OneDrive,
fichiers de clés synchronisés. Il ne propose aucun nom — nommer demande de
savoir ce que fait le projet, et ça, un script ne le sait pas. Les noms se
proposent à la lecture, par le rituel ci-dessus.
