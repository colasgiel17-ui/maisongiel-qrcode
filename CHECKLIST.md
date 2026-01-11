# ✅ Checklist de Déploiement - Maison Giel

## Avant le Déploiement

### Infrastructure
- [ ] Serveur Ubuntu accessible via SSH
- [ ] Node.js v18+ installé
- [ ] Nginx installé
- [ ] PM2 installé globalement
- [ ] Certbot installé
- [ ] UFW (firewall) configuré

### Configuration DNS/Domaine
- [ ] DuckDNS configuré (si IP dynamique)
- [ ] Nom de domaine maisongiel.net pointé vers l'IP du serveur
- [ ] Script de mise à jour DuckDNS dans crontab

### Sécurité
- [ ] `.env` avec JWT_SECRET sécurisé (minimum 32 caractères aléatoires)
- [ ] ADMIN_PASSWORD fort et unique
- [ ] Permissions fichiers correctes (chmod 600 pour .env)
- [ ] Firewall activé (ports 22, 80, 443 uniquement)

## Déploiement

### Backend
- [ ] Code copié dans `/home/colas/maisongiel/backend/`
- [ ] `npm install --production` exécuté
- [ ] Dossier `uploads/` créé avec chmod 755
- [ ] Dossier `logs/` créé avec chmod 755
- [ ] `.env` configuré à partir de `.env.production`
- [ ] `ecosystem.config.js` en place
- [ ] PM2 démarré : `pm2 start ecosystem.config.js`
- [ ] PM2 sauvegardé : `pm2 save`
- [ ] PM2 auto-start configuré : `pm2 startup`

### Frontend
- [ ] Code copié dans `/home/colas/maisongiel/frontend/`
- [ ] `npm install` exécuté
- [ ] Build production : `npm run build`
- [ ] Dossier `dist/` généré avec les fichiers statiques
- [ ] Vérification que `index.html` existe dans `dist/`

### Nginx
- [ ] Fichier de config copié dans `/etc/nginx/sites-available/`
- [ ] Lien symbolique créé dans `/etc/nginx/sites-enabled/`
- [ ] Config par défaut supprimée
- [ ] Test config : `sudo nginx -t` → OK
- [ ] Nginx redémarré : `sudo systemctl restart nginx`

### SSL/HTTPS
- [ ] Certificat Let's Encrypt obtenu : `sudo certbot --nginx -d maisongiel.net`
- [ ] Renouvellement automatique testé : `sudo certbot renew --dry-run`
- [ ] HTTPS forcé (redirection 301 configurée)

## Tests Post-Déploiement

### Tests de Base
- [ ] Site accessible : https://maisongiel.net
- [ ] Redirection HTTP → HTTPS fonctionne
- [ ] Page d'accueil charge correctement
- [ ] Pas d'erreurs dans la console navigateur (F12)
- [ ] CSS et images chargés correctement

### Tests Backend/API
- [ ] API Health check : https://maisongiel.net/api/health
- [ ] Test soumission formulaire
- [ ] Test upload de fichier (screenshot)
- [ ] Test roue de la chance
- [ ] Test page de récompense

### Tests Admin
- [ ] Login admin fonctionne : https://maisongiel.net/admin
- [ ] Statistiques s'affichent
- [ ] Liste des avis visible
- [ ] Modal de détails fonctionne
- [ ] Upload d'images visible

### Tests Mobile
- [ ] Site responsive sur téléphone
- [ ] Formulaire utilisable sur mobile
- [ ] Roue tourne correctement
- [ ] Pas de zoom indésirable

### Tests Réseau Local
- [ ] Site accessible depuis un autre appareil sur le même réseau
- [ ] Pas d'erreurs CORS
- [ ] Uploads fonctionnent

## Surveillance

### Logs
- [ ] Logs PM2 consultables : `pm2 logs`
- [ ] Logs Nginx accessibles : `/var/log/nginx/maisongiel_*.log`
- [ ] Pas d'erreurs critiques dans les logs

### Performance
- [ ] Temps de chargement < 3s
- [ ] Compression Gzip active
- [ ] Cache navigateur configuré
- [ ] Images optimisées

### Sécurité
- [ ] Headers de sécurité présents (HSTS, CSP, etc.)
- [ ] Certificat SSL valide et reconnu
- [ ] Pas de données sensibles exposées
- [ ] `.env` non accessible publiquement

## Maintenance

### Sauvegardes
- [ ] Sauvegarde manuelle base de données testée
- [ ] Crontab configuré pour sauvegardes automatiques
- [ ] Script de sauvegarde testé

### Monitoring
- [ ] PM2 redémarre automatiquement en cas de crash
- [ ] Nginx redémarre au reboot du serveur
- [ ] DuckDNS se met à jour régulièrement

### Documentation
- [ ] `DEPLOY.md` à jour
- [ ] Mots de passe documentés (dans un gestionnaire sécurisé)
- [ ] Procédures de restauration documentées

## En Cas de Problème

### Commandes de Dépannage
```bash
# Statut des services
pm2 status
sudo systemctl status nginx

# Logs en temps réel
pm2 logs maisongiel-backend --lines 100
sudo tail -f /var/log/nginx/maisongiel_error.log

# Redémarrer tout
pm2 restart all
sudo systemctl restart nginx

# Tester la config Nginx
sudo nginx -t
```

### Rollback
```bash
# Restaurer la base de données
cp /home/colas/maisongiel/backend/database.sqlite.backup.YYYYMMDD \
   /home/colas/maisongiel/backend/database.sqlite

# Redémarrer
pm2 restart maisongiel-backend
```

## Validation Finale

- [ ] **Tout fonctionne sans erreur**
- [ ] **Site accessible depuis l'extérieur**
- [ ] **HTTPS valide et sécurisé**
- [ ] **Performances acceptables**
- [ ] **Sauvegardes configurées**
- [ ] **Monitoring en place**

---

**Date du déploiement** : __________  
**Validé par** : __________  
**Notes** : 
