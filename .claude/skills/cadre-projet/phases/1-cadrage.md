# Phase 1 — CADRAGE

**On y entre avec** une idée, parfois floue, parfois déjà trop précise.
**On en sort avec** `CLAUDE.md` rempli et `ETAT.md` initialisé.
**Porte de sortie :** les `O` sont écrits et vérifiables, le hors-périmètre est
explicite, au moins une alternative a été examinée, et les inconnues restantes
sont listées avec ce qu'elles bloquent.

Cette phase ne produit pas de code. Elle produit des décisions. C'est la phase
la moins chère à refaire et la plus chère à sauter.

## 1. Comprendre avant de reformuler

Écouter l'idée en entier sans la corriger. Puis chercher ce qui n'a pas été dit.

**Les huit questions.** Poser seulement celles dont la réponse manque —
interroger sur ce qui vient d'être dit fait perdre confiance.

1. **Qui s'en sert ?** Une personne réelle, décrite. Pas « les gens ».
2. **Que fait cette personne aujourd'hui, sans le projet ?** S'il n'y a pas de
   douleur actuelle, il n'y aura pas d'usage.
3. **À quoi voit-on que ça a marché ?** Un fait observable, si possible chiffré.
4. **Pourquoi maintenant ?** Un projet sans raison de date ne se finit pas.
5. **Qu'est-ce qui existe déjà** — chez toi, chez les autres — et pourquoi ça ne
   suffit pas ?
6. **Qu'est-ce qui est imposé** : outils, budget, échéance, contrainte légale,
   marque ?
7. **Qui décide ?** Si la réponse est « on verra », le projet a déjà un blocage.
8. **Qu'est-ce qui rend ce projet inutile s'il arrive ?** C'est le vrai risque.

**Le test du miroir.** Reformuler le projet en cinq lignes maximum, et le faire
valider avant d'aller plus loin. Une reformulation corrigée coûte deux minutes ;
un projet construit sur un malentendu coûte tout.

## 2. Challenger — vraiment

Accepter l'idée telle quelle n'est pas de la loyauté, c'est de la paresse. Cinq
attaques, dans cet ordre.

| Attaque | La question | Ce qu'on cherche |
|---|---|---|
| **Le besoin** | Qu'est-ce qui prouve que quelqu'un veut ça ? | une intuition prise pour une demande |
| **Le plus simple** | Quelle est la version qui règle 80 % avec 20 % du travail ? | la complexité qu'on s'inflige |
| **L'existant** | Qu'est-ce qu'un outil du marché fait déjà, et à quel prix ? | trois mois pour refaire 40 € par mois |
| **Le périmètre** | Laquelle de ces fonctions peut disparaître sans tuer le projet ? | ce qui décore |
| **L'après** | Qui maintient ça dans un an ? | ce qu'on ne saura pas tenir |

**Règle :** avant d'accepter l'approche annoncée, en poser au moins une autre sur
la table, avec ce qu'elle coûte et ce qu'elle fait perdre. Même si la première
gagne — surtout si elle gagne, on saura pourquoi.

**Manière de le dire.** Pas « c'est une mauvaise idée ». Plutôt : *« Ça marche.
Voilà ce que ça coûte, voilà l'autre chemin, et voilà pourquoi je pencherais
pour celui-ci. Tu tranches. »* Le dernier mot revient à celui dont c'est le
projet — après qu'il a vu la note.

## 3. Cadrer

Écrire, dans `CLAUDE.md` :

**L'idée en une phrase.** S'il en faut trois, le projet n'est pas encore clair.

**Les objectifs `O1..On`.** Formulés pour qu'un tiers réponde oui ou non sans
appeler personne. Trois à cinq. Au-delà de cinq, ce ne sont plus des objectifs
mais une liste de courses.

| ✗ | ✓ |
|---|---|
| « Un beau site » | **O1.** Un visiteur trouve les horaires et l'adresse en moins de 10 secondes |
| « Que ce soit rapide » | **O2.** La page d'accueil s'affiche en moins de 2 s sur mobile 4G |
| « Gérer les réservations » | **O3.** Un visiteur envoie une demande sans créer de compte |

**Le hors-périmètre.** Aussi important que les objectifs : c'est lui qui tient le
projet. Nommer ce qu'on ne fera pas *et qu'on aurait pu croire inclus*. « Pas de
paiement en ligne », « pas de compte utilisateur », « pas d'application mobile ».

**Les contraintes** : outils imposés, budget, échéance, ce qui ferait rejeter la
livraison même si tout marche.

**Les livrables** : ce qu'on remet à la fin, nommé. Un site en ligne ? un dépôt ?
un accès admin ? une formation ? un mot de passe transmis comment ?

**Les priorités** : chaque fonction reçoit son niveau de l'échelle
(ESSENTIEL / IMPORTANT / UTILE / OPTIONNEL / PLUS TARD). Seul l'ESSENTIEL entre
dans la V1 ; le reste part dans « Plus tard » d'`ETAT.md`.

## 4. Découper

Les objectifs deviennent des **jalons** — chacun livre quelque chose d'utilisable
seul, sinon ce n'est pas un jalon mais une étape technique.

Pour chaque jalon : quel(s) `O` il sert · ce qu'on peut faire une fois qu'il est
là · ce dont il dépend · comment on saura qu'il est validé.

Trois choses à repérer tout de suite :

- **Le chemin critique** — la chaîne de jalons qui ne peut pas être raccourcie.
  Tout retard dessus est un retard du projet. Le reste peut glisser.
- **Les gains rapides** — petits, sans dépendance, effet visible. Un ou deux au
  début : ils prouvent que le projet avance, ce qui n'est pas cosmétique.
- **Les inconnues** — ce dont on ignore la difficulté. Elles se traitent **tôt**,
  par une maquette jetable si besoin. Une inconnue repoussée devient le blocage
  de la dernière semaine.

## 5. Ce qu'on ne sait pas encore

Lister les inconnues restantes, et **en face, ce qu'elles bloquent**. Une
inconnue qui ne bloque rien n'est pas un problème : elle attend. Une inconnue qui
bloque un jalon du chemin critique est le premier travail de la phase suivante.

## La porte

Ne pas passer en FONDATIONS tant que les cinq tiennent :

- [ ] Chaque `O` se répond par oui ou par non, par quelqu'un d'autre que toi.
- [ ] Le hors-périmètre est écrit, et il n'est pas vide.
- [ ] Au moins une alternative a été examinée, et on sait pourquoi elle perd.
- [ ] Chaque jalon dit quel `O` il sert.
- [ ] Les inconnues sont listées avec ce qu'elles bloquent.

Si l'un des cinq manque, le dire et rester ici. C'est la porte la plus rentable
du cadre : une heure ici en économise dix en CONSTRUCTION.

**Ensuite :** `phases/2-fondations.md`.
