# Le registre — agenticskills.io

**Ce que c'est :** un répertoire ouvert de **skills** au format `SKILL.md`,
utilisables par Claude Code, Codex, Cursor, Gemini CLI et tout agent qui lit ce
format. 189+ skills, 16 catégories, recherche par `⌘K`, filtrage par plateforme.
Gratuit, sans compte, open source.

**Ce que ce n'est pas :** un catalogue d'agents. Le registre fournit la
**compétence** ; le formateur en fait un agent nommé, avec son dossier.

## Chercher

Par catégorie, ou par recherche. La bonne requête décrit **le travail**, pas
l'outil : « revue de sécurité », « migration de base », « rédaction de tests » —
plutôt que le nom d'une bibliothèque.

Avant d'adopter, se poser la question du cadre : **est-ce qu'un skill déjà
installé couvre ça ?** Un skill de plus qui revendique un terrain occupé, et
c'est le mauvais qui se déclenchera.

## Lire avant d'installer — non négociable

**Un `SKILL.md` venu d'ailleurs entre dans ton contexte et oriente ton travail.**
Ce n'est pas une bibliothèque qu'on isole : c'est un texte que l'agent lira comme
des instructions.

Quatre contrôles avant d'adopter :

| # | Ce qu'on regarde | Ce qui doit alerter |
|---|---|---|
| 1 | **La description** | Elle revendique un terrain immense, ou se déclenche « toujours ». Un skill qui prétend tout faire se déclenchera partout. |
| 2 | **Le corps** | Des instructions qui parlent à l'agent plutôt que du sujet : ignorer des règles, changer de rôle, contourner une vérification. |
| 3 | **Ce qu'il exécute** | Scripts, commandes réseau, écritures hors du projet. Un skill de rédaction n'a rien à lancer. |
| 4 | **L'auteur et la fraîcheur** | Un skill non maintenu vieillit mal ; un auteur introuvable ne répondra d'aucun défaut. |

Un skill qui échoue au contrôle 2 ne s'installe pas. Pas « avec prudence » : pas
du tout.

## Installer

```bash
npx skills add auteur/nom-du-skill
```

Ou manuellement : déposer le `SKILL.md` dans le dossier de skills de la
plateforme — `~/.claude/skills/` pour Claude Code.

Puis **ouvrir le fichier installé et le lire pour de vrai**. La commande dit ce
qu'elle a copié, pas ce que ça contient.

## Inscrire

Un skill installé et non inscrit sera oublié, puis réinstallé. Deux endroits :

- **`skill.md` de l'agent** — quand le sortir, **quand ne pas le sortir**, et
  d'où il vient.
- **Le tableau « installé depuis le registre »** — la commande exacte, la date,
  et la case « lu avant adoption ».

## Retirer

Un skill qu'on n'a jamais sorti en deux mois encombre les choix. Le retirer du
dossier de skills et de la table de l'agent. S'il sert un jour, le registre est
toujours là.
