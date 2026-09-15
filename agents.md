# Agents — Padel House

Les skills disent **comment**. Les agents disent **qui**.

## Le principe qui commande tout le reste

**Un agent travaille dans son propre contexte, vide.** Force : une grosse lecture
n'encombre pas la session principale. Limite : il ne sait rien de ce projet, et
il ne se souviendra de rien la fois d'après.

Donc **un agent n'apprend pas. Son brief apprend.** Tout ce qu'on a dû lui
réexpliquer une deuxième fois appartient au brief.

---

## L'équipe

| Agent | Sa mission ici | Skills | Ce qu'il rend | Brief |
|---|---|---|---|---|
| `code-explorer` | tracer ce qui dépend d'un champ ou d'un composant | — | la liste des fichiers touchés, dans l'ordre | ↓ |
| `code-reviewer` | relire un diff : régression, texte en dur, repli manquant | `security-review` | les défauts classés par gravité | ↓ |
| `build-error-resolver` | remettre `next build` et les types au vert | — | le correctif minimal | ↓ |
| `a11y-architect` | contrastes, clavier, cibles tactiles | `ui-ux-pro-max` | les écarts WCAG et leur correction | — |
| `doc-updater` | tenir `README.md` et `HANDOVER.md` à jour | — | les fichiers mis à jour | — |
| `Plan` | découper une fonctionnalité en incréments ordonnés | `cadre-projet` | les incréments et leurs dépendances | — |
| `gardien-cadre` | vérifier que le pilotage ne ment pas | `cadre-projet` | un verdict PASSE/ÉCHEC | — |

---

## Les briefs

### `code-explorer`

**Ce qu'il ne peut pas savoir :**
> Ajouter un contenu éditable touche **quatre** fichiers, dans cet ordre :
> `globals/Home.ts` → `lib/types.ts` → `lib/content.ts` (défaut **et** lecture
> avec repli) → le composant de `components/sections/`. Une section ne lit
> jamais Payload elle-même : elle reçoit ses props depuis
> `app/(frontend)/page.tsx`. `app/(payload)/` est généré — on ne le lit pas
> pour comprendre l'application.

**Ce que je lui demande :** tracer les dépendances avant modification, sans rien
changer.

**Ce qu'il doit rendre :** la liste des fichiers touchés, dans l'ordre de
modification, avec pour chacun ce qui casse s'il est oublié.

**Pièges déjà rencontrés :**
> - Oublier `lib/content.ts` : la page se vide en production le jour où la base
>   ne répond pas, et rien ne le signale avant.

**Ce qu'il ne doit PAS faire :**
> - Modifier quoi que ce soit. Il lit, il rend une carte.

**Dernière révision :** 2026-09-15 — création.

### `code-reviewer`

**Ce qu'il ne peut pas savoir :**
> Un texte visible écrit en dur dans un composant est une **régression
> fonctionnelle**, pas un détail de style : le gérant doit pouvoir tout modifier
> depuis `/admin` (c'est O1). Tout champ lu depuis la base doit avoir une valeur
> de repli (O2). Le tunnel de réservation ne doit ni stocker, ni confirmer, ni
> appeler le serveur (O3).

**Ce qu'il doit rendre :** les défauts classés par gravité, chacun avec
`fichier:ligne` et le correctif proposé.

**Pièges déjà rencontrés :**
> - Laisser passer un texte en dur au motif qu'il « ne changera jamais ».
> - Valider une lecture de base sans repli.

**Ce qu'il ne doit PAS faire :**
> - Élargir au-delà du diff. Le reste du fichier n'est pas son sujet.

**Dernière révision :** 2026-09-15 — création.

### `build-error-resolver`

**Ce qu'il ne peut pas savoir :**
> **Ne jamais lancer `payload generate:importmap`** : le fichier produit casse
> `next build`, et le script npm a été retiré exprès. Après toute modification
> de `globals/` ou `collections/`, il faut `npm run generate:types`.
> `next/image` est proscrit ici — utiliser `components/ui/Photo.tsx`.

**Ce qu'il doit rendre :** le correctif minimal, et la sortie de `npm run build`
qui le prouve.

**Pièges déjà rencontrés :**
> - Régénérer `importMap.js` pour « réparer » l'administration : ça casse le
>   build au lieu de le réparer.

**Ce qu'il ne doit PAS faire :**
> - Modifier `app/(payload)/` à la main.
> - Désactiver une règle de lint pour faire passer le build.

**Dernière révision :** 2026-09-15 — création.

---

## Les quatre façons de déléguer

| Forme | Quand ici |
|---|---|
| **Solo** | le défaut |
| **Parallèle** | avant un lancement : sécurité, accessibilité et performance en même temps — trois angles qui ne se chevauchent pas |
| **Chaîne** | ajout d'un champ éditable : `code-explorer` → `Plan` → construction → `code-reviewer` |
| **Contradiction** | réservée aux décisions irréversibles. Ici : monter en Next 16, ou changer la façon dont le contenu est stocké |

---

## Se remettre en question : juger un retour

1. **Est-ce vérifiable ?** Pas de `fichier:ligne` ni de sortie de commande → c'est supposé, pas vérifié.
2. **Est-ce trop beau ?** Un retour qui confirme exactement ce qu'on espérait mérite un second regard.
3. **A-t-il dit ce qu'il n'a pas pu faire ?** Un rapport sans limite déclarée est incomplet.
4. **Que casse-t-il s'il se trompe ?** Plus c'est cher, moins on fait confiance.

**« Tout va bien » n'est pas un résultat** — c'est le signal le plus fiable que rien n'a été cherché.

---

## Le journal de délégation

| Date | Agent | Tâche | Utile ? | Ce que j'ai changé dans son brief |
|---|---|---|---|---|
| *(vide — aucune délégation à ce jour. Les briefs ci-dessus sont dérivés des pièges du projet, pas de retours d'agents.)* | | | | |

---

## Comment un agent devient meilleur

1. Déléguer **avec le brief recopié tel quel**.
2. Juger le retour avec les quatre contrôles.
3. Raté ? Chercher la cause **dans le brief** avant de blâmer l'agent — neuf fois sur dix elle y est.
4. Corriger le brief **le jour même**.
5. Trois échecs sur le même point → changer d'agent, ou écrire un skill.

| Le symptôme | La vraie cause | La correction |
|---|---|---|
| Il rend à côté | demande vague, format non dit | préciser « ce qu'il doit rendre » |
| Plausible mais faux | contexte projet manquant | étoffer « ce qu'il ne peut pas savoir » |
| Il déborde | aucune limite posée | ajouter à « ce qu'il ne doit PAS faire » |

---

## Les gardiens de la boucle

| Moment | Rôle | Agent | Il bloque si |
|---|---|---|---|
| COMPRENDRE | explorer sans modifier | `code-explorer` | une dépendance n'est pas tracée |
| CONSTRUIRE | tenir build et types | `build-error-resolver` | build rouge |
| PROUVER | relire le diff | `code-reviewer` | régression, ou texte en dur |
| STABILISER | clavier, contrastes, cas limites | `a11y-architect` | un parcours casse au clavier |
| VALIDER | contrôle de cadre | `gardien-cadre` | un point en échec |

---

## Le contrôle de cadre

```bash
bash .claude/skills/cadre-projet/scripts/controle-cadre.sh
```

**Dernier passage :** 2026-09-15 — 0 échec, 3 alertes.

---

## Les manques

| Fait à la main | Occurrences | Agent à écrire ? |
|---|---|---|
| Vérifier qu'un nouveau champ a bien ses quatre fichiers | 6+ | oui — ou un brief `code-reviewer` spécialisé |
| Vérifier une CSP dans un vrai navigateur | 1 | pas encore |
