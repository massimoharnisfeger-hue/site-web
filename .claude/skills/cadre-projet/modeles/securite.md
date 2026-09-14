# Sécurité — <Nom du projet>

Prouve que le produit **ne fait pas ce qu'il ne doit pas faire**.
(`verify.md` prouve qu'il fait ce qu'il promet. Questions opposées : l'une suit
le chemin prévu, l'autre cherche ceux qui ne le sont pas.)

**Aucune case ne se coche sans avoir vu la sortie.** Ici plus qu'ailleurs : une
case cochée à tort en sécurité ne se rattrape pas par un correctif, elle se
rattrape par une fuite.

**Dernier passage :** <AAAA-MM-JJ — N échecs, N acceptés>
**Prochaine revue :** <AAAA-MM-JJ — au plus tard 3 mois>

## Les deux régimes

| Régime | Ce qu'on lance | Quand |
|---|---|---|
| **Rapide** | `scripts/controle-securite.sh` | à chaque incrément qui touche une entrée visiteur, l'authentification, une dépendance ou une clé |
| **Complet** | tout le registre ci-dessous | avant chaque lancement, et à la revue trimestrielle |

La partie mécanisable s'exécute :

```bash
bash .claude/skills/cadre-projet/scripts/controle-securite.sh [url-de-production]
```

## La gravité

| Niveau | Ce que ça veut dire | Conséquence |
|---|---|---|
| **Critique** | Exploitable à distance, sans compte, ou fuite de secret ou de données | **bloque le lancement. Sans discussion.** |
| **Élevée** | Exploitable avec un compte, ou expose des données internes | bloque le lancement, sauf décision écrite ci-dessous |
| **Moyenne** | Affaiblit une défense sans l'ouvrir seule | à corriger dans la vague en cours |
| **Faible** | Durcissement, bonne pratique non tenue | dette technique, avec échéance |

## Le registre

### 1. Secrets

| # | Le test | Comment | Gravité | Dernier résultat |
|---|---|---|---|---|
| S1 | Aucun fichier de clés suivi par git | `git check-ignore -v .env.local` | Critique |  |
| S2 | Aucune clé dans l'historique | `git log --all --oneline -- .env .env.local` → vide | Critique |  |
| S3 | Aucune valeur de clé en clair dans le code | script | Critique |  |
| S4 | Aucun secret dans le paquet livré au navigateur | script (fouille la sortie de build) | Critique |  |
| S5 | Chaque clé a une date de rotation connue | lecture du fichier de clés | Moyenne |  |

### 2. Dépendances

| # | Le test | Comment | Gravité | Dernier résultat |
|---|---|---|---|---|
| D1 | Aucune faille connue de gravité haute ou critique | `npm audit --audit-level=high` | Élevée |  |
| D2 | Les versions sont verrouillées | présence du fichier de verrou, et il est suivi | Moyenne |  |
| D3 | Aucune dépendance abandonnée sur un chemin sensible | lecture — auth, chiffrement, téléversement | Moyenne |  |

### 3. Accès et authentification

| # | Le test | Comment | Gravité | Dernier résultat |
|---|---|---|---|---|
| A1 | L'administration est inaccessible sans compte | ouvrir `/admin` en navigation privée | Critique |  |
| A2 | Aucun compte ni mot de passe par défaut | lecture de la configuration et des scripts d'amorçage | Critique |  |
| A3 | Les cookies de session sont `HttpOnly`, `Secure`, `SameSite` | outils de développement, onglet réseau | Élevée |  |
| A4 | La déconnexion invalide vraiment la session | se déconnecter, rejouer la requête précédente | Élevée |  |
| A5 | Pas d'énumération de comptes | comparer les messages « mot de passe faux » et « compte inconnu » | Moyenne |  |

### 4. Entrées visiteur

| # | Le test | Comment | Gravité | Dernier résultat |
|---|---|---|---|---|
| E1 | Injection dans la base | envoyer `{"$ne":null}`, `' OR 1=1 --`, `{{7*7}}` dans chaque champ | Critique |  |
| E2 | Script injecté et exécuté | envoyer `<img src=x onerror=alert(1)>`, vérifier qu'il s'affiche comme du texte | Critique |  |
| E3 | Taille des entrées plafonnée | envoyer 10 Mo dans un champ texte | Élevée |  |
| E4 | Téléversement : type et taille contrôlés côté serveur | envoyer un fichier renommé en `.png` | Élevée |  |
| E5 | Redirection ouverte | forcer un paramètre de retour vers un domaine externe | Moyenne |  |

### 5. Transport et en-têtes

| # | Le test | Comment | Gravité | Dernier résultat |
|---|---|---|---|---|
| T1 | HTTPS partout, HTTP redirigé | `curl -I http://<domaine>` | Élevée |  |
| T2 | En-têtes présents : CSP, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` | script, ou `curl -I` | Moyenne |  |
| T3 | Pas de cartes de source en production | script | Moyenne |  |

### 6. Données personnelles

| # | Le test | Comment | Gravité | Dernier résultat |
|---|---|---|---|---|
| P1 | On sait exactement quelles données sont stockées | lecture des modèles et des formulaires | Élevée |  |
| P2 | Aucune donnée personnelle dans les journaux | chercher e-mail, téléphone, IP dans les traces | Élevée |  |
| P3 | Une durée de conservation est définie et appliquée | lecture, puis vérification en base | Moyenne |  |
| P4 | Les mentions et l'exercice des droits existent et sont atteignables | ouvrir les pages | Élevée si le produit est public |  |

### 7. Surface exposée

| # | Le test | Comment | Gravité | Dernier résultat |
|---|---|---|---|---|
| X1 | Aucun outil de développement joignable en production | tenter les points d'entrée de débogage et les consoles d'API | Élevée |  |
| X2 | Aucun fichier sensible servi publiquement | script (`.env`, `.git`, `.sql`, `.bak` dans les dossiers publics) | Critique |  |
| X3 | Les messages d'erreur ne révèlent ni chemin ni version | provoquer une erreur 500 et lire la réponse | Moyenne |  |
| X4 | Pas de liste de répertoire | ouvrir un dossier sans fichier d'index | Moyenne |  |

### 8. Abus et charge

| # | Le test | Comment | Gravité | Dernier résultat |
|---|---|---|---|---|
| B1 | Les formulaires publics sont protégés contre l'envoi en masse | envoyer 100 requêtes d'affilée | Moyenne |  |
| B2 | Rien d'irréversible ne se déclenche sans confirmation | lecture des parcours destructifs | Élevée |  |

### 9. Sauvegardes

| # | Le test | Comment | Gravité | Dernier résultat |
|---|---|---|---|---|
| G1 | Une sauvegarde récente existe | console de l'hébergeur ou de la base | Critique |  |
| G2 | **La restauration a été essayée** | restaurer sur une copie, et le dater | Critique |  |
| G3 | Les sauvegardes ne sont pas au même endroit que la production | lecture de la configuration | Élevée |  |

### 10. Tiers

| # | Le test | Comment | Gravité | Dernier résultat |
|---|---|---|---|---|
| Z1 | On sait quels scripts externes s'exécutent dans la page | onglet réseau, en navigation privée | Élevée |  |
| Z2 | Chaque tiers a une raison d'être et une politique connue | lecture | Moyenne |  |

## Failles ouvertes

| Depuis | Ce qui est vulnérable | Gravité | Pourquoi pas encore corrigé | Échéance |
|---|---|---|---|---|
|  |  |  |  |  |

<!-- Une faille Critique ou Élevée sans échéance est une faille qu'on a décidé
     de garder sans le dire. Soit on la corrige, soit elle descend dans le
     tableau ci-dessous, signée. -->

## Risques acceptés

| Risque | Pourquoi on l'accepte | Ce qui le rendrait inacceptable | Décidé par | Date |
|---|---|---|---|---|
|  |  |  |  |  |

<!-- Accepter un risque est légitime. L'accepter sans l'écrire ne l'est pas :
     personne ne pourra le rediscuter, et personne ne saura qu'il existe. -->
