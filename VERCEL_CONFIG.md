# Configuration pour Vercel.com

## Build Command
npm run build

## Output Directory
dist

## Install Command
npm install

## Variables d'environnement à ajouter sur Vercel :
VITE_API_URL=https://votre-backend.onrender.com

## Configuration du domaine :
1. Allez dans Settings → Domains
2. Ajoutez maisongiel.net
3. Configurez vos DNS selon les instructions Vercel

## Notes :
- Le build se fait automatiquement à chaque push sur GitHub
- Redéploiement instantané (~30 secondes)
- CDN global pour des performances optimales
