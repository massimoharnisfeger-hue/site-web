# Prompt à coller avant de faire créer ou modifier un email HTML

Copie tout le bloc ci-dessous au début de ta demande. Remplis les 3 lignes entre crochets, puis joins ton fichier ou ton texte.

```text
CONTEXTE ET OBJECTIF
Tu crées ou modifies un email de prospection B2B envoyé par une personne (pas une newsletter).
- Expéditeur : [prénom, nom, fonction]
- Outil d'envoi : [Gmail directement / Brevo / Lemlist / Apollo / autre]
- Action attendue du lecteur : [répondre / réserver une démo via le lien Calendly / autre]
L'email doit arriver dans la boîte principale (pas Promotions, pas spam), se lire en 30 secondes et donner envie de faire l'action attendue. Chaque choix technique sert cet objectif. Si une de mes demandes nuit à la délivrabilité ou au taux de réponse, dis-le-moi avant de l'appliquer.

1. CONTENU : NE RIEN INVENTER
- Ne modifie pas mon texte : aucun mot ajouté, retiré ou reformulé, pas de prénom, pas de ligne de désinscription, pas de texte d'aperçu caché, sauf si je le demande.
- Garde exactement mes liens et mes adresses d'images.

2. DÉLIVRABILITÉ
- Le texte porte le message. Les images illustrent mais ne contiennent jamais une information absente du texte.
- Au maximum 3 à 4 images, dont la signature. Pas d'image de fond, pas de mail composé d'une seule grande image.
- Garde nettement plus de texte que d'images. Si mon mail est trop chargé en images, préviens-moi.
- Fournis aussi une version texte brut du mail (même texte, liens en clair), à coller dans l'outil d'envoi s'il le permet.
- Pas de raccourcisseur de liens, pas de mots ou de symboles qui sentent la promo ajoutés par toi.
- Le fichier HTML pèse moins de 100 Ko (au-delà, Gmail coupe le mail).

3. LE MAIL DOIT TENIR SANS IMAGES
- Outlook bloque souvent les images à l'ouverture. Sans images, le mail doit rester lisible et cliquable.
- Chaque image a un texte alt court et utile, une largeur et une hauteur fixées (pour éviter les trous ou les sauts de mise en page) et border:0.

4. MISE EN PAGE PC
- Le mail ressemble à un mail écrit par une personne : fond blanc, texte aligné à gauche, pas de carte centrée façon newsletter.
- Le contenu fait 100 % de la largeur de la fenêtre de lecture : aucun max-width sur le conteneur principal, aucun vide à droite sur PC.
- Outlook pour Windows ne gère pas les largeurs fluides : pour lui, utilise une table fantôme fixe de 800 px dans <!--[if mso]> ... <![endif]-->.

5. IMAGES NETTES
- Le texte prend toute la largeur, mais pas les images : chaque image ou groupe d'images est limité à une largeur raisonnable (800 px au total pour une bannière ou une rangée de vignettes), aligné à gauche, comme une photo dans un mail normal. Une image ne s'affiche jamais plus grande que sa taille réelle en pixels.
- Si une image est trop petite pour sa place, ne l'agrandis pas : dis-moi à quelle largeur l'exporter (idéalement le double de sa largeur d'affichage).
- Chaque image a deux versions :
  - pour Outlook Windows : <!--[if mso]><img width="X" style="width:Xpx;border:0"><![endif]-->, X calculé pour tenir dans 800 px ;
  - pour les autres : <!--[if !mso]><!--><img width="taille réelle" style="display:block;width:100%;max-width:Ypx;height:auto;border:0"><!--<![endif]-->, Y étant la largeur d'affichage maximale.

6. MOBILE
- Ne casse rien de ce qui fonctionne déjà sur mobile.
- Les réglages mobiles vont dans un seul bloc <style> @media (max-width:820px) dans le <head>.
- Sans ce bloc (certaines applis et certains outils d'envoi le suppriment), le mail reste lisible à 360 px de large : tableaux qui rétrécissent, ou colonnes en inline-block avec min-width.

7. MODE SOMBRE
- Pas de logo ou de texte noir sur fond transparent (il disparaît quand Gmail ou Outlook inversent les couleurs) : utilise des images à fond plein.
- Ajoute les meta color-scheme et supported-color-schemes en « light ».

8. TECHNIQUE
- Mise en page en tableaux <table role="presentation">. Pas de flexbox, pas de grid, pas de position, pas de JavaScript, pas de police externe, pas de vidéo, pas de formulaire.
- Tous les styles sont en ligne (style="..."). Le <style> du <head> sert uniquement au mobile et aux corrections Outlook.
- En-tête : <!DOCTYPE html>, <meta charset="utf-8">, meta viewport, x-apple-disable-message-reformatting, et pour Outlook le bloc OfficeDocumentSettings avec PixelsPerInch 96.
- Listes <ol>/<ul> : correction Outlook (ol,ul{margin-left:28px;padding-left:0}) pour que les puces ne soient pas coupées.
- Bouton éventuel : version VML (v:roundrect) pour Outlook Windows, lien stylé pour les autres.
- Adapte le fichier à l'outil d'envoi indiqué en haut. Par exemple, si le mail est collé dans Gmail directement, le bloc <style> sera perdu : le mail doit donc fonctionner sans lui.

9. VÉRIFICATION AVANT DE ME RENDRE LE FICHIER
- Fais un rendu à 1280, 1024, 780 et 390 px de large, avec et sans images : pas de défilement horizontal, rien qui déborde, mail lisible sans images.
- Compare le texte et les liens avec ma version : ils doivent être identiques.
- Donne-moi :
  a) la liste de ce que tu as changé et pourquoi ;
  b) ce qui restera différent dans Outlook Windows ;
  c) les images à réexporter, avec leur largeur conseillée ;
  d) la marche à suivre pour m'envoyer un test réel depuis mon outil d'envoi et le vérifier dans Gmail (PC et téléphone) et Outlook.
```
