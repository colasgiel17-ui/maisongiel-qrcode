# Site Web QR Code - Avis Google & Roue de la Chance

Site web interactif permettant aux utilisateurs de scanner un QR code, laisser un avis Google, puis participer à une roue de la chance pour gagner des récompenses.

## 🚀 Fonctionnalités

- ✅ Page d'accueil avec QR code
- ✅ Vérification des avis Google (lien ou screenshot)
- ✅ Roue de la chance interactive
- ✅ Génération de codes promo et bons PDF
- ✅ Tableau de bord administrateur
- ✅ Protection anti-fraude (limite 1 participation/utilisateur)
- ✅ Conforme RGPD

## 🛠️ Technologies

### Frontend
- React 18 + Vite
- React Router pour la navigation
- Framer Motion pour les animations
- Axios pour les appels API
- QRCode.react pour les QR codes

### Backend
- Node.js + Express
- PostgreSQL ou SQLite (base de données)
- JWT pour l'authentification
- Multer pour l'upload de fichiers
- PDFKit pour générer les bons

## 📦 Installation

### Prérequis
- Node.js 18+ ([Télécharger](https://nodejs.org/))
- Git ([Télécharger](https://git-scm.com/))
- VS Code ([Télécharger](https://code.visualstudio.com/))

### Étapes

1. **Cloner le projet**
```bash
cd "/Users/g.colas/Desktop/site web/travail/maisongiel/siteqrcode"
```

2. **Installer les dépendances**
```bash
npm run install-all
```

3. **Configuration**
- Copier `.env.example` vers `.env` dans `/backend`
- Remplir les variables d'environnement

4. **Lancer en mode développement**
```bash
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`
Le backend sur `http://localhost:3000`

## 📁 Structure du projet

```
siteqrcode/
├── frontend/              # Application React
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── pages/         # Pages (Accueil, Roue, Admin)
│   │   ├── services/      # Appels API
│   │   ├── utils/         # Utilitaires
│   │   └── App.jsx
│   └── package.json
├── backend/               # API Node.js
│   ├── src/
│   │   ├── routes/        # Routes API
│   │   ├── controllers/   # Logique métier
│   │   ├── models/        # Modèles de données
│   │   ├── middleware/    # Middleware (auth, etc.)
│   │   └── server.js
│   └── package.json
└── README.md
```

## 🎯 Utilisation

### Pour les utilisateurs
1. Scanner le QR code sur le flyer
2. Laisser un avis Google
3. Copier le lien de l'avis ou faire une capture d'écran
4. Faire tourner la roue de la chance
5. Récupérer la récompense (code promo ou bon PDF)

### Pour l'administrateur
- Accéder au tableau de bord : `/admin`
- Login par défaut : `admin` / `changeme` (à modifier !)

## 🔒 Sécurité

- Limite d'1 participation par utilisateur (vérification par IP + device fingerprint)
- Validation des avis Google
- Protection CSRF
- Rate limiting sur l'API
- Données sensibles chiffrées

## 📊 RGPD

- Consentement explicite pour la collecte de données
- Politique de confidentialité intégrée
- Droit d'accès et de suppression des données

## 🚀 Déploiement

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

Configuration du domaine **maisongiel.net** :
1. Dans Vercel, allez dans Settings → Domains
2. Ajoutez `maisongiel.net` et `www.maisongiel.net`
3. Configurez vos DNS selon les instructions Vercel

### Backend (Heroku)
```bash
cd backend
git push heroku main
```

**Variables d'environnement à configurer en production :**
- `NODE_ENV=production`
- `JWT_SECRET` (nouvelle clé sécurisée)
- `ADMIN_PASSWORD` (mot de passe fort)
- `FRONTEND_URL=https://maisongiel.net`

## 📝 TODO / Améliorations futures

- [ ] Intégration API Google My Business (si accès)
- [ ] Notifications email/SMS (SendGrid/Twilio)
- [ ] Analyse d'image IA pour valider les screenshots
- [ ] Système de parrainage
- [ ] Multi-langues
- [ ] Mode sombre

## 🤝 Support

Pour toute question ou problème, créer une issue sur le projet.

## 📄 Licence

MIT
