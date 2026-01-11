const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const db = require('../database')
const { generateAdminToken, verifyAdminToken } = require('../utils/helpers')

// Middleware d'authentification admin
const authAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'Token manquant' })
  }

  const decoded = verifyAdminToken(token)
  if (!decoded) {
    return res.status(401).json({ error: 'Token invalide' })
  }

  req.admin = decoded
  next()
}

// Login admin
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    const admin = await db.get(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    )

    if (!admin) {
      return res.status(401).json({ error: 'Identifiants incorrects' })
    }

    const isValidPassword = await bcrypt.compare(password, admin.passwordHash)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Identifiants incorrects' })
    }

    const token = generateAdminToken({ id: admin.id, username: admin.username })

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username
      }
    })

  } catch (error) {
    console.error('Admin login error:', error)
    res.status(500).json({ error: 'Erreur lors de la connexion' })
  }
})

// Statistiques globales
router.get('/stats', authAdmin, async (req, res) => {
  try {
    const totalParticipants = await db.get(
      'SELECT COUNT(*) as count FROM reviews'
    )

    const totalReviews = await db.get(
      'SELECT COUNT(*) as count FROM reviews WHERE verified = 1'
    )

    const totalRewards = await db.get(
      'SELECT COUNT(*) as count FROM rewards'
    )

    const usedRewards = await db.get(
      'SELECT COUNT(*) as count FROM rewards WHERE used = 1'
    )

    const redemptionRate = totalRewards.count > 0 
      ? Math.round((usedRewards.count / totalRewards.count) * 100)
      : 0

    res.json({
      totalParticipants: totalParticipants.count,
      totalReviews: totalReviews.count,
      totalRewards: totalRewards.count,
      usedRewards: usedRewards.count,
      redemptionRate
    })

  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' })
  }
})

// Liste des avis
router.get('/reviews', authAdmin, async (req, res) => {
  try {
    const reviews = await db.query(
      'SELECT id, name, email, reviewLink, screenshotPath, verified, createdAt FROM reviews ORDER BY createdAt DESC'
    )

    res.json(reviews)

  } catch (error) {
    console.error('Error fetching reviews:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération des avis' })
  }
})

// Liste des récompenses
router.get('/rewards', authAdmin, async (req, res) => {
  try {
    const rewards = await db.query(`
      SELECT 
        r.id, r.code, r.rewardLabel as rewardName, r.used, r.createdAt, r.usedAt,
        rev.name as userName, rev.email
      FROM rewards r
      JOIN reviews rev ON r.reviewId = rev.id
      ORDER BY r.createdAt DESC
    `)

    res.json(rewards)

  } catch (error) {
    console.error('Error fetching rewards:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération des récompenses' })
  }
})

// Vérifier manuellement un avis
router.patch('/reviews/:id/verify', authAdmin, async (req, res) => {
  try {
    const { id } = req.params

    await db.run(
      'UPDATE reviews SET verified = 1 WHERE id = ?',
      [id]
    )

    res.json({ success: true, message: 'Avis vérifié' })

  } catch (error) {
    console.error('Error verifying review:', error)
    res.status(500).json({ error: 'Erreur lors de la vérification' })
  }
})

// Obtenir les détails d'un avis spécifique
router.get('/reviews/:id', authAdmin, async (req, res) => {
  try {
    const { id } = req.params

    const review = await db.get(
      'SELECT * FROM reviews WHERE id = ?',
      [id]
    )

    if (!review) {
      return res.status(404).json({ error: 'Avis non trouvé' })
    }

    res.json(review)

  } catch (error) {
    console.error('Error fetching review details:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération des détails' })
  }
})

// Supprimer un avis
router.delete('/reviews/:id', authAdmin, async (req, res) => {
  try {
    const { id } = req.params

    await db.run('DELETE FROM reviews WHERE id = ?', [id])

    res.json({ success: true, message: 'Avis supprimé' })

  } catch (error) {
    console.error('Error deleting review:', error)
    res.status(500).json({ error: 'Erreur lors de la suppression' })
  }
})

module.exports = router
