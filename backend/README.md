# Backend API - Maison Giel QR Code

## Architecture

```
backend/
├── src/
│   ├── routes/          # Routes API
│   │   ├── reviews.js   # Soumission des avis
│   │   ├── rewards.js   # Gestion des récompenses
│   │   └── admin.js     # Tableau de bord admin
│   ├── utils/           # Utilitaires
│   │   └── helpers.js   # Fonctions helper
│   ├── database.js      # Gestion SQLite
│   └── server.js        # Point d'entrée
├── uploads/             # Fichiers uploadés
├── .env                 # Configuration
└── package.json
```

## API Endpoints

### Reviews (Avis)

#### `POST /api/reviews/submit`
Soumettre un avis Google.

**Body (multipart/form-data):**
```json
{
  "name": "Jean Dupont",
  "email": "jean@email.com",
  "reviewLink": "https://goo.gl/maps/...",
  "screenshot": "<file>"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Rewards (Récompenses)

#### `POST /api/rewards/spin`
Faire tourner la roue.

**Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "success": true,
  "reward": {
    "id": 1,
    "label": "☕ Café offert",
    "type": "COFFEE"
  },
  "code": "MG-ABC123XYZ",
  "expiresAt": "2024-12-31T23:59:59.000Z"
}
```

#### `POST /api/rewards/redeem`
Utiliser/valider un code de récompense.

**Body:**
```json
{
  "code": "MG-ABC123XYZ"
}
```

### Admin

#### `POST /api/admin/login`
Connexion administrateur.

**Body:**
```json
{
  "username": "admin",
  "password": "changeme"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "admin": {
    "id": 1,
    "username": "admin"
  }
}
```

#### `GET /api/admin/stats`
Statistiques globales (nécessite authentification).

**Headers:**
```
Authorization: Bearer <token>
```

#### `GET /api/admin/reviews`
Liste des avis (nécessite authentification).

#### `GET /api/admin/rewards`
Liste des récompenses (nécessite authentification).

## Base de données

### Table `reviews`
```sql
id, name, email, reviewLink, screenshotPath, 
ipAddress, deviceFingerprint, verified, createdAt
```

### Table `rewards`
```sql
id, reviewId, rewardType, rewardLabel, code, 
used, usedAt, expiresAt, createdAt
```

### Table `admins`
```sql
id, username, passwordHash, createdAt
```

## Sécurité

- ✅ Rate limiting (100 requêtes / 15 min par défaut)
- ✅ Helmet.js pour les headers HTTP
- ✅ CORS configuré
- ✅ JWT pour l'authentification
- ✅ Validation des inputs (express-validator)
- ✅ Upload sécurisé (Multer avec filtres)
- ✅ Bcrypt pour les mots de passe

## Variables d'environnement

Voir `.env.example` pour la liste complète.

## Développement

```bash
# Lancer en mode dev (auto-reload)
npm run dev

# Lancer en production
npm start
```

## Tests

Pour tester l'API manuellement, utilisez :
- **Postman** : Importer la collection d'endpoints
- **curl** : Exemples ci-dessous

### Exemple : Soumettre un avis
```bash
curl -X POST http://localhost:3000/api/reviews/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@email.com",
    "reviewLink": "https://goo.gl/maps/test"
  }'
```

## Déploiement

### Heroku
```bash
heroku create
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=<votre-secret>
git push heroku main
```

### Railway / Render
1. Connecter le repo GitHub
2. Configurer les variables d'environnement
3. Déployer automatiquement

## Migration vers PostgreSQL (Production)

Pour passer de SQLite à PostgreSQL en production :

1. Installer `pg` : `npm install pg`
2. Modifier `database.js` pour utiliser PostgreSQL
3. Mettre à jour les variables d'environnement
