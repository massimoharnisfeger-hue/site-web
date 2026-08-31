# Padel House — point de reprise

Dernière mise à jour : 31 août 2026 · commit de référence : **`9d9d05c`** sur `main`

Ce document existe pour une raison : que tu puisses revenir sur ce projet dans
six mois, ou le confier à quelqu'un, sans rien reconstituer de mémoire.

---

## Où est le site

| | |
|---|---|
| Site public | https://site-web-seven-chi.vercel.app |
| Back-office | https://site-web-seven-chi.vercel.app/admin |
| Dépôt | https://github.com/massimoharnisfeger-hue/site-web |
| Hébergement | Vercel, projet `site-web` |
| Base de données | MongoDB Atlas |
| Images | Vercel Blob |

Revenir à cet état exact :

```bash
git checkout 9d9d05c
```

---

## Ce qu'il reste à faire, et que toi seul peux faire

Ces trois points bloquent le reste. Aucun ne demande de compétence technique.

### 1. Créer le compte administrateur — 40 secondes

Ouvre **/admin**. Le formulaire « premier utilisateur » s'affiche : ton e-mail,
un mot de passe. C'est fait.

Tant que ce compte n'existe pas, **rien n'est modifiable** et le site affiche le
contenu de démonstration.

### 2. Renseigner l'adresse du club — 2 minutes

`/admin` → **Réservation & Pied de page** → rue, code postal, **ville**.

Renseigner la ville active d'un coup trois choses : l'adresse au pied de page,
la ville ajoutée au titre Google, et la fiche d'établissement structurée que
Google lit pour le référencement local. C'est le geste au meilleur rendement de
tout le projet.

### 3. Compléter les mentions légales — 15 minutes

`/admin` → **Bandeau & mentions**. Deux gabarits t'attendent, avec des crochets
à remplacer. Il te faut : raison sociale, forme juridique, capital, adresse du
siège, SIRET, ville du RCS, directeur de la publication, et l'e-mail où exercer
les droits RGPD.

Je ne peux pas les inventer : ce sont des informations juridiques qui engagent
l'entreprise.

---

## Ce que le site sait faire

**Tout le contenu est éditable depuis `/admin`**, sans toucher au code : textes,
photos, offres, avis, chiffres, questions fréquentes, libellés du menu, horaires,
mentions légales. Chaque champ a une valeur de repli : si la base tombe, le site
s'affiche quand même.

**La réservation ne ment pas.** Le visiteur compose une demande, le site lui
affiche le message à envoyer et lui propose d'ouvrir sa messagerie ou d'appeler.
Aucun paiement, aucune fausse confirmation, aucune coordonnée enregistrée.

**Photos automatiques (optionnel).** Un mot-clé Unsplash par étape du Parcours
suffit, si `UNSPLASH_ACCESS_KEY` est configurée dans Vercel. Sans clé, les photos
de démonstration s'affichent.

---

## Commandes

```bash
npm install
npm run dev              # http://localhost:3000
npm run lint             # obligatoire avant tout commit
npm run build            # obligatoire avant tout commit
npm run generate:types   # après toute modification de globals/ ou collections/
npm run verify           # message de réservation — attendu : 7/7
```

**Ne jamais lancer `payload generate:importmap`** : le fichier produit casse le
build. La raison est écrite dans `app/(payload)/admin/importMap.js`. Le script
npm correspondant a été retiré pour qu'on ne le lance pas par accident.

---

## Où est quoi

```
app/(frontend)/     le site public
app/(payload)/      le back-office et l'API — ne pas modifier à la main
globals/Home.ts     TOUS les champs modifiables du back-office
lib/content.ts      lecture du contenu + contenu de démonstration
lib/booking-message.ts  composition du message de réservation (fonction pure)
lib/jsonld.ts       données structurées pour Google
components/sections/    les sections visuelles
specs/              spécifications Spec Kit
.specify/memory/constitution.md   les règles du projet
```

**Ajouter un contenu modifiable** demande de toucher quatre fichiers, dans cet
ordre : `globals/Home.ts` → `lib/types.ts` → `lib/content.ts` (défaut **et**
lecture avec repli) → le composant.

---

## Les règles du projet

`.specify/memory/constitution.md` — cinq principes non négociables. Les deux qui
comptent le plus au quotidien :

1. **Aucun texte visible en dur.** Tout passe par le back-office.
2. **Le site ne doit jamais être vide.** Chaque champ a son repli.

Le fichier détaille aussi les contraintes techniques et les vérifications
obligatoires avant commit.

---

## Ce qui reste ouvert

- **Polices auto-hébergées.** Clash Display et General Sans viennent encore de
  Fontshare par lien externe. Les passer sur `next/font/local` supprimerait une
  dépendance réseau au premier affichage.
- **Préchargeur.** Ramené de 6,5 s à 3,0 s. Le limiter à la première visite de la
  session le ferait tomber sous la seconde.
- **Mise en cache.** La page est en rendu dynamique intégral : chaque visiteur
  interroge MongoDB. `getHome()` est mémoïsée le temps d'une requête, mais deux
  visiteurs successifs déclenchent toujours deux lectures.
- **Montées de version majeures non faites**, volontairement : Next 16,
  Tailwind 4, Framer Motion 13, ESLint 10, TypeScript 7, GraphQL 17. Chacune
  demande une migration à part entière. Deux avis de sécurité restants
  (`next`, et `postcss` embarqué dans Next) se ferment avec Next 16.
- **`next/image` n'est pas utilisé** : les URL d'images viennent du back-office
  et peuvent pointer sur un hôte non déclaré, ce qui ferait échouer le rendu.
  `components/ui/Photo.tsx` fournit à la place `srcSet`, `sizes`, décodage
  asynchrone et repli propre.
- **Avis.** Les quatre témoignages sont des exemples. Les champs date et
  provenance existent et sont volontairement vides : y écrire « Google » sur un
  faux avis serait exactement le problème que l'audit reproche.

---

## Démarrer un autre site sur cette base

Ce projet est un bon point de départ pour un autre site vitrine avec back-office.

```bash
gh repo create mon-nouveau-site --private --clone   # ou via l'interface GitHub
cd mon-nouveau-site
# copier depuis site-web :
#   app/ components/ globals/ collections/ lib/ payload.config.ts
#   tailwind.config.ts next.config.mjs postcss.config.mjs tsconfig.json
#   .specify/ .claude/
```

À changer ensuite, dans l'ordre :

1. `tailwind.config.ts` — les sept couleurs de la charte
2. `app/(frontend)/globals.css` — les deux polices
3. `globals/Home.ts` — les champs, section par section
4. `lib/content.ts` — le contenu de démonstration
5. `.specify/memory/constitution.md` — les principes du nouveau projet
6. une base MongoDB neuve et un nouveau projet Vercel

Ce qui se réutilise sans modification : le système de repli de `lib/content.ts`,
`lib/jsonld.ts`, `lib/booking-message.ts`, et toute la structure de sections.
