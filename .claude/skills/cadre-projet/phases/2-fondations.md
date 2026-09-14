# Phase 2 — FONDATIONS

**On y entre avec** un cadrage tenu.
**On en sort avec** un projet vide mais qui tourne, se vérifie et se déploie.
**Porte de sortie :** `verify.md` niveau 1 passe de bout en bout sur un projet
qui ne fait encore rien.

Le but n'est pas de construire, c'est de rendre la construction sûre. Une
fondation posée après coup coûte dix fois son prix — et se pose rarement.

## 1. Le squelette

**Le dossier** porte le nom du projet : minuscules, tirets, ni accent ni espace.

**Le `.gitignore` avant tout fichier de configuration.** Dans cet ordre, jamais
l'inverse :

```bash
grep -qx '.env.local' .gitignore || echo '.env.local' >> .gitignore
git check-ignore -v .env.local    # doit répondre
```

Créer le fichier de clés avant la ligne d'exclusion, c'est le `git add .` qui
brûle tout d'un coup. L'ordre **est** la protection.

**Les fichiers du cadre** — copier depuis `modeles/` :
`CLAUDE.md`, `ETAT.md`, `memory.md`, `skill.md`, `agents.md`, `verify.md`,
`securite.md`, et `.env.local` (jamais commité).

`CLAUDE.md` et `ETAT.md` sont déjà remplis : ils sortent de CADRAGE.

## 2. L'arborescence et les conventions

**L'arborescence se décide maintenant**, et s'écrit dans la section « carte » de
`CLAUDE.md` — trois à six lignes, pas un arbre complet qui sera faux dans un
mois. Ce qui compte : *où va quoi*, pas la liste de ce qui existe.

**Les conventions** — nommage des fichiers, des branches, des commits ; où vont
les ressources et les images ; ce qui ne doit jamais être touché à la main. Elles
vont dans `CLAUDE.md`, et **chaque convention violée trois fois devient une règle
de `memory.md`**, pas une remontrance.

**Les décisions** de cette phase (pourquoi cet outil, pourquoi ce découpage)
vont dans le tableau des décisions de `CLAUDE.md`, datées, avec ce qu'on a
écarté. C'est ce tableau qui évite de rejouer le même débat en novembre.

## 3. Les clés

Copier `modeles/cles.env.modele` vers `.env.local`. Pour chaque clé, les trois
lignes qu'on cherche six mois plus tard : à quoi elle sert · le chemin exact
pour la regénérer · où elle est déclarée en production. Plus la date de rotation.

**Le projet doit démarrer sans clé facultative.** Si l'absence d'une clé casse
le démarrage, ce n'est pas une clé facultative : c'est une dépendance, et elle
se déclare comme telle.

## 4. Le filet

Écrire `verify.md` niveau 1 **maintenant**, alors qu'il n'y a rien à vérifier.
C'est le bon moment : les commandes sont simples et on les voit passer au vert.

| # | Commande | Attendu |
|---|---|---|
| 1 | installation des dépendances | termine sans erreur |
| 2 | lint | 0 erreur |
| 3 | build | réussi |
| 4 | tests | passent (même s'il n'y en a qu'un, qui vérifie que le test tourne) |
| 5 | démarrage | l'application répond |

Quand le projet a un lanceur de scripts, câbler le niveau 1 dedans —
`npm run verify` — plutôt que dans un script isolé qui dérivera.

Écrire aussi le niveau 2 : une ligne par `O`, la colonne « comment on le prouve »
vide pour l'instant. **Une ligne vide est une question ouverte ; une ligne
absente est un objectif oublié.**

## 5. Les sauvegardes et les versions

Trois questions à trancher ici, pas le jour de l'incident :

- **Qu'est-ce qui serait perdu** si la machine disparaissait ce soir ? Le code
  est sur le dépôt distant — et la base de données ? les images téléversées ?
  les clés ?
- **Qui sauvegarde**, et à quelle fréquence ? Si la réponse est « l'hébergeur »,
  vérifier que c'est vrai, et jusqu'à quelle ancienneté.
- **Comment on revient en arrière** après un déploiement raté ? Si la réponse
  n'existe pas, le lancement se fera en apnée.

Les réponses vont dans `CLAUDE.md`. Ce sont des décisions, pas de la doc.

## La porte

- [ ] `verify.md` niveau 1 passe **en entier**, la sortie sous les yeux.
- [ ] `git check-ignore -v` confirme que le fichier de clés est hors de git.
- [ ] `git log --all --oneline -- .env .env.local` ne renvoie **rien**.
- [ ] Les fichiers du cadre existent, `CLAUDE.md` et `ETAT.md` sont remplis.
- [ ] La carte du projet et les conventions sont écrites.
- [ ] On sait ce qu'on sauvegarde et comment on revient en arrière.
- [ ] `scripts/controle-securite.sh` passe sur le projet vide — c'est le
      moment le moins cher pour le mettre au vert, et la référence contre
      laquelle on comparera ensuite.

**Ensuite :** `phases/3-construction.md`.
