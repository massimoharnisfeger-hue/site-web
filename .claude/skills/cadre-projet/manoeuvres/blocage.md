# Manœuvre — ON EST BLOQUÉ

Ça casse, ça ne marche pas, ou on tourne en rond depuis une heure.

## 0. La règle des deux tentatives

**Deux tentatives qui échouent, on arrête de tenter.** La troisième tentative au
jugé est presque toujours perdue, et elle ajoute du désordre au problème
initial : on ne sait bientôt plus ce qui vient du bug et ce qui vient des
réparations.

On s'arrête, et on diagnostique.

## 1. Trouver la cause, pas le symptôme

- **Reproduire d'abord.** Un problème qu'on ne sait pas reproduire n'est pas
  diagnostiqué, il est deviné. S'il est intermittent, c'est une information :
  chercher ce qui varie (ordre, temps, données, réseau, cache).
- **Lire le message en entier**, pas la première ligne. La cause est souvent
  dans la dernière.
- **Qu'est-ce qui a changé ?** Le dernier commit, une dépendance montée, une clé
  expirée, une donnée nouvelle. `git diff` répond plus vite que la réflexion.
- **Réduire.** Enlever jusqu'à ce que ça marche, remettre jusqu'à ce que ça casse.
  Le point de bascule est la cause.
- **Vérifier `memory.md`.** On a peut-être déjà payé ce problème. C'est
  exactement pour ce moment que le fichier existe.

**Un test qui échoue n'est jamais « instable » avant preuve du contraire.** C'est
l'explication la plus coûteuse du métier : elle fait ignorer de vrais défauts.
Une seule relance pour confirmer, et si ça échoue encore, c'est réel.

## 2. Présenter des options, pas une impasse

Quand la cause est trouvée, ne pas annoncer seulement le problème. Présenter :

| | À dire |
|---|---|
| **La cause** | en une phrase, en français |
| **Option A** | ce que ça coûte, ce que ça règle, ce que ça laisse |
| **Option B** | idem |
| **Le contournement** | s'il existe : ce qu'il masque, et jusqu'à quand il tient |
| **Ma recommandation** | laquelle, et pourquoi |

**Sur les contournements.** Un contournement est légitime, à deux conditions :
il est **écrit dans la dette technique** d'`ETAT.md` avec une échéance, et on
sait ce qu'il masque. Un contournement non écrit devient l'architecture du
projet, sans que personne ne l'ait décidé.

## 3. Ce qui n'est jamais une solution

- Désactiver, ignorer ou mettre de côté un test qui échoue.
- Relancer en espérant que ça passe.
- Élargir le correctif à tout le fichier « tant qu'on y est » — on ne saura plus
  ce qui a réparé quoi.
- Supprimer ce qu'on ne comprend pas.

## 4. Repartir proprement

Une fois débloqué :

1. **`verify` rapide** — le déblocage a pu casser ailleurs.
2. **`memory.md`** — la cause, et **la règle qui l'empêche de revenir**. C'est le
   moment où un blocage se transforme en progrès. Sauté, il se repaie.
3. **`verify.md`** — ajouter la ligne qui rattraperait ce problème s'il revenait,
   quand c'est possible.
4. **`ETAT.md`** — fermer le blocage, réécrire la prochaine action.
5. **Reprendre exactement où on en était.** Relire la tâche en cours avant de
   replonger : après un blocage d'une heure, on a perdu le fil, et c'est là qu'on
   fait la deuxième erreur.
