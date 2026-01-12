const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const db = require('../database/init')

// Middleware d'authentification
const auth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Non autorisé' })
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Token invalide' })
  }
}

// 🔐 Login admin
router.post('/login', (req, res) => {
  const { username, password } = req.body

  const validUsername = process.env.ADMIN_USERNAME || 'admin'
  const validPassword = process.env.ADMIN_PASSWORD || 'admin123'

  if (username === validUsername && password === validPassword) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '24h' })
    
    res.json({
      success: true,
      token
    })
  } else {
    res.status(401).json({
      success: false,
      message: 'Identifiants incorrects'
    })
  }
})

// 📊 Statistiques
router.get('/stats', auth, (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN reward_used = 1 THEN 1 END) as used,
        COUNT(CASE WHEN reward_used = 0 AND reward_code IS NOT NULL THEN 1 END) as pending
      FROM participations
    `).get()

    res.json({ success: true, stats })
  } catch (error) {
    console.error('Erreur stats:', error)
    res.status(500).json({ success: false, message: 'Erreur serveur' })
  }
})

// 📋 Liste des participations
router.get('/participations', auth, (req, res) => {
  try {
    const participations = db.prepare(`
      SELECT * FROM participations 
      ORDER BY created_at DESC
    `).all()

    res.json({ success: true, participations })
  } catch (error) {
    console.error('Erreur participations:', error)
    res.status(500).json({ success: false, message: 'Erreur serveur' })
  }
})

// ✅ Valider une récompense (scanner QR)
router.post('/validate', auth, (req, res) => {
  try {
    const { code } = req.body

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Code manquant'
      })
    }

    // Chercher la participation
    const participation = db.prepare(`
      SELECT * FROM participations 
      WHERE reward_code = ?
    `).get(code)

    if (!participation) {
      return res.status(404).json({
        success: false,
        message: 'Code invalide'
      })
    }

    if (participation.reward_used === 1) {
      return res.status(400).json({
        success: false,
        message: 'Récompense déjà utilisée'
      })
    }

    // Marquer comme utilisée
    db.prepare(`
      UPDATE participations 
      SET reward_used = 1,
          used_at = CURRENT_TIMESTAMP
      WHERE reward_code = ?
    `).run(code)

    console.log('✅ Récompense validée:', code)

    res.json({
      success: true,
      name: participation.name,
      reward: participation.reward_type
    })

  } catch (error) {
    console.error('Erreur validation:', error)
    res.status(500).json({ success: false, message: 'Erreur serveur' })
  }
})

module.exports = router
