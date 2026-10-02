# Padel House — site vitrine « Tableau tactique »

Site vitrine statique d'un club de padel : une page d'accueil et deux pages légales.
Direction artistique « Tableau tactique » : des plans de court au trait blanc sur le
bleu du gazon, des cotes, une typographie fine, une seule touche de jaune (la balle).

- **Stack** : React 19, TypeScript, Vite 8, Tailwind CSS 4, Framer Motion, `react-router-dom`.
- **Aucun serveur, aucune base de données** : tout le texte vient de `src/content.ts`.
- **La réservation ne ment pas** : le visiteur compose une demande qu'il envoie lui-même
  (messagerie ou téléphone). Pas de confirmation fictive, pas de paiement, rien n'est stocké.

## Commandes

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # typecheck + build de production dans dist/
npm run preview   # sert dist/ en local
npm run lint      # tsc --noEmit
npm run verify    # tests du message de réservation (node --test)
```

## Où est quoi

```
index.html                       <title>, description, Open Graph, JSON-LD, <noscript>
src/content.ts                   TOUT le texte du site (fiche du club, sections, libellés, pages légales)
src/styles.css                   thème Tailwind (@theme), base typographique, utilitaires, animations du plan
src/App.tsx                      routes : /, /mentions-legales, /confidentialite (le reste renvoie vers /)
src/pages/                       HomePage, LegalPage
src/components/layout/           Header (menu, ancre active), Footer (plan du club)
src/components/sections/         une section par fichier : Hero, Facts, Offers, Journey, Gallery,
                                 Reviews, Faq, Booking (+ Calendar)
src/components/court/            CourtPlan (le plan animé du héros), MiniCourt (logo), OfferPicto
src/components/ui/               Reveal, Section, SectionHeader, Photo, AnchorLink, Icons
src/lib/booking-message.ts       composition du message de réservation (fonction pure, testée)
src/lib/typo.ts                  espaces insécables françaises à l'affichage
src/hooks/                       media queries, section active, titre d'onglet, blocage du défilement
public/favicon.svg               le mini-court
vercel.json                      framework Vite + réécriture SPA vers index.html
```

## Modifier le contenu

Tout se passe dans `src/content.ts`. Les composants ne contiennent aucune phrase en dur :
seuls les `aria-label` et le gabarit du message de réservation sont dans le code.

Quatre choses à faire avant la mise en ligne :

1. **La fiche du club** (`club`) : adresse, téléphone, e-mail qui reçoit les demandes, URL du site.
2. **Les mentions légales et la confidentialité** (`site.legal`) : remplacer les crochets
   (`[Raison sociale]`, `[numéro SIRET]`…). Ces informations engagent l'entreprise, elles ne
   sont pas inventées.
3. **Les avis** (`site.reviews`) : remplacer les exemples par de vrais avis, puis passer
   `examples` à `false`.
4. **`index.html`** : le titre, la description, le JSON-LD et le bloc `<noscript>` reprennent
   `src/content.ts`. À mettre à jour en même temps.

## Déploiement

Le dossier est autonome. Sur Vercel, définir le **Root Directory** du projet sur
`tableau-tactique` (ou déplacer son contenu à la racine du dépôt). `vercel.json` déclare le
framework Vite et la réécriture nécessaire au routage côté client.
