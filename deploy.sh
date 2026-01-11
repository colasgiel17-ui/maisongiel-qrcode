#!/bin/bash

# Script de déploiement automatique pour Maison Giel
# Usage: ./deploy.sh

set -e

echo "🚀 Démarrage du déploiement..."

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
PROJECT_DIR="/home/colas/maisongiel"
FRONTEND_DIR="$PROJECT_DIR/frontend"
BACKEND_DIR="$PROJECT_DIR/backend"

# 1. Arrêter le backend
echo -e "${YELLOW}⏸️  Arrêt du backend...${NC}"
pm2 stop maisongiel-backend || true

# 2. Sauvegarder la base de données
echo -e "${YELLOW}💾 Sauvegarde de la base de données...${NC}"
if [ -f "$BACKEND_DIR/database.sqlite" ]; then
    cp "$BACKEND_DIR/database.sqlite" "$BACKEND_DIR/database.sqlite.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${GREEN}✅ Sauvegarde créée${NC}"
fi

# 3. Mettre à jour le code
echo -e "${YELLOW}📥 Mise à jour du code...${NC}"
cd $PROJECT_DIR
# git pull origin main  # Décommentez si vous utilisez Git

# 4. Installer les dépendances backend
echo -e "${YELLOW}📦 Installation des dépendances backend...${NC}"
cd $BACKEND_DIR
npm install --production

# 5. Build du frontend
echo -e "${YELLOW}🏗️  Build du frontend...${NC}"
cd $FRONTEND_DIR
npm install
npm run build

# 6. Créer le dossier uploads si nécessaire
echo -e "${YELLOW}📁 Vérification du dossier uploads...${NC}"
mkdir -p $BACKEND_DIR/uploads
mkdir -p $BACKEND_DIR/logs
chmod 755 $BACKEND_DIR/uploads
chmod 755 $BACKEND_DIR/logs

# 7. Copier le .env de production
echo -e "${YELLOW}⚙️  Configuration de l'environnement...${NC}"
if [ -f "$BACKEND_DIR/.env.production" ]; then
    cp "$BACKEND_DIR/.env.production" "$BACKEND_DIR/.env"
    echo -e "${GREEN}✅ .env configuré${NC}"
fi

# 8. Redémarrer le backend avec PM2
echo -e "${YELLOW}🔄 Redémarrage du backend...${NC}"
cd $BACKEND_DIR
pm2 start ecosystem.config.js
pm2 save

# 9. Recharger Nginx
echo -e "${YELLOW}🔄 Rechargement de Nginx...${NC}"
sudo nginx -t && sudo systemctl reload nginx

# 10. Vérification
echo -e "${YELLOW}🔍 Vérification des services...${NC}"
pm2 status
sudo systemctl status nginx --no-pager

echo -e "${GREEN}✅ Déploiement terminé avec succès !${NC}"
echo -e "${GREEN}🌐 Site accessible sur : https://maisongiel.net${NC}"

# Afficher les logs
echo -e "${YELLOW}📋 Logs en temps réel (Ctrl+C pour quitter):${NC}"
pm2 logs maisongiel-backend --lines 50
