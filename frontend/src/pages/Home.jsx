import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from '../services/api'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!name || !email) {
      setError('Veuillez remplir tous les champs')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Étape 1 : Créer la session
      const response = await axios.post('/api/rewards/start', { name, email })

      if (response.data.success) {
        const { sessionId, googleMapsUrl } = response.data
        
        // Sauvegarder dans localStorage
        localStorage.setItem('sessionId', sessionId)
        localStorage.setItem('userName', name)
        
        // Ouvrir Google Maps dans un nouvel onglet
        window.open(googleMapsUrl, '_blank')
        
        // Afficher le message
        alert('✅ Une nouvelle fenêtre s\'est ouverte. Laissez votre avis puis revenez ici pour continuer !')
        
        // Rediriger vers la page de vérification
        setTimeout(() => {
          navigate('/verify-review')
        }, 1000)
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page home-page">
      <div className="container">
        <motion.div
          className="home-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="hero">
            <h1 className="hero-title">🎁 Gagnez une Récompense !</h1>
            <p className="hero-subtitle">
              Laissez un avis Google et tournez la roue de la chance
            </p>
          </div>

          <div className="card form-card">
            <h2>📝 Commencez ici</h2>
            <p className="form-description">
              Renseignez vos informations pour participer
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Votre nom</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jean Dupont"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Votre email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jean@email.com"
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button 
                type="submit" 
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? 'Chargement...' : '🚀 Participer'}
              </button>
            </form>

            <div className="info-box">
              <p><strong>📌 Comment ça marche ?</strong></p>
              <ol>
                <li>Remplissez ce formulaire</li>
                <li>Laissez un avis sur Google Maps</li>
                <li>Revenez ici et tournez la roue !</li>
              </ol>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Bouton admin discret */}
      <button 
        className="admin-btn-discreet"
        onClick={() => navigate('/admin')}
        title="Administration"
      >
        🔒
      </button>
    </div>
  )
}

export default Home
