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
    
    if (!storedSessionId) {
      navigate('/')
      return
    }
    
    setSessionId(storedSessionId)
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!reviewLink) {
      setError('Veuillez coller le lien de votre avis')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await axios.post('/api/rewards/verify-review', {
        sessionId,
        reviewLink
      })

      if (response.data.success) {
        // Rediriger vers la roue
        navigate('/wheel')
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Lien invalide')
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
                <li>Cliquez sur "Partager l'avis"</li>
                <li>Copiez le lien</li>
                <li>Collez-le ici</li>
              </ol>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="reviewLink">Lien de votre avis Google</label>
                <input
                  type="url"
                  id="reviewLink"
                  value={reviewLink}
                  onChange={(e) => setReviewLink(e.target.value)}
                  placeholder="https://maps.google.com/..."
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
