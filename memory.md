# Mémoire — Padel House

Deux zones. **Les règles** se lisent avant d'agir. **Le journal** se remplit
après. Une entrée qui a coûté du temps et ne produit pas de règle est une leçon
perdue.

Les problèmes encore ouverts sont dans `ETAT.md`, pas ici.

## Les règles

- **Jamais** lancer `payload generate:importmap` : le fichier produit casse
  `next build`. Le script npm a été retiré exprès.
- **Toujours** `npm run lint` **et** `npm run build` avant tout commit. Le projet
  n'a pas de tests : ces deux commandes sont le seul filet.
- **Toujours** `npm run generate:types` après toute modification de `globals/`
  ou `collections/`.
- **Toujours** quatre fichiers pour ajouter un contenu éditable, dans cet ordre :
  `globals/Home.ts` → `lib/types.ts` → `lib/content.ts` (défaut **et** lecture
  avec repli) → le composant. Sauter `lib/content.ts` donne une page vide en
  production le jour où la base ne répond pas.
- **Jamais** de texte visible en dur dans un composant : c'est une régression
  fonctionnelle, pas un détail de style.
- **Jamais** une section qui appelle Payload elle-même : elle reçoit ses props
  depuis `app/(frontend)/page.tsx`. Une seule lecture de base par rendu.
- **Jamais** `next/image` ici : les URL viennent du back-office et peuvent
  pointer sur un hôte non déclaré, ce qui ferait échouer le rendu. Utiliser
  `components/ui/Photo.tsx`.
- **Toujours** vérifier qu'un faux contenu ne se fait pas passer pour du vrai
  (un avis « Google » inventé est exactement ce que l'audit reproche).
- **Jamais** laisser en ligne un back-office dont le premier compte n'a pas été
  créé : Payload sert alors `create-first-user` publiquement, et le site est
  réclamable par le premier venu. Créer le compte **dans la foulée du premier
  déploiement**, pas « quand on aura le temps ».
- **Toujours** relancer `npm audit` avant de citer un nombre de failles : il
  monte tout seul, sans qu'on touche au code.

## Le journal

### 2026-09-14 — Premier passage du registre de sécurité

- **Fait :** `securite.md` posé et passé en entier, avec le contrôle mécanisé
  et les tests manuels.
- **Trouvé :** `/admin` en production sert « créer le premier utilisateur » —
  le back-office du site en ligne est réclamable par n'importe qui. Et
  `npm audit` remonte 12 failles dont 1 critique, alors que le HANDOVER en
  annonçait deux.
- **Cause réelle :** le déploiement et la mise en service ont été traités comme
  deux choses distinctes, et la seconde a été rangée comme une corvée
  administrative. Elle était en réalité la fermeture d'une porte.
- **Coût :** aucun pour l'instant — personne n'a réclamé le back-office. Le coût
  potentiel était la perte du site.
- **Règles qui en sortent :** deux, ajoutées en haut.

### 2026-09-14 — Adoption du cadre de pilotage

- **Fait :** les six fichiers du cadre posés à la racine, `verify.md` rempli
  depuis l'existant, et **passé pour de vrai** — pas recopié.
- **Trouvé :** O2 et O3 sont prouvés ; O1 et O4 ne sont pas prouvables tant que
  le compte administrateur n'existe pas ; O5 n'a aucune preuve reproductible.
- **Cause réelle :** le projet était livré techniquement mais jamais mis en
  service. Rien ne le disait avant que les preuves soient écrites objectif par
  objectif.
- **Règle qui en sort :** un objectif qui ne peut être prouvé qu'en production
  doit être marqué comme tel dès le cadrage — sinon on croit avoir fini alors
  qu'on a seulement fini de coder.
