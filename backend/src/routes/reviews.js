const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const { body, validationResult } = require('express-validator')
const db = require('../database')
const { generateToken } = require('../utils/helpers')

// ID Google My Business de Maison Giel
const VALID_PLACE_IDS = [
  '0x47fe2fcf4f8a3a2b:0xdd9957b5f6e04651', // ID complet
  'dd9957b5f6e04651', // ID court
  'Boulangerie+P%C3%A2tisserie+Maison+Giel+Saint-Yrieix-Sur-Charente',
  'Maison+Giel',
  'maps.app.goo.gl', // Liens courts Google Maps
  'goo.gl/maps', // Anciens liens courts
  'google.com/maps' // Liens Google Maps classiques
]

// Fonction pour valider que le lien provient de Maison Giel
function isValidMaisonGielReview(reviewLink) {
  if (!reviewLink) return false
  
  // Normaliser l'URL (enlever les espaces, mettre en minuscules)
  const normalizedLink = reviewLink.toLowerCase().trim()
  
  // Vérifier si c'est un lien Google Maps
  const isGoogleMapsLink = normalizedLink.includes('google.com/maps') || 
                           normalizedLink.includes('maps.app.goo.gl') ||
                           normalizedLink.includes('goo.gl/maps')
  
  if (!isGoogleMapsLink) {
    return false
  }
  
  // Si c'est un lien court (goo.gl), on l'accepte car on ne peut pas vérifier l'établissement
  // L'admin devra vérifier manuellement via le tableau de bord
  if (normalizedLink.includes('maps.app.goo.gl') || normalizedLink.includes('goo.gl/maps')) {
    return true
  }
  
  // Pour les liens longs, vérifier l'ID de l'établissement
  return VALID_PLACE_IDS.some(id => normalizedLink.includes(id.toLowerCase()))
}

// Configuration Multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'))
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase()) &&
                    allowedTypes.test(file.mimetype)
    
    if (isValid) cb(null, true)
    else cb(new Error('Format de fichier non accepté. Utilisez JPG, PNG ou GIF.'))
  }
})

// Validation et soumission d'un avis
router.post('/submit',
  upload.single('screenshot'),
  [
    body('name').trim().notEmpty().withMessage('Le nom est requis'),
    body('email').isEmail().withMessage('Email invalide'),
    body('reviewLink').optional().isURL().withMessage('Lien invalide')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, email, reviewLink } = req.body
      const screenshot = req.file ? req.file.filename : null
      const ipAddress = req.ip
      const deviceFingerprint = req.headers['user-agent']

      // Vérifier si l'utilisateur a déjà participé (par IP et device)
      const existingParticipation = await db.get(
        'SELECT id FROM reviews WHERE ipAddress = ? OR email = ?',
        [ipAddress, email]
      )

      if (existingParticipation) {
        return res.status(429).json({ 
          success: false,
          message: 'Vous avez déjà participé ! Une seule participation par personne.'
        })
      }

      // Vérifier qu'au moins un lien ou screenshot est fourni
      if (!reviewLink && !screenshot) {
        return res.status(400).json({
          success: false,
          message: 'Veuillez fournir un lien ou une capture d\'écran de votre avis'
        })
      }

      // Valider que le lien provient bien de Maison Giel
      if (reviewLink && !isValidMaisonGielReview(reviewLink)) {
        return res.status(400).json({
          success: false,
          message: 'Le lien d\'avis doit provenir de Boulangerie Pâtisserie Maison Giel à Saint-Yrieix-Sur-Charente'
        })
      }

      // Insérer l'avis dans la base de données
      const result = await db.run(
        `INSERT INTO reviews (name, email, reviewLink, screenshotPath, ipAddress, deviceFingerprint)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, reviewLink, screenshot, ipAddress, deviceFingerprint]
      )

      // Générer un token de participation unique
      const token = generateToken({ reviewId: result.id, email })

      res.json({
        success: true,
        message: 'Avis soumis avec succès',
        token
      })

    } catch (error) {
      console.error('Error submitting review:', error)
      res.status(500).json({ 
        success: false,
        message: 'Erreur lors de la soumission de l\'avis'
      })
    }
  }
)

module.exports = router
