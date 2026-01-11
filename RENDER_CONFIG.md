# Configuration pour Render.com

## Build Command
npm install

## Start Command  
npm start

## Variables d'environnement à ajouter sur Render :
NODE_ENV=production
JWT_SECRET=votre-cle-secrete-tres-securisee-changez-moi
ADMIN_USERNAME=admin
ADMIN_PASSWORD=votre-mot-de-passe-fort
FRONTEND_URL=https://votre-site.vercel.app
PORT=3000

## Notes importantes :
- SQLite fonctionne sur Render MAIS les données seront perdues à chaque redémarrage
- Pour une base persistante, utilisez PostgreSQL (Neon.tech gratuit)
- Le serveur s'endort après 15 min d'inactivité (offre gratuite)
- Premier démarrage : ~30 secondes
