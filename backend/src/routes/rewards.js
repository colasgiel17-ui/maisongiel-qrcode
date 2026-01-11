const express = require('express')
const router = express.Router()
const db = require('../database')
const { verifyToken, generateRewardCode } = require('../utils/helpers')

// Définition des récompenses avec probabilités
const REWARDS = [
  { id: 1, label: '☕ Café offert', type: 'COFFEE', probability: 0.24 },
  { id: 2, label: '💰 2€', type: 'DISCOUNT_2', probability: 0.25 },
  { id: 3, label: '💰 1€', type: 'DISCOUNT_1', probability: 0.35 },
  { id: 4, label: '🥤 Boisson offerte', type: 'DRINK', probability: 0.15 },
  { id: 5, label: '🍰 Pâtisserie offerte', type: 'PASTRY', probability: 0.01 }
]

// Fonction pour sélectionner une récompense basée sur les probabilités
function selectReward() {
  const random = Math.random()
  let cumulative = 0
  
  for (const reward of REWARDS) {
    cumulative += reward.probability
    if (random <= cumulative) {
      return reward
    }
  }
  
  return REWARDS[0] // Fallback
}

// Faire tourner la roue et obtenir une récompense
router.post('/spin', async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ 
        success: false,
        message: 'Token manquant'
      })
    }

    // Vérifier le token
    const decoded = verifyToken(token)
    if (!decoded) {
      return res.status(401).json({ 
        success: false,
        message: 'Token invalide ou expiré'
      })
    }

    const reviewId = decoded.reviewId

    // Vérifier si l'utilisateur a déjà obtenu une récompense
    const existingReward = await db.get(
      'SELECT id FROM rewards WHERE reviewId = ?',
      [reviewId]
    )

    if (existingReward) {
      return res.status(409).json({ 
        success: false,
        message: 'Vous avez déjà réclamé votre récompense'
      })
    }

    // Sélectionner une récompense aléatoire
    const selectedReward = selectReward()
    const rewardCode = generateRewardCode()
    
    // Calculer la date d'expiration
    const validityDays = parseInt(process.env.REWARD_VALIDITY_DAYS) || 30
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + validityDays)

    // Insérer la récompense dans la base de données
    await db.run(
      `INSERT INTO rewards (reviewId, rewardType, rewardLabel, code, expiresAt)
       VALUES (?, ?, ?, ?, ?)`,
      [reviewId, selectedReward.type, selectedReward.label, rewardCode, expiresAt.toISOString()]
    )

    res.json({
      success: true,
      reward: {
        id: selectedReward.id,
        label: selectedReward.label,
        type: selectedReward.type
      },
      code: rewardCode,
      expiresAt: expiresAt.toISOString()
    })

  } catch (error) {
    console.error('Error spinning wheel:', error)
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors du tirage de la récompense'
    })
  }
})

// Vérifier/utiliser un code de récompense
router.post('/redeem', async (req, res) => {
  try {
    const { code } = req.body

    if (!code) {
      return res.status(400).json({ 
        success: false,
        message: 'Code manquant'
      })
    }

    // Rechercher la récompense
    const reward = await db.get(
      'SELECT * FROM rewards WHERE code = ?',
      [code]
    )

    if (!reward) {
      return res.status(404).json({ 
        success: false,
        message: 'Code invalide'
      })
    }

    // Vérifier si déjà utilisé
    if (reward.used) {
      return res.status(409).json({ 
        success: false,
        message: 'Ce code a déjà été utilisé'
      })
    }

    // Vérifier l'expiration
    if (new Date(reward.expiresAt) < new Date()) {
      return res.status(410).json({ 
        success: false,
        message: 'Ce code a expiré'
      })
    }

    // Marquer comme utilisé
    await db.run(
      'UPDATE rewards SET used = 1, usedAt = CURRENT_TIMESTAMP WHERE code = ?',
      [code]
    )

    res.json({
      success: true,
      message: 'Récompense validée',
      reward: {
        label: reward.rewardLabel,
        type: reward.rewardType
      }
    })

  } catch (error) {
    console.error('Error redeeming reward:', error)
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la validation du code'
    })
  }
})

module.exports = router
