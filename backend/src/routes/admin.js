const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const db = require('../database/init')
const supabase = require('../config/supabase')

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

// 📊 Statistiques - LIT DEPUIS SUPABASE
router.get('/stats', auth, async (req, res) => {
  try {
    // ☁️ SUPABASE: Source unique de vérité
    const { data: allParticipations, error } = await supabase
      .from('participations')
      .select('*')

    if (error) throw error

    const total = allParticipations.length
    const used = allParticipations.filter(p => p.reward_used === true).length
    const pending = allParticipations.filter(p => p.reward_code && p.reward_used === false).length

    console.log('📊 Stats depuis Supabase:', { total, used, pending })

    res.json({ 
      success: true, 
      stats: { total, used, pending } 
    })
  } catch (error) {
    console.error('Erreur stats:', error)
    res.status(500).json({ success: false, message: 'Erreur serveur' })
  }
})

// 📋 Liste des participations - LIT DEPUIS SUPABASE (TOUTES)
router.get('/participations', auth, async (req, res) => {
  try {
    // ☁️ SUPABASE: Récupérer TOUTES les participations (pas de limite)
    const { data: participations, error } = await supabase
      .from('participations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    console.log(`✅ ${participations.length} participations récupérées depuis Supabase`)

    res.json({ success: true, participations })
  } catch (error) {
    console.error('Erreur participations:', error)
    res.status(500).json({ success: false, message: 'Erreur serveur' })
  }
})

// ✅ Valider une récompense (scanner QR) - MET À JOUR SUPABASE
router.post('/validate', auth, async (req, res) => {
  try {
    const { code } = req.body

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Code manquant'
      })
    }

    // ☁️ SUPABASE: Chercher la participation
    const { data: participation, error: fetchError } = await supabase
      .from('participations')
      .select('*')
      .eq('reward_code', code)
      .single()

    if (fetchError || !participation) {
      return res.status(404).json({
        success: false,
        message: 'Code invalide'
      })
    }

    if (participation.reward_used === true) {
      return res.status(400).json({
        success: false,
        message: 'Récompense déjà utilisée'
      })
    }

    // ☁️ SUPABASE: Marquer comme utilisée
    const { error: updateError } = await supabase
      .from('participations')
      .update({ 
        reward_used: true,
        used_at: new Date().toISOString()
      })
      .eq('reward_code', code)

    if (updateError) throw updateError

    // SQLite: Update local aussi (backup)
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
