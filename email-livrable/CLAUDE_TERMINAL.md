# À coller tel quel dans Claude Code (terminal)

Ouvre Claude Code dans le dossier qui contient le projet Vercel `jobloom-landing-pages` (celui où tu lances `vercel`), puis colle tout le bloc ci-dessous.

```text
Mission : mettre en ligne les images d'un email de prospection, vérifier le mail, puis préparer l'envoi de test. Ne modifie ni le texte ni la mise en page du mail.

CONTEXTE
- Le mail est le fichier email_1st_Amelie_final.html, dans le dossier email-livrable du dépôt GitHub massimoharnisfeger-hue/site-web, branche claude/keen-heisenberg-v90d5h. Récupère ce dossier (git clone ou téléchargement) si tu ne l'as pas déjà en local.
- Ce mail charge 5 images depuis https://jobloom-landing-pages-massimoharnisfeger-hues-projects.vercel.app/signature/ : pilier-1.jpg, pilier-2.jpg, pilier-3.jpg, banniere-jobloom.jpg, amelie-alleman.jpg.
- Ces 5 images, dans leur version finale, sont dans email-livrable/images/.
- Le site qui les sert est le projet Vercel « jobloom-landing-pages », déployé en ligne de commande avec `vercel`. Dans ce projet, les images sont dans src/signature/. Le projet est sur cet ordinateur : trouve son dossier (cherche un dossier contenant src/signature/banniere-jobloom.jpg, ou un .vercel/project.json dont le nom est jobloom-landing-pages). Si tu ne le trouves pas, demande-moi le chemin avant de continuer.

ÉTAPE 1 — METTRE LES IMAGES EN LIGNE
1. Dans le projet jobloom-landing-pages, remplace les fichiers src/signature/pilier-1.jpg, pilier-2.jpg, pilier-3.jpg, banniere-jobloom.jpg et amelie-alleman.jpg par ceux de email-livrable/images/ (mêmes noms, extension .jpg, pas .webp).
2. Avant de remplacer, garde une copie des anciens fichiers dans src/signature/_anciennes/ pour pouvoir revenir en arrière.
3. Vérifie les dimensions des nouveaux fichiers : piliers 1536 × 1024, bannière 2000 × 400, photo 175 × 243. Si ce n'est pas ça, arrête-toi et dis-le-moi.
4. Déploie en production : `vercel --prod`. Si la commande demande une connexion ou un choix de projet, montre-moi le message et attends ma réponse.
5. Vérifie que les 5 URL ci-dessus renvoient bien les nouvelles images (code 200, et dimensions attendues). Montre-moi le résultat des 5 vérifications.

ÉTAPE 2 — VÉRIFIER LE MAIL
6. Ouvre email_1st_Amelie_final.html et vérifie que les 5 adresses d'images y sont exactement celles ci-dessus. Ne change rien d'autre dans le fichier.
7. Vérifie que le fichier pèse moins de 100 Ko.
8. Fais un rendu du mail avec Playwright (ou un navigateur sans interface) à 1000 px et à 390 px de large, avec les vraies images chargées depuis le serveur. Compare visuellement avec rendu-gmail-1000.png et rendu-mobile.png : le résultat doit être le même. Signale-moi toute différence.

ÉTAPE 3 — PRÉPARER L'ENVOI DE TEST
9. Demande-moi quel outil servira à l'envoi (Gmail directement, Brevo, Lemlist, Apollo, autre). Selon la réponse, donne-moi la marche à suivre exacte pour coller le HTML en mode « code source » et m'envoyer un test. Si l'outil a un champ « version texte », indique-moi d'y coller email_1st_Amelie_final.txt.
10. Rappelle-moi de vérifier le test dans Gmail sur PC, Gmail sur téléphone et Outlook, et liste-moi les 5 points à regarder : images affichées, 3 cartes côte à côte sur mobile, bouton cliquable, aucun défilement horizontal, texte identique.

RÈGLES
- Ne modifie jamais le texte du mail ni sa mise en page. Si quelque chose te semble devoir changer, dis-le-moi, ne le fais pas.
- Ne supprime rien sur le serveur, ne déploie rien d'autre que ces 5 images.
- Avant chaque commande qui change quelque chose en ligne (vercel --prod), dis-moi ce que tu vas faire et attends mon accord.
- À la fin, donne-moi un résumé en 5 lignes : ce qui est en ligne, ce qui a été vérifié, ce qui reste à faire de mon côté.
```
