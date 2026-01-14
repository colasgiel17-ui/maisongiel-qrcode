const express = require('express')
const router = express.Router()
const db = require('../database/init')
const supabase = require('../config/supabase')

// Fonction pour générer un code unique
function generateCode() {
  return 'MG-' + Math.random().toString(36).substr(2, 8).toUpperCase()
}

// 📝 ÉTAPE 1 : Soumettre nom/email
router.post('/start', async (req, res) => {
  try {
    const { name, email } = req.body

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Nom et email requis' })
    }

    // ☁️ SUPABASE: Vérifier si l'email existe déjà (source de vérité unique)
    const { data: existingSupabase, error: checkError } = await supabase
      .from('participations')
      .select('*')
      .eq('email', email)
      .single()

    if (existingSupabase) {
      console.log('❌ Email déjà utilisé (trouvé dans Supabase):', email)
      return res.status(400).json({ 
        success: false, 
        message: 'Vous avez déjà participé avec cet email' 
      })
    }

    const sessionId = generateCode()

    // SQLite: Insert (backup local)
    db.prepare(`
      INSERT INTO participations (user_id, name, email, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `).run(sessionId, name, email)

    // ☁️ SUPABASE: Insert (Source de vérité principale)
    const { error: insertError } = await supabase
      .from('participations')
      .insert({
        user_id: sessionId,
        name,
        email,
        created_at: new Date().toISOString()
      })

    if (insertError) {
      console.error('⚠️ Erreur Supabase Start:', insertError.message)
      // Continuer quand même pour ne pas bloquer l'utilisateur
    } else {
      console.log('✅ Client créé dans Supabase:', email)
    }

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

// ✅ ÉTAPE 1.5 : Vérifier le lien d'avis
router.post('/verify-review', async (req, res) => {
  try {
    const { sessionId, reviewLink } = req.body

    if (!sessionId || !reviewLink) return res.status(400).json({ success: false, message: 'Données manquantes' })

    const participation = db.prepare('SELECT * FROM participations WHERE user_id = ?').get(sessionId)
    if (!participation) return res.status(400).json({ success: false, message: 'Session introuvable' })

    const isValidLink = reviewLink.includes('google') || reviewLink.includes('maps') || reviewLink.includes('goo.gl')
    if (!isValidLink) return res.status(400).json({ success: false, message: 'Lien Google invalide' })

    // SQLite: Update
    db.prepare('UPDATE participations SET review_link = ? WHERE user_id = ?').run(reviewLink, sessionId)

    // ☁️ SUPABASE: Update
    supabase.from('participations')
      .update({ review_link: reviewLink })
      .eq('user_id', sessionId)
      .then(({ error }) => {
        if (error) console.error('⚠️ Erreur Supabase Review:', error.message)
      })

    res.json({ success: true, message: 'Avis vérifié !' })

  } catch (error) {
    console.error('❌ Erreur /verify-review:', error)
    res.status(500).json({ success: false, message: 'Erreur serveur' })
  }
})

// 🎡 ÉTAPE 2 : Tourner la roue
router.post('/spin', async (req, res) => {
  try {
    const { sessionId } = req.body

    if (!sessionId) return res.status(400).json({ success: false, message: 'Session invalide' })

    const participation = db.prepare('SELECT * FROM participations WHERE user_id = ?').get(sessionId)
    if (!participation) return res.status(400).json({ success: false, message: 'Session introuvable' })
    if (participation.reward_type) return res.status(400).json({ success: false, message: 'Déjà joué' })

    // Récompenses
    const rewards = [
      { label: 'Café offert', probability: 40 },
      { label: 'Boisson offerte', probability: 30 },
      { label: 'Pâtisserie offerte', probability: 20 },
      { label: '1€ de réduction', probability: 5 },
      { label: '2€ de réduction', probability: 5 }
    ]

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

    const rewardCode = generateCode()

    // SQLite: Update
    db.prepare(`
      UPDATE participations 
      SET reward_type = ?, reward_code = ?, reward_used = 0
      WHERE user_id = ?
    `).run(selected.label, rewardCode, sessionId)

    // ☁️ SUPABASE: Update (Le saint Graal est sauvegardé)
    supabase.from('participations')
      .update({ 
        reward_type: selected.label, 
        reward_code: rewardCode,
        reward_used: false
      })
      .eq('user_id', sessionId)
      .then(({ error }) => {
        if (error) console.error('⚠️ Erreur Supabase Spin:', error.message)
        else console.log('☁️ Récompense sauvegardée sur Supabase:', selected.label)
      })

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
