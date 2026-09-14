# Phase 4 — LANCEMENT

**On y entre avec** tous les jalons validés.
**On en sort avec** le produit en production, surveillé, et un chemin de retour
en arrière testé.
**Porte de sortie :** ça tourne en production, quelqu'un regarde, et on sait
revenir en arrière.

Un lancement n'est pas un déploiement. Le déploiement dure trois minutes ; le
lancement, c'est tout ce qui fait qu'on n'a pas à le regretter.

## La check-list

Onze domaines. Chaque ligne est **bloquante** ou **non bloquante** — sans cette
colonne, une check-list ne se termine jamais et on finit par la contourner en
entier.

| Domaine | Ce qu'on vérifie | Bloquant ? |
|---|---|---|
| **Fonctionnalités** | Chaque `O` fonctionne **en production**, pas seulement en local | oui |
| **Tests** | `verify` complet passe sur la version déployée | oui |
| **Sécurité** | Aucune clé dans le code ni dans l'historique · le back-office est protégé · les entrées utilisateur sont validées · HTTPS partout | oui |
| **Données** | Sauvegarde faite **avant** le lancement · restauration **testée**, pas supposée | oui |
| **Configuration** | Toutes les variables d'environnement sont déclarées en production · le projet démarre sans les facultatives | oui |
| **Déploiement** | Le déploiement est reproductible · **le retour arrière a été essayé une fois** | oui |
| **Surveillance** | On est prévenu si ça tombe · on sait où lire les erreurs | oui |
| **Performances** | Temps d'affichage mesuré sur mobile, pas sur ta fibre · poids des images | non — sauf si un `O` en parle |
| **UX** | Parcours principal sur un vrai téléphone · messages d'erreur compréhensibles · accessibilité au clavier | non — sauf si un `O` en parle |
| **Documentation** | Quelqu'un d'autre sait démarrer, déployer et modifier le contenu | non, mais à faire dans la semaine |
| **Juridique** | Mentions légales, confidentialité, cookies — selon le pays et l'activité | oui si le produit est public |

**Bloquant** veut dire : on ne lance pas. Pas « on lance en croisant les doigts ».

## Les trois vérifications qu'on oublie toujours

1. **La restauration, pas la sauvegarde.** Une sauvegarde jamais restaurée n'est
   pas une sauvegarde, c'est une croyance. La restaurer une fois, sur une copie.
2. **Le retour en arrière.** Le déclencher une fois avant d'en avoir besoin. Le
   jour de l'incident, on ne lit pas la documentation.
3. **Le premier utilisateur réel.** Faire faire le parcours principal par
   quelqu'un qui n'a pas construit le projet, sans l'aider, en regardant où il
   hésite. Dix minutes, et elles changent toujours quelque chose.

## La décision de lancer

Écrire noir sur blanc, dans `ETAT.md` :

- ce qui est **vert** ;
- ce qui est **connu et accepté** — les défauts avec lesquels on part, assumés,
  datés, rangés en dette technique ;
- ce qui **manque encore**, et pourquoi on part quand même.

Un lancement avec des défauts connus et écrits est un lancement professionnel.
Un lancement avec des défauts inconnus est un pari.

**Et si une ligne bloquante ne passe pas :** on ne lance pas. On le dit
clairement, avec ce qui manque et le temps qu'il faut. Ce n'est pas une mauvaise
nouvelle, c'est le travail.

## Le jour même

- Lancer **quand quelqu'un peut regarder** — pas un vendredi à 18 h.
- Vérifier les `O` sur la production, un par un, dans l'ordre.
- Surveiller les erreurs pendant la première heure.
- Noter l'heure du lancement dans `ETAT.md` : tout ce qui remonte ensuite se
  date par rapport à elle.

**Ensuite :** `phases/5-exploitation.md`.
