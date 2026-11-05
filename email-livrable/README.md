# Email de prospection Amélie — dossier de livraison

Ce dossier contient tout ce qu'il faut pour mettre le mail en ligne et l'envoyer.
Pour que Claude (terminal) fasse le travail, copie-lui le contenu de `CLAUDE_TERMINAL.md`.

## Fichiers

| Fichier | Rôle |
|---|---|
| `email_1st_Amelie_final.html` | Le mail, version finale. À coller en mode « code HTML » dans l'outil d'envoi. |
| `email_1st_Amelie_final.txt` | Version texte brut, à coller dans le champ « version texte » si l'outil en a un. |
| `images/pilier-1.jpg` `pilier-2.jpg` `pilier-3.jpg` | Les 3 cartes (1536 × 1024 px). À mettre en ligne. |
| `images/banniere-jobloom.jpg` | La bannière recadrée (2000 × 400 px). À mettre en ligne. |
| `images/amelie-alleman.jpg` | La photo de signature (175 × 243 px). Déjà en ligne, fournie par sécurité. |
| `rendu-gmail-1000.png` `rendu-mobile.png` | Rendus de référence : à quoi le mail doit ressembler dans Gmail sur PC et sur mobile. |
| `PROMPT_email_responsive.md` | Le prompt à coller avant toute future création ou modification de mail. |

## Où vont les images

Le mail charge ses images depuis :

`https://jobloom-landing-pages-massimoharnisfeger-hues-projects.vercel.app/signature/<nom>.jpg`

C'est le projet Vercel **jobloom-landing-pages** (déployé avec la commande `vercel`, pas depuis GitHub).
Dans ce projet, les images sont dans le dossier `src/signature/`.
Il faut remplacer les fichiers existants **sous les mêmes noms**, puis redéployer en production.

## Ce que le mail garantit

- Texte d'Amélie inchangé mot pour mot (seul ajout : un bouton « Une démo de Jobloom ? », libellé déjà présent dans la signature).
- Mise en page en tableaux, styles en ligne, compatible Gmail, Outlook (Windows, Mac, web) et Apple Mail.
- Largeur : 100 % jusqu'à 1000 px, colonne centrée ; 800 px fixes dans Outlook Windows.
- Mobile : 3 cartes côte à côte, bannière et bouton pleine largeur.
- Poids du HTML : 10 Ko (limite Gmail : 100 Ko).
