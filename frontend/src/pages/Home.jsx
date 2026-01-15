import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from '../services/api'
import { QRCodeSVG } from 'qrcode.react'
import Footer from '../components/Footer'
import './Home.css'

function Home() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [existingReward, setExistingReward] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setExistingReward(null)

    try {
      const response = await axios.post('/api/rewards/start', { name, email })
      
      if (response.data.success) {
        localStorage.setItem('sessionId', response.data.sessionId)
        
        // Si l'utilisateur a déjà participé et a une récompense
        if (response.data.alreadyParticipated && response.data.reward) {
          setExistingReward(response.data.reward)
        } else {
          // Ouvrir Google Maps dans un nouvel onglet
          if (response.data.googleMapsUrl) {
            window.open(response.data.googleMapsUrl, '_blank')
          }
          // Rediriger vers la page de vérification
          navigate('/verify-review')
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue')
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

                {/* Affichage de la récompense existante */}
                {existingReward && (
                  <div className="existing-reward-display">
                    <div className="success-message">
                      ✅ Vous avez déjà participé ! Voici votre récompense :
                    </div>
                    <div className="reward-recap">
                      <h3>🎁 {existingReward.label}</h3>
                      <p className="reward-name">Pour : {existingReward.name}</p>
                      <div className="qr-code-container">
                        <QRCodeSVG 
                          value={existingReward.code} 
                          size={200}
                          level="H"
                          includeMargin={true}
                        />
                        <p className="reward-code">Code : {existingReward.code}</p>
                        {existingReward.used ? (
                          <p className="status-used">✓ Déjà utilisé</p>
                        ) : (
                          <p className="status-valid">✓ Valide en magasin</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

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
