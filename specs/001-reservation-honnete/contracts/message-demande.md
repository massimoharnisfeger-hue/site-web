# Contrat — Message de demande de réservation

L'interface externe de cette feature n'est ni une API ni une base : c'est **le
message que le club reçoit**. Sa forme est donc contractuelle.

## Destinataire

`footer.email`, tel que renseigné dans le back-office. Aucune adresse en dur.

## Objet

```
Demande de réservation — {formule} — {date} {créneau}
```

Exemple : `Demande de réservation — Location de terrain — 12/10/2026 18:30`

L'objet doit rester identifiable même tronqué : la nature de la demande vient
en premier, les détails ensuite.

## Corps

```
Bonjour,

Je souhaite réserver :

Formule   : {formule}
Date      : {date}
Créneau   : {créneau}
Joueurs   : {joueurs}

Mes coordonnées :

Nom       : {nom}
E-mail    : {email}
Téléphone : {téléphone}

Merci de me confirmer la disponibilité.
```

Sept informations, dans cet ordre (FR-005). Libellés alignés pour rester
lisibles dans un client en police à chasse fixe comme proportionnelle.

## Encodage

- `encodeURIComponent` sur l'objet et le corps
- sauts de ligne `\r\n` avant encodage (D3)
- longueur totale du lien plafonnée à 1 500 caractères (D2)

## Forme du lien

```
mailto:{email}?subject={objet encodé}&body={corps encodé}
```

## Contrat de la fonction

`lib/booking-message.ts` expose une fonction **pure**, sans effet de bord et
sans accès au DOM, donc vérifiable hors navigateur :

```
buildBookingMessage(demande, emailClub) → { objet, corps, mailtoUrl }
```

Propriétés attendues, à vérifier par test :

1. les sept informations figurent dans le corps ;
2. l'objet contient la formule, la date et le créneau ;
3. le destinataire est l'e-mail passé en argument, jamais une valeur en dur ;
4. accents et espaces sont correctement encodés dans le lien ;
5. le lien ne dépasse jamais 1 500 caractères, y compris avec des saisies
   anormalement longues ;
6. un e-mail de club vide produit un lien vide plutôt qu'un `mailto:` cassé.
