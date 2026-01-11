# 🚀 Guide de démarrage rapide

## Installation initiale (à faire une seule fois)

### 1. Vérifier les prérequis

Assurez-vous que Node.js est installé :
```bash
node --version
# Devrait afficher v18.0.0 ou supérieur
```

### 2. Installer toutes les dépendances

Depuis la racine du projet, installez d'abord les dépendances racine :
```bash
npm install
```

Puis installez les dépendances du frontend et backend :
```bash
npm run install-all
```

Ou manuellement :
```bash
cd frontend && npm install
cd ../backend && npm install
cd ..
```

Cette commande va installer les dépendances du frontend ET du backend automatiquement.

### 3. Configuration du backend

Créer le fichier `.env` dans le dossier `backend/` :
```bash
cd backend
cp .env.example .env
```

**⚠️ IMPORTANT : Modifier le fichier `.env` et changer :**
- `JWT_SECRET` : Mettez une clé secrète complexe
- `ADMIN_PASSWORD` : Choisissez un mot de passe fort
- Ajoutez votre clé Google API si disponible

### 4. Créer le dossier uploads

```bash
mkdir backend/uploads
```

## Lancement du projet en développement

### Option 1 : Lancer frontend + backend ensemble (recommandé)

Depuis la racine :
```bash
npm run dev
```

Cela lance automatiquement :
- ✅ Frontend sur `http://localhost:5173`
- ✅ Backend sur `http://localhost:3000`

### Option 2 : Lancer séparément

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

## Tester l'application

1. **Ouvrir le navigateur** : `http://localhost:5173`

2. **Tester le parcours utilisateur** :
   - Cliquer sur "J'ai laissé un avis"
   - Remplir le formulaire
   - Tourner la roue
   - Récupérer la récompense

3. **Accéder au tableau de bord admin** :
   - Aller sur `http://localhost:5173/admin`
   - Login : `admin`
   - Mot de passe : `changeme` (ou celui que vous avez défini)

## Problèmes courants

### Erreur "Port already in use"
Le port 3000 ou 5173 est déjà utilisé. Arrêtez les autres processus ou changez le port dans les fichiers de configuration.

### Erreur "Cannot find module"
Relancez `npm run install-all` depuis la racine.

### Base de données vide
La base SQLite se crée automatiquement au premier lancement. Si elle est corrompue, supprimez `backend/database.sqlite` et relancez.

### Uploads ne fonctionnent pas
Vérifiez que le dossier `backend/uploads` existe et a les bonnes permissions.

## Commandes utiles

```bash
# Installer les dépendances
npm run install-all

# Lancer en mode dev (frontend + backend)
npm run dev

# Lancer uniquement le frontend
npm run dev:frontend

# Lancer uniquement le backend
npm run dev:backend

# Build du frontend pour production
cd frontend && npm run build

# Démarrer le backend en production
cd backend && npm start
```

## Prochaines étapes

1. **Personnaliser le design** : Modifier les couleurs dans `frontend/src/index.css`

2. **Configurer l'API Google My Business** : 
   - Obtenir une clé API sur Google Cloud Console
   - L'ajouter dans `backend/.env`

3. **Configurer l'envoi d'emails** :
   - Créer un compte SendGrid
   - Ajouter la clé API dans `backend/.env`

4. **Modifier les récompenses** :
   - Éditer `frontend/src/pages/WheelOfFortune.jsx` (frontend)
   - Éditer `backend/src/routes/rewards.js` (backend)

5. **Changer le lien Google My Business** :
   - Aller dans `frontend/src/pages/Home.jsx`
   - Remplacer `YOUR_GOOGLE_PLACE_ID` par votre ID

## Déploiement en production

### Frontend (Vercel - gratuit)

Le site sera accessible sur **maisongiel.net**

```bash
cd frontend
npm install -g vercel
vercel --prod
```

Après le déploiement, configurez votre domaine personnalisé dans Vercel :
1. Allez dans les paramètres du projet Vercel
2. Section "Domains"
3. Ajoutez `maisongiel.net` et `www.maisongiel.net`
4. Suivez les instructions pour configurer vos DNS

### Backend (Heroku, Railway, ou serveur VPS)

**Avec Heroku :**
```bash
cd backend
heroku create maison-giel-api
git push heroku main
```

**Variables d'environnement à configurer en production :**
- `NODE_ENV=production`
- `JWT_SECRET` (nouvelle clé sécurisée)
- `ADMIN_PASSWORD` (mot de passe fort)
- `FRONTEND_URL=https://maisongiel.net`

## Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans le terminal
2. Consultez la documentation dans `README.md`
3. Vérifiez que toutes les dépendances sont installées

---

✨ **Bon développement !**
