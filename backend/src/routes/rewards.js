const express = require('express')
const router = express.Router()
const db = require('../database/init')

// Fonction pour générer un code unique
function generateCode() {
  return 'MG-' + Math.random().toString(36).substr(2, 8).toUpperCase()
}

// 📝 ÉTAPE 1 : Soumettre nom/email
router.post('/start', async (req, res) => {
  try {
    const { name, email } = req.body

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nom et email requis'
      })
    }

    // Vérifier si déjà participé
    const existing = db.prepare('SELECT * FROM participations WHERE email = ?').get(email)
    
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà participé avec cet email'
      })
    }

    // Créer une session temporaire
    const sessionId = generateCode()
    
    // Enregistrer la session (sans récompense pour l'instant)
    db.prepare(`
      INSERT INTO participations (
        user_id, name, email, created_at
      ) VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `).run(sessionId, name, email)

    console.log('✅ Session créée:', sessionId, 'pour', email)

    res.json({
      success: true,
      sessionId: sessionId,
      googleMapsUrl: 'https://g.page/r/VOTRE_PLACE_ID/review' // À remplacer
    })

  } catch (error) {
    console.error('❌ Erreur /start:', error)
    res.status(500).json({ success: false, message: 'Erreur serveur' })
  }
})

// 🎡 ÉTAPE 2 : Tourner la roue
router.post('/spin', async (req, res) => {
  try {
    const { sessionId } = req.body

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session invalide'
      })
    }

    // Vérifier que la session existe et n'a pas déjà de récompense
    const participation = db.prepare(
      'SELECT * FROM participations WHERE user_id = ?'
    ).get(sessionId)

    if (!participation) {
      return res.status(400).json({
        success: false,
        message: 'Session introuvable'
      })
    }

    if (participation.reward_type) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà tourné la roue'
      })
    }

    // Récompenses
    const rewards = [
      { label: 'Café offert', probability: 30 },
      { label: 'Boisson offerte', probability: 25 },
      { label: 'Pâtisserie offerte', probability: 20 },
      { label: '1€ de réduction', probability: 15 },
      { label: '2€ de réduction', probability: 10 }
    ]

    // Sélection aléatoire
    const total = rewards.reduce((sum, r) => sum + r.probability, 0)
    let random = Math.random() * total
    
    let selected = rewards[0]
    for (const reward of rewards) {
      random -= reward.probability
      if (random <= 0) {
        selected = reward
        break
      }
    }

    // Générer le code QR unique
    const rewardCode = generateCode()

    // Mettre à jour avec la récompense
    db.prepare(`
      UPDATE participations 
      SET reward_type = ?, 
          reward_code = ?,
          reward_used = 0
      WHERE user_id = ?
    `).run(selected.label, rewardCode, sessionId)

    console.log('🎁 Récompense attribuée:', selected.label, 'Code:', rewardCode)

    res.json({
      success: true,
      reward: selected,
      code: rewardCode,
      name: participation.name
    })

  } catch (error) {
    console.error('❌ Erreur /spin:', error)
    res.status(500).json({ success: false, message: 'Erreur serveur' })
  }
})

module.exports = router
