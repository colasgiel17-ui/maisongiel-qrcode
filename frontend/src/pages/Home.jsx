import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from '../services/api'
import Footer from '../components/Footer'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('/api/rewards/start', {
        name,
        email
      })

      if (response.data.success) {
        localStorage.setItem('sessionId', response.data.sessionId)
        localStorage.setItem('userName', name)

        // Cas 1 : Utilisateur déjà participant avec récompense
        if (response.data.alreadyParticipated && response.data.reward?.code) {
          // Sauvegarder les données de récompense
          localStorage.setItem('rewardType', response.data.reward.type)
          localStorage.setItem('rewardCode', response.data.reward.code)
          
          alert('✅ ' + response.data.message)
          navigate('/reward')
        } 
        // Cas 2 : Nouvel utilisateur
        else {
          window.open(response.data.googleMapsUrl, '_blank')
          setTimeout(() => {
            navigate('/verify-review')
          }, 500)
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
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
      <Footer />
    </>
  )
}

export default Home
