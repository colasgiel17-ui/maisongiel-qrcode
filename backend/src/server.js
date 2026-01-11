require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const path = require('path')

const db = require('./database')
const reviewRoutes = require('./routes/reviews')
const rewardRoutes = require('./routes/rewards')
const adminRoutes = require('./routes/admin')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware de sécurité
app.use(helmet())

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'https://maisongiel.net',
  'https://www.maisongiel.net'
]

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.'
      return callback(new Error(msg), false)
    }
    return callback(null, true)
  },
  credentials: true
}))

// Rate limiting global
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
})
app.use('/api/', limiter)

// Parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Dossier uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Routes API
app.use('/api/reviews', reviewRoutes)
app.use('/api/rewards', rewardRoutes)
app.use('/api/admin', adminRoutes)

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' })
})

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// Initialisation de la base de données et démarrage du serveur
db.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
      console.log(`📊 Environment: ${process.env.NODE_ENV}`)
      console.log(`🔗 Frontend: ${process.env.FRONTEND_URL}`)
    })
  })
  .catch(err => {
    console.error('Failed to initialize database:', err)
    process.exit(1)
  })

module.exports = app
