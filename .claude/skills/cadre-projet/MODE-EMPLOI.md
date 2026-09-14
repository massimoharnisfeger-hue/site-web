# Mode d'emploi — pour toi, pas pour Claude

`SKILL.md` est écrit pour Claude. Ce fichier-ci est écrit pour toi. Cinq
minutes de lecture, une seule fois.

---

## Ce que c'est

Un système qui oblige Claude à piloter un projet au lieu de seulement coder :
comprendre avant de construire, prouver avant de dire « fini », écrire ce qu'il
a appris, et te dire non quand tu sors du périmètre.

Le pari du système tient en une phrase : **un projet ne se perd pas parce qu'on
code mal, il se perd parce que personne ne sait plus où il en est.**

---

## L'installer

Une fois, sur ta machine, depuis le dépôt `site-web` :

```bash
bash .claude/skills/cadre-projet/install.sh
```

Il s'applique alors à **tous** tes projets. Sans ça, il ne vaut que pour ce
dépôt.

Relance la même commande après un `git pull` pour récupérer les évolutions du
cadre : le script réécrit la version installée, sans rien casser.

---

## Le déclencher

**Tu n'as rien à taper de particulier.** Claude le charge tout seul quand tu dis
des choses comme :

| Tu dis | Il fait |
|---|---|
| « j'ai une idée de… », « on démarre un projet » | Il te cadre : questions, challenge, objectifs, périmètre |
| « reprends ce projet », « où on en est ? » | Il lit `ETAT.md` et te fait le point |
| « ajoute donc… », « finalement je voudrais… » | Il analyse l'impact avant de coder |
| « ça marche pas », « on est bloqué » | Il diagnostique au lieu de tâtonner |
| « c'est fini ? », « on peut lancer ? » | Il vérifie pour de vrai avant de répondre |
| « c'est sécurisé ? » | Il passe le registre de sécurité |

Si tu veux le forcer : `/cadre-projet`.

---

## Ce qu'il va te demander — et pourquoi il n'en démord pas

**Au démarrage, il pose des questions avant de coder.** C'est voulu. Une heure
de cadrage en économise dix ensuite, et c'est la seule étape qu'il ne peut pas
faire sans toi : inventer un objectif à ta place, c'est construire vite le
mauvais projet.

**Il va discuter tes décisions.** Il proposera au moins une autre approche avant
d'accepter la tienne. Ce n'est pas de l'entêtement : si ton idée gagne, tu sauras
pourquoi. Le dernier mot te revient toujours — après que tu as vu la note.

**Il va te dire non.** Quand une idée sort du périmètre, il la range dans
« Plus tard » au lieu de la coder. Et si la date est fixe, il posera la question
la plus utile du système : **« oui, et on sort quoi ? »**

**Il ne dira pas « fini » sans preuve.** Pas de « ça devrait marcher ». Il lance
les commandes et te montre la sortie, ou il dit qu'il ne sait pas.

---

## Les sept fichiers de ton projet

Ils se posent à la racine et ils s'écrivent tout seuls, au fil du travail.

| Fichier | Ce que tu y trouves |
|---|---|
| `CLAUDE.md` | Pourquoi le projet existe, les objectifs, ce qu'on ne fait pas, les décisions |
| `ETAT.md` | **Le tableau de bord.** Où on en est, ce qui bloque, la prochaine action |
| `verify.md` | Ce qui est prouvé, et la commande qui le prouve |
| `securite.md` | Les tests de sécurité et leur dernier résultat |
| `memory.md` | Les erreurs déjà payées, pour ne pas les repayer |
| `skill.md` · `agents.md` | Quels outils, qui fait quoi |
| `.env.local` | Tes clés — **jamais commité** |

**Celui à ouvrir quand tu ne sais plus où tu en es : `ETAT.md`.** Il est fait
pour se lire en dix secondes.

---

## Les deux commandes à connaître

```bash
# Est-ce que ce qu'on lit sur le projet est vrai ?
bash .claude/skills/cadre-projet/scripts/controle-cadre.sh

# Qu'est-ce qu'on peut me faire ?
bash .claude/skills/cadre-projet/scripts/controle-securite.sh https://mon-site.fr
```

Ils échouent pour de vrai — code de sortie 1 — donc ils peuvent bloquer une
livraison. C'est leur raison d'être.

---

## Les cinq phases

```
CADRAGE → FONDATIONS → CONSTRUCTION → LANCEMENT → EXPLOITATION
```

Chacune a une **porte** : on ne passe pas à la suivante avant qu'elle soit
franchie. Revenir en arrière est permis, à condition de le dire.

Dans CONSTRUCTION tourne le cycle, pour chaque bout de travail :
**comprendre → construire → prouver → stabiliser → valider.** « Fait » n'existe
pas ; une chose est validée ou elle ne l'est pas.

---

## Ce qu'il ne fait pas

- **Il ne t'empêche pas mécaniquement de tricher.** Tu as choisi la discipline
  plutôt qu'un verrou. Le jour où tu vois que les vérifications se sautent, le
  skill `delivery-gate` de ton dépôt en fait un blocage automatique.
- **Il ne remplace pas ton jugement** sur le fond du projet. Il te force à
  écrire tes décisions, pas à en prendre de bonnes.
- **Il ne connaît pas ton métier.** Les objectifs viennent de toi.

---

## Le modifier

Tout est en français et en markdown, modifiable directement :

| Tu veux changer… | Ouvre |
|---|---|
| une règle générale | `SKILL.md` |
| ce qui se passe à une phase | `phases/<numéro>-<nom>.md` |
| la réaction à un changement ou un blocage | `manoeuvres/` |
| la forme d'un fichier de projet | `modeles/` |
| un contrôle automatique | `scripts/` |

Le principe à ne pas casser : **`SKILL.md` reste court.** Il est chargé à chaque
fois ; tout le reste se charge à la demande. C'est ce qui empêche le système
d'étouffer le travail qu'il est censé servir.

---

## Si tu ne devais retenir que trois choses

1. **Ouvre `ETAT.md`** quand tu ne sais plus où tu en es.
2. **« Fini » veut dire prouvé**, sinon ça ne veut rien dire.
3. **Une erreur qui t'a coûté du temps va dans `memory.md` le jour même** —
   c'est ce qui fait qu'un projet te rend plus rapide au lieu de te répéter.
