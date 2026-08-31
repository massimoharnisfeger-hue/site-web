# Phase 0 — Recherche

Aucun marqueur NEEDS CLARIFICATION ne subsiste dans la spécification. Les
questions ouvertes ici sont techniques et se tranchent sans le gérant.

---

## D1 — Comment savoir si le visiteur a une messagerie configurée ?

**Décision** : ne pas chercher à le savoir.

Aucune API navigateur ne rapporte si un lien `mailto:` a été pris en charge.
Ouvrir le lien puis mesurer une perte de focus est un procédé indirect qui
produit des faux positifs sur mobile et des faux négatifs sur bureau.

Conséquence de conception : **le texte complet de la demande est affiché en
clair sur l'écran final, systématiquement**, avec un bouton pour le copier. Le
bouton « Ouvrir ma messagerie » est une commodité posée par-dessus. Le chemin
sans messagerie devient donc le chemin nominal, et non un rattrapage.

**Alternatives écartées** : détection par `blur`/`visibilitychange` (peu fiable
et invisible à déboguer) ; `iframe` masquée avec le `mailto:` (bloquée par les
navigateurs récents).

---

## D2 — Le lien `mailto:` risque-t-il d'être tronqué ?

**Décision** : plafonner la longueur totale du lien à 1 500 caractères et
tronquer le corps proprement au-delà, en conservant toujours les coordonnées du
visiteur.

Les navigateurs et clients de messagerie n'ont pas de limite normalisée ; la
valeur de sécurité usuelle est d'environ 2 000 caractères, héritée de la limite
historique des URL. Notre message tient en 350 à 450 caractères pour une demande
normale : la marge est confortable. Le plafond protège du cas où un visiteur
colle un nom ou un e-mail anormalement long.

**Alternatives écartées** : ne rien plafonner (un champ trop long produirait un
message coupé au milieu, donc une demande incompréhensible pour le club).

---

## D3 — Comment encoder le corps du message ?

**Décision** : `encodeURIComponent` sur l'objet et sur le corps, sauts de ligne
en `\r\n` avant encodage.

`encodeURIComponent` traite correctement les accents, indispensable en français.
Le couple retour chariot + saut de ligne est le plus largement respecté par les
clients de messagerie, y compris ceux de Windows, là où un `\n` seul est parfois
ignoré et produit un pavé illisible.

---

## D4 — Comment proposer la copie du texte ?

**Décision** : `navigator.clipboard.writeText`, avec repli sur une zone de texte
sélectionnable.

L'API presse-papiers exige un contexte sécurisé : satisfait sur Vercel en HTTPS
et en local sur `localhost`. Elle peut néanmoins échouer — permission refusée,
navigateur ancien. Le message reste donc rendu dans un élément sélectionnable,
que le bouton de copie soit disponible ou non. La copie est un raccourci, jamais
la seule voie d'accès au texte.

---

## D5 — Jusqu'où valider l'e-mail et le téléphone ?

**Décision** : validation permissive. E-mail : présence d'un `@` avec du texte
de part et d'autre et un point dans le domaine. Téléphone : au moins huit
chiffres après retrait des espaces, points, tirets et parenthèses.

Une expression régulière stricte rejette des adresses et des numéros valides.
Ici, un faux négatif coûte une demande perdue, alors qu'un faux positif coûte
seulement un rappel qui échoue — et le club dispose de deux moyens de contact.
Le déséquilibre commande la permissivité.

**Alternatives écartées** : validation stricte RFC 5322 (illisible, et rejette
des adresses réelles) ; aucune validation (le club reçoit des demandes
inexploitables).

---

## D6 — Comment empêcher le choix d'un créneau passé ?

**Décision** : le mini-calendrier existant refuse toute date antérieure au jour
courant, comparée à minuit local. Les créneaux horaires du jour même antérieurs
à l'heure courante sont désactivés.

La comparaison se fait sur le fuseau du visiteur, ce qui est le comportement
attendu pour un club local.

---

## D7 — Faut-il un appel réseau pour l'appel téléphonique ?

**Décision** : non. Un lien `tel:` avec le numéro issu du back-office. Il ouvre
le composeur sur mobile et l'application d'appel configurée sur bureau, sans
détection ni dépendance.

---

## Ce qui reste à vérifier sur le terrain

Ces points ne bloquent pas l'implémentation mais méritent un contrôle après mise
en ligne, sur de vrais appareils :

- rendu du message dans Gmail iOS et Android, où l'objet peut être tronqué ;
- comportement sur un mobile sans compte de messagerie, qui doit tomber sur le
  texte copiable sans écran d'erreur du système ;
- lisibilité du corps du message dans Outlook, plus strict sur les sauts de ligne.
