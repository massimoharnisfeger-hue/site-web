# Padel House — Site + back-office Payload CMS

Site vitrine immersif (Next.js, GSAP, Lenis, Tailwind) avec un **back-office d'administration Payload CMS** pour modifier tout le contenu en ligne.

- **Le site public** : `/`
- **Le back-office** (pour modifier le contenu) : `/admin`

---

## 🧠 Comment ça marche (en 30 secondes)

- Le **contenu** (textes, photos, offres, avis…) est stocké dans une **base de données MongoDB**.
- Tu le modifies depuis l'interface **`/admin`** (comme un WordPress moderne).
- Les **images** que tu téléverses sont stockées sur **Vercel Blob**.
- Tant que tu n'as rien modifié, le site affiche un **contenu de démonstration** déjà rempli — il n'est jamais vide.

---

## 🚀 Mettre le site en ligne (guide débutant pas à pas)

Tu vas avoir besoin de **3 comptes gratuits** : GitHub (déjà fait), MongoDB Atlas, et Vercel. Compte ~20 minutes la première fois.

### Étape 1 — Créer la base de données (MongoDB Atlas, gratuit)

1. Va sur **https://www.mongodb.com/cloud/atlas/register** et crée un compte.
2. Crée un cluster **gratuit** (offre **M0**). Choisis une région proche (ex. Paris/Frankfurt).
3. Dans **Database Access** → **Add New Database User** : crée un utilisateur avec un **mot de passe** (note-le).
4. Dans **Network Access** → **Add IP Address** → clique **« Allow access from anywhere »** (`0.0.0.0/0`). *(Nécessaire pour que Vercel puisse se connecter.)*
5. Reviens sur **Database** → bouton **Connect** → **Drivers** → copie l'**URL de connexion**. Elle ressemble à :
   ```
   mongodb+srv://monuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Remplace `<password>` par ton vrai mot de passe, et ajoute le nom de la base **`padel-house`** juste avant le `?` :
   ```
   mongodb+srv://monuser:MOTDEPASSE@cluster0.xxxxx.mongodb.net/padel-house?retryWrites=true&w=majority
   ```
   ➡️ **Garde cette URL de côté**, c'est ta `DATABASE_URI`.

### Étape 2 — Préparer une clé secrète

Cette clé sécurise les connexions au back-office. Génère une longue chaîne aléatoire :
- Sur Mac/Linux, dans un terminal : `openssl rand -base64 32`
- Ou utilise n'importe quel générateur de mot de passe long (32+ caractères).

➡️ **Garde-la de côté**, c'est ton `PAYLOAD_SECRET`.

### Étape 3 — Déployer sur Vercel

1. Va sur **https://vercel.com** et connecte-toi **avec GitHub**.
2. Clique **Add New… → Project**, puis **importe le dépôt `site-web`**.
3. Vercel détecte automatiquement Next.js. **Avant de cliquer Deploy**, ouvre la section **Environment Variables** et ajoute :

   | Name | Value |
   |------|-------|
   | `DATABASE_URI` | l'URL MongoDB de l'étape 1 |
   | `PAYLOAD_SECRET` | la clé de l'étape 2 |

4. Clique **Deploy**. Attends 1–2 minutes. 🎉 Ton site est en ligne !

### Étape 4 — Activer le stockage des images (Vercel Blob)

Pour pouvoir **téléverser des photos** depuis le back-office :

1. Dans ton projet Vercel → onglet **Storage** → **Create Database** → choisis **Blob**.
2. Donne-lui un nom, clique **Create**, puis **Connect** au projet.
3. Vercel ajoute automatiquement la variable `BLOB_READ_WRITE_TOKEN`.
4. Onglet **Deployments** → sur le dernier déploiement, clique **⋯ → Redeploy** (pour prendre en compte la nouvelle variable).

> Tant que le Blob n'est pas configuré, le site fonctionne très bien avec les images de démonstration. Tu peux faire cette étape plus tard.

### Étape 5 — Créer ton compte administrateur

1. Ouvre **`https://TON-SITE.vercel.app/admin`**.
2. La toute première visite te demande de **créer ton compte** (e-mail + mot de passe). C'est **toi** le patron du site.
3. Connecte-toi, va dans **Contenu → Page d'accueil**, modifie ce que tu veux, clique **Save**.
4. Recharge la page d'accueil : tes modifications sont en ligne ✨

---

## 💻 Travailler en local (sur ton ordinateur)

Prérequis : **Node.js 20+** installé.

```bash
# 1. Installer les dépendances
npm install

# 2. Créer le fichier de configuration
cp .env.example .env
# puis ouvre .env et remplis DATABASE_URI et PAYLOAD_SECRET
# (tu peux réutiliser la même base MongoDB qu'en ligne, ou en créer une autre)

# 3. Lancer le site
npm run dev
```

- Site : http://localhost:3000
- Back-office : http://localhost:3000/admin

En local, les images uploadées vont dans le dossier `media/` (pas besoin de Vercel Blob).

---

## 🗂️ Où est quoi ? (structure du projet)

```
app/(frontend)/      → le site public (page d'accueil, layout)
app/(payload)/       → le back-office /admin et l'API (ne pas toucher)
components/           → toutes les sections visuelles (Hero, Galerie, etc.)
globals/Home.ts       → définit TOUS les champs modifiables du back-office
collections/          → Utilisateurs (admin) et Médias (images)
lib/content.ts        → lit le contenu + contenu de démonstration par défaut
payload.config.ts     → configuration centrale de Payload
```

👉 Pour **ajouter un champ modifiable**, on l'ajoute dans `globals/Home.ts`,
puis on l'affiche dans le composant correspondant et dans `lib/content.ts`.

---

## ❓ Problèmes fréquents

- **« Le back-office ne charge pas / erreur de connexion »** → vérifie `DATABASE_URI` (mot de passe correct, IP `0.0.0.0/0` autorisée dans Atlas).
- **« Impossible d'uploader une image »** → le Blob Store n'est pas connecté (Étape 4), puis Redeploy.
- **« Mes modifs n'apparaissent pas »** → recharge la page ; le site est en mode dynamique, ça doit être instantané.
