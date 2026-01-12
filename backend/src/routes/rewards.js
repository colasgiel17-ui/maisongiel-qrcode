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
      googleMapsUrl: 'https://www.google.com/maps/place/Boulangerie+P%C3%A2tisserie+Maison+Giel+Saint-Yrieix-Sur-Charente/@45.6771281,0.1186605,601m/data=!3m2!1e3!4b1!4m6!3m5!1s0x47fe2fcf4f8a3a2b:0xdd9957b5f6e04651!8m2!3d45.6771244!4d0.1212354!16s%2Fg%2F11w4xsl4_r?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoASAFQAw%3D%3D'
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

// ✅ ÉTAPE 1.5 : Vérifier le lien d'avis
router.post('/verify-review', async (req, res) => {
  try {
    const { sessionId, reviewLink } = req.body

    if (!sessionId || !reviewLink) {
      return res.status(400).json({
        success: false,
        message: 'SessionId et lien requis'
      })
    }

    // Vérifier que la session existe
    const participation = db.prepare(
      'SELECT * FROM participations WHERE user_id = ?'
    ).get(sessionId)

    if (!participation) {
      return res.status(400).json({
        success: false,
        message: 'Session introuvable'
      })
    }

    // Vérifier que le lien contient "google" et "review" ou "reviews"
    const isValidLink = reviewLink.includes('google') && 
                       (reviewLink.includes('review') || reviewLink.includes('place'))

    if (!isValidLink) {
      return res.status(400).json({
        success: false,
        message: 'Le lien ne semble pas être un lien Google valide'
      })
    }

    // Enregistrer le lien
    db.prepare(`
      UPDATE participations 
      SET review_link = ?
      WHERE user_id = ?
    `).run(reviewLink, sessionId)

    console.log('✅ Avis vérifié pour:', sessionId)

    res.json({
      success: true,
      message: 'Avis vérifié ! Vous pouvez maintenant tourner la roue'
    })

  } catch (error) {
    console.error('❌ Erreur /verify-review:', error)
    res.status(500).json({ success: false, message: 'Erreur serveur' })
  }
})

module.exports = router
