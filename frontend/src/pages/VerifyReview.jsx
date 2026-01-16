import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from '../services/api'
import './VerifyReview.css'

function VerifyReview() {
  const navigate = useNavigate()
  const [reviewLink, setReviewLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sessionId, setSessionId] = useState(null)

  useEffect(() => {
    const storedSessionId = localStorage.getItem('sessionId')
    
    console.log('🔍 SessionId dans localStorage:', storedSessionId)
    
    if (!storedSessionId) {
      console.log('❌ Pas de sessionId, redirection vers accueil')
      alert('Session expirée. Veuillez recommencer depuis le début.')
      navigate('/')
      return
    }
    
    setSessionId(storedSessionId)
    console.log('✅ SessionId chargé:', storedSessionId)
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!reviewLink) {
      setError('Veuillez coller le lien de votre avis')
      return
    }

    console.log('📤 Envoi de la vérification avec sessionId:', sessionId)
    console.log('📤 Lien:', reviewLink)

    setLoading(true)
    setError('')

    try {
      const response = await axios.post('/api/rewards/verify-review', {
        sessionId,
        reviewLink
      })

      console.log('✅ Réponse reçue:', response.data)

      if (response.data.success) {
        alert('✅ Avis vérifié ! Vous pouvez maintenant tourner la roue.')
        // Rediriger vers la roue
        navigate('/wheel')
      }
    } catch (error) {
      console.error('❌ Erreur lors de la vérification:', error)
      console.error('Détails:', error.response?.data)
      setError(error.response?.data?.message || 'Lien invalide ou session expirée. Veuillez recommencer.')
    } finally {
      setLoading(false)
    }
  }

  if (!sessionId) return null

  return (
    <div className="page verify-page">
      <div className="container">
        <motion.div
          className="verify-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="steps">
            <div className="step done">✓ Inscription</div>
            <div className="step active">📝 Avis Google</div>
            <div className="step">🎡 Roue</div>
          </div>

          <div className="card verify-card">
            <h1>📱 Partagez votre avis</h1>
            <p className="verify-description">
              Après avoir laissé votre avis sur Google Maps, copiez le lien de partage et collez-le ci-dessous
            </p>

            <div className="info-box">
              <p><strong>📌 Comment obtenir le lien ?</strong></p>
              <ol>
                <li>Sur Google Maps, laissez votre avis</li>
                <li>Cliquez sur "Partager" ou les 3 points</li>
                <li>Copiez le lien de partage</li>
                <li>Collez-le ici</li>
              </ol>
              <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                Exemples de liens acceptés :<br />
                • https://maps.app.goo.gl/xxxxx<br />
                • https://www.google.com/maps/place/...
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="reviewLink">Lien de votre avis Google</label>
                <input
                  type="url"
                  id="reviewLink"
                  value={reviewLink}
                  onChange={(e) => setReviewLink(e.target.value)}
                  placeholder="https://maps.app.goo.gl/xxxxx"
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button 
                type="submit" 
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? 'Vérification...' : '✅ Valider et continuer'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default VerifyReview
