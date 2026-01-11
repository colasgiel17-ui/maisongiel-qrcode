# 🚀 Guide de Déploiement sur Serveur Ubuntu

## Prérequis

### Logiciels nécessaires
```bash
# Node.js (v18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Nginx
sudo apt update
sudo apt install nginx

# PM2
sudo npm install -g pm2

# Certbot (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
```

## Installation Initiale

### 1. Créer la structure de dossiers
```bash
sudo mkdir -p /home/colas/maisongiel
cd /home/colas/maisongiel
```

### 2. Copier les fichiers du projet
```bash
# Depuis votre machine de développement
scp -r ./frontend colas@votre-ip:/home/colas/maisongiel/
scp -r ./backend colas@votre-ip:/home/colas/maisongiel/
```

### 3. Configurer le backend
```bash
cd /home/colas/maisongiel/backend
cp .env.production .env
nano .env  # Modifier JWT_SECRET et ADMIN_PASSWORD
npm install --production
mkdir uploads logs
chmod 755 uploads logs
```

### 4. Build du frontend
```bash
cd /home/colas/maisongiel/frontend
npm install
npm run build
```

### 5. Configurer Nginx
```bash
# Copier la configuration
sudo cp /home/colas/maisongiel/nginx.conf /etc/nginx/sites-available/maisongiel.net

# Créer le lien symbolique
sudo ln -s /etc/nginx/sites-available/maisongiel.net /etc/nginx/sites-enabled/

# Supprimer la config par défaut
sudo rm /etc/nginx/sites-enabled/default

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

### 6. Configurer DuckDNS
```bash
# Créer un script pour mettre à jour l'IP
nano /home/colas/duckdns-update.sh
```

Contenu du script :
```bash
#!/bin/bash
echo url="https://www.duckdns.org/update?domains=VOTRE-DOMAINE&token=VOTRE-TOKEN&ip=" | curl -k -o /home/colas/duckdns.log -K -
```

```bash
chmod +x /home/colas/duckdns-update.sh

# Ajouter au crontab (toutes les 5 minutes)
crontab -e
# Ajouter : */5 * * * * /home/colas/duckdns-update.sh
```

### 7. Obtenir le certificat SSL
```bash
sudo certbot --nginx -d maisongiel.net -d www.maisongiel.net

# Renouvellement automatique (déjà configuré par Certbot)
sudo certbot renew --dry-run
```

### 8. Démarrer le backend avec PM2
```bash
cd /home/colas/maisongiel/backend
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Suivre les instructions affichées
```

## Déploiement Automatique

### Méthode 1 : Script de déploiement
```bash
chmod +x /home/colas/maisongiel/deploy.sh
./deploy.sh
```

### Méthode 2 : Déploiement manuel
```bash
# 1. Arrêter le backend
pm2 stop maisongiel-backend

# 2. Mettre à jour le code
cd /home/colas/maisongiel
# git pull origin main  # Si vous utilisez Git

# 3. Installer les dépendances
cd backend && npm install --production
cd ../frontend && npm install && npm run build

# 4. Redémarrer
cd ../backend
pm2 restart maisongiel-backend
pm2 save

# 5. Recharger Nginx
sudo nginx -t && sudo systemctl reload nginx
```

## Maintenance

### Consulter les logs
```bash
# Logs PM2
pm2 logs maisongiel-backend

# Logs Nginx
sudo tail -f /var/log/nginx/maisongiel_access.log
sudo tail -f /var/log/nginx/maisongiel_error.log

# Logs backend
tail -f /home/colas/maisongiel/backend/logs/combined.log
```

### Redémarrer les services
```bash
# Backend
pm2 restart maisongiel-backend

# Nginx
sudo systemctl restart nginx

# Tout redémarrer
pm2 restart all && sudo systemctl restart nginx
```

### Sauvegarder la base de données
```bash
# Sauvegarde manuelle
cp /home/colas/maisongiel/backend/database.sqlite \
   /home/colas/maisongiel/backend/database.sqlite.backup.$(date +%Y%m%d)

# Sauvegarde automatique (crontab)
crontab -e
# Ajouter : 0 2 * * * cp /home/colas/maisongiel/backend/database.sqlite /home/colas/backups/db-$(date +\%Y\%m\%d).sqlite
```

### Mettre à jour Node.js
```bash
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
pm2 restart all
```

## Sécurité

### Firewall (UFW)
```bash
sudo ufw enable
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw status
```

### Permissions
```bash
# Définir les bonnes permissions
sudo chown -R colas:colas /home/colas/maisongiel
chmod 755 /home/colas/maisongiel/backend/uploads
chmod 600 /home/colas/maisongiel/backend/.env
```

### Surveillance
```bash
# Installer Monit (optionnel)
sudo apt install monit

# Configurer pour surveiller PM2 et Nginx
```

## Résolution de Problèmes

### Le site ne charge pas
```bash
# Vérifier Nginx
sudo nginx -t
sudo systemctl status nginx

# Vérifier PM2
pm2 status
pm2 logs maisongiel-backend --err

# Vérifier les permissions
ls -la /home/colas/maisongiel/frontend/dist
```

### Erreurs 502 Bad Gateway
```bash
# Vérifier que le backend tourne
pm2 status

# Vérifier le port
sudo netstat -tulpn | grep :3000

# Redémarrer le backend
pm2 restart maisongiel-backend
```

### Certificat SSL expiré
```bash
sudo certbot renew
sudo systemctl reload nginx
```

## Checklist de Déploiement

- [ ] Node.js installé (v18+)
- [ ] Nginx installé et configuré
- [ ] PM2 installé
- [ ] Fichiers du projet copiés sur le serveur
- [ ] `.env` configuré avec des valeurs sécurisées
- [ ] Dossiers `uploads` et `logs` créés avec bonnes permissions
- [ ] Frontend buildé (`npm run build`)
- [ ] Backend démarré avec PM2
- [ ] Nginx configuré et redémarré
- [ ] DuckDNS configuré (si IP dynamique)
- [ ] Certificat SSL installé avec Let's Encrypt
- [ ] Firewall configuré (UFW)
- [ ] Sauvegardes automatiques configurées
- [ ] PM2 configuré pour démarrer au boot
- [ ] Test du site depuis un autre appareil

## URLs de Test

- **Site** : https://maisongiel.net
- **API Health** : https://maisongiel.net/api/health
- **Admin** : https://maisongiel.net/admin

## Support

Pour toute question, consultez les logs en premier :
```bash
pm2 logs maisongiel-backend
sudo tail -f /var/log/nginx/maisongiel_error.log
```
