# Quickstart — Vérifier la réservation honnête

## Prérequis

```bash
npm install
npm run build && npm start
```

Aucun `.env` n'est nécessaire : le tunnel fonctionne sur le contenu de
démonstration, et c'est précisément un des points à vérifier.

## 1. La fonction de composition (hors navigateur)

```bash
node_modules/.bin/tsx scripts/verifier-message.ts
```

Attendu : les six propriétés du [contrat](./contracts/message-demande.md)
passent, dont le plafond de 1 500 caractères sur une saisie anormalement longue.

## 2. Le parcours, dans le navigateur

Ouvrir `http://localhost:3000/#reservation` puis :

| Étape | Action | Attendu |
|---|---|---|
| 1 | Choisir une formule | La formule cliquée est sélectionnée |
| 2 | Ouvrir le calendrier | Les dates passées sont refusées |
| 3 | Saisir un e-mail sans `@` | La validation refuse et dit quoi corriger |
| 3 | Saisir des coordonnées valides | Le bouton s'active |
| 4 | Lire le bouton | Il annonce une demande, jamais un paiement |
| 4 | Valider | L'écran final affiche le message **en clair**, copiable |
| 4 | Lire l'écran final | Aucun « payé », « confirmé » ni « réservé » |
| 4 | Bouton d'appel | `tel:` avec le numéro du back-office |

## 3. Les vérifications qui prouvent la spec

```bash
# SC-001 — aucun mot interdit dans les textes servis
curl -s http://localhost:3000/ | grep -ciE "confirmé|récapitulatif part|Confirmer & payer"
# attendu : 0

# SC-008 — aucune écriture en base
grep -rn "payload.create\|payload.update" components/ lib/
# attendu : aucun résultat
```

## 4. Accessibilité

Parcourir le tunnel **au clavier uniquement** : chaque étape doit être
atteignable, le focus visible, et les messages d'erreur annoncés. Vérifier que
toute cible interactive mesure au moins 44 px.

## Ce qui ne peut pas être vérifié ici

L'ouverture réelle de la messagerie dépend de l'appareil. À contrôler après mise
en ligne sur un mobile avec compte mail, et sur un mobile sans — ce dernier doit
tomber sur le texte copiable, jamais sur une erreur système.
