const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Générer un token de participation
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
}

// Vérifier un token de participation
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Générer un token admin (plus longue durée)
function generateAdminToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

// Vérifier un token admin
function verifyAdminToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Générer un code de récompense unique
function generateRewardCode() {
  const prefix = 'MG' // Maison Giel
  const random = Math.random().toString(36).substr(2, 8).toUpperCase()
  return `${prefix}-${random}`
}

// Générer un UUID
function generateUUID() {
  return uuidv4()
}

// Formater une date
function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

module.exports = {
  generateToken,
  verifyToken,
  generateAdminToken,
  verifyAdminToken,
  generateRewardCode,
  generateUUID,
  formatDate
}
