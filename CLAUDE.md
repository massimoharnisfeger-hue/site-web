# Padel House

Site vitrine immersif d'un club de padel, avec back-office Payload CMS pour que
le gérant modifie tout le contenu sans développeur.

## Les objectifs — c'est fini quand

- **O1.** Le gérant modifie n'importe quel texte, photo, prix ou horaire depuis
  `/admin`, sans toucher au code.
- **O2.** Le site s'affiche complet même base de données coupée, grâce au
  contenu de repli.
- **O3.** Le tunnel de réservation ne promet rien qu'il ne tient : aucun
  paiement, aucune confirmation, aucune coordonnée enregistrée.
- **O4.** Le club est trouvable localement : ville dans le titre, fiche
  d'établissement structurée lisible par Google.
- **O5.** Le site est utilisable sur mobile et au clavier, contrastes AA.

## Hors périmètre

- Paiement en ligne et réservation confirmée (O3 l'interdit explicitement).
- Comptes visiteurs, espace membre.
- Application mobile.
- Multilingue.
- Tests automatisés au-delà de `npm run verify` — assumé, voir la dette.

## Contraintes

- **Outils imposés :** Next.js (App Router), Payload CMS, MongoDB Atlas,
  Vercel, Vercel Blob, Tailwind, GSAP, Lenis.
- **Non négociable :** les cinq principes de `.specify/memory/constitution.md`,
  qui priment sur toute habitude de travail.

## Livrables

- Le site public et le back-office en ligne sur Vercel.
- Le dépôt, avec `README.md` (déploiement pas à pas) et `HANDOVER.md`.
- Les accès : Vercel, MongoDB Atlas, compte administrateur `/admin`.

## La carte du projet

```
app/(frontend)/       le site public
app/(payload)/        le back-office et l'API — ne pas modifier à la main
globals/Home.ts       TOUS les champs modifiables du back-office
lib/content.ts        lecture du contenu + contenu de démonstration
lib/booking-message.ts  composition du message de réservation (fonction pure)
components/sections/  les sections visuelles, alimentées par props
specs/                spécifications Spec Kit
```

**Ne jamais toucher à la main :** `app/(payload)/admin/importMap.js`,
`package-lock.json`.

## Conventions

- Ajouter un contenu éditable = quatre fichiers, **dans cet ordre** :
  `globals/Home.ts` → `lib/types.ts` → `lib/content.ts` (défaut **et** lecture
  avec repli) → le composant.
- Une section ne lit jamais Payload elle-même : elle reçoit ses props depuis
  `app/(frontend)/page.tsx`. Une seule lecture de base par rendu.
- Aucun texte visible en dur dans un composant.
- Commits en français, préfixés `feat:`, `fix:`, `docs:`.

## Sauvegardes et retour en arrière

- **Perdu ce soir si la machine disparaît :** rien du code (dépôt distant). La
  base MongoDB Atlas et les images Vercel Blob dépendent des sauvegardes de ces
  services — **à vérifier, ce n'est pas confirmé.**
- **Retour en arrière :** redéploiement de la version précédente depuis Vercel.
  **Jamais essayé pour de vrai** → dette technique.

## Décisions

| Date | Décision | Pourquoi | Écarté |
|---|---|---|---|
| 2026-08 | La réservation envoie un message, elle ne confirme rien | Confirmer sans back-office de créneaux, c'est mentir au visiteur | Faux tunnel de paiement |
| 2026-08 | Ne jamais lancer `payload generate:importmap` | Le fichier produit casse `next build` | Régénération automatique |
| 2026-08 | Rendu `force-dynamic` intégral | Les modifications du back-office doivent être visibles tout de suite | Cache ISR |
| 2026-08 | Pas de `next/image` | Les URL viennent du back-office et peuvent pointer sur un hôte non déclaré | `next/image` + liste d'hôtes |
| 2026-08 | Montées de version majeures reportées | Chacune est une migration à part entière | Next 16, Tailwind 4, ESLint 10 |
| 2026-09-14 | CSP avec `'unsafe-inline'` et `'unsafe-eval'` sur les scripts | Next hydrate en ligne, les deux blocs JSON-LD d'O4 sont en ligne, et l'administration Payload a besoin d'`eval`. Ce qui reste bloqué est l'essentiel : script tiers, encadrement externe, objets embarqués | CSP à nonce — demande une intégration Next plus profonde, à revoir |

---

@ETAT.md
@memory.md
@skill.md
@agents.md
@verify.md
@securite.md
