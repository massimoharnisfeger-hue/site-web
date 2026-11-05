# Prompt à coller avant de faire créer ou modifier un email HTML

Copie tout le bloc ci-dessous au début de ta demande, puis joins ton fichier ou ton texte.

```text
Tu crées ou modifies un email HTML qui sera lu dans Gmail (PC, Android, iPhone), Outlook (Windows classique, nouvel Outlook, Outlook.com, Mac) et Apple Mail. Respecte toutes les règles ci-dessous sans exception.

CONTENU
1. Ne modifie pas le texte que je fournis : pas un mot ajouté, retiré ou reformulé (pas de prénom, pas de ligne de désinscription, pas de texte caché d'aperçu), sauf si je le demande.
2. Garde exactement les liens et les adresses d'images que je donne.

LARGEUR SUR PC (aucun vide à droite)
3. Le mail occupe 100 % de la largeur de la fenêtre de lecture : aucun max-width sur le conteneur principal, pas de carte centrée de 600 ou 680 px, sauf si je le demande.
4. Seule exception : Outlook pour Windows (moteur Word) ne sait pas faire de largeur fluide. Pour lui uniquement, utilise une table fantôme fixe de 800 px dans des commentaires <!--[if mso]> ... <![endif]-->.
5. Le texte est aligné à gauche, comme un mail normal.

IMAGES
6. Chaque image a deux versions :
   - pour Outlook Windows : <!--[if mso]><img width="X" style="width:Xpx"><![endif]--> avec X calculé pour tenir dans 800 px ;
   - pour toutes les autres : <!--[if !mso]><!--><img width="taille réelle" style="display:block;width:100%;height:auto;border:0"><!--<![endif]-->
7. N'affiche jamais une image plus grande que sa taille réelle en pixels (sinon elle est floue). Si une image peut être affichée plus large que sa taille réelle, préviens-moi et dis-moi à quelle taille l'exporter (idéalement le double de la largeur affichée).
8. Toujours un texte alt, border:0, display:block.

MOBILE
9. Sur mobile, ne change rien à ce qui fonctionne déjà. Les réglages mobiles vont uniquement dans un bloc <style> @media (max-width:820px) dans le <head>.
10. La version sans ce bloc (certaines applis l'ignorent) doit rester lisible : colonnes en inline-block avec min-width, ou tableau qui reste lisible à 360 px de large.

TECHNIQUE
11. Mise en page en tableaux (<table role="presentation">). Pas de flexbox, pas de grid, pas de position, pas de JavaScript, pas de police externe, pas de vidéo.
12. Tous les styles en ligne (style="..."). Le <style> du <head> ne sert qu'au mobile et aux corrections Outlook.
13. En-tête obligatoire : <!DOCTYPE html>, <meta charset="utf-8">, meta viewport, x-apple-disable-message-reformatting, color-scheme light, et pour Outlook le bloc OfficeDocumentSettings PixelsPerInch 96.
14. Listes <ol>/<ul> : ajoute une correction Outlook (ol,ul{margin-left:28px;padding-left:0}) pour que les puces ne soient pas coupées.
15. Boutons : version VML (v:roundrect) pour Outlook Windows, lien stylé pour les autres.
16. Le fichier pèse moins de 100 Ko, sinon Gmail coupe le mail.

VÉRIFICATION AVANT DE ME RENDRE LE FICHIER
17. Fais un rendu à 1280 px, 1024 px, 780 px et 390 px de large : aucun vide à droite sur PC, aucun défilement horizontal, rien qui déborde.
18. Compare le texte et les liens avec ma version : ils doivent être identiques.
19. Dis-moi clairement ce que tu as changé, et ce qui restera différent dans Outlook Windows.
```
