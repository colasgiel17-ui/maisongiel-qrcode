import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import axios from '../services/api'
import Footer from '../components/Footer'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [existingReward, setExistingReward] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!name || !email) {
      setError('Veuillez remplir tous les champs')
      return
    }

    setLoading(true)
    setError('')

    try {
      console.log('📤 Envoi de la demande de participation:', { name, email })

      // Étape 1 : Créer la session (le backend vérifie l'email dans Supabase)
      const response = await axios.post('/api/rewards/start', { name, email })

      console.log('✅ Réponse reçue:', response.data)

      if (response.data.success) {
        const { sessionId, googleMapsUrl } = response.data
        
        // Sauvegarder dans localStorage
        localStorage.setItem('sessionId', sessionId)
        localStorage.setItem('userName', name)
        localStorage.setItem('userEmail', email)
        
        console.log('💾 SessionId sauvegardé:', sessionId)
        
        // Rediriger immédiatement vers la page de vérification
        navigate('/verify-review')
      }
    } catch (error) {
      console.error('❌ Erreur lors de la participation:', error)
      console.error('Détails:', error.response?.data)
      
      // Si l'email existe déjà, afficher le QR code existant sur place
      if (error.response?.status === 400 && error.response?.data?.existingCode) {
        setExistingReward({
          code: error.response.data.existingCode,
          type: error.response.data.rewardType,
          name: error.response.data.name
        })
        setError('⚠️ Cet email a déjà été utilisé. Voici votre QR code existant :')
      } else if (error.response?.status === 400 && error.response?.data?.message?.includes('déjà participé')) {
        setError('⚠️ Cet email a déjà été utilisé. Vous ne pouvez participer qu\'une seule fois.')
      } else {
        setError(error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.')
      }
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
              <h2>📝 Participez en 3 étapes</h2>
              <p className="form-description">
                Renseignez vos informations pour commencer
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

                {/* Afficher le QR Code existant si l'email est déjà utilisé */}
                {existingReward && (
                  <div className="existing-reward-box">
                    <h3>🎁 {existingReward.type}</h3>
                    <div className="qr-display">
                      <QRCodeSVG 
                        value={existingReward.code}
                        size={200}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <p className="reward-code">
                      <strong>Code :</strong> {existingReward.code}
                    </p>
                    <p className="reward-info">
                      Présentez ce QR code en magasin pour récupérer votre récompense !
                    </p>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary btn-block"
                  disabled={loading || existingReward}
                >
                  {loading ? 'Chargement...' : '🚀 Commencer'}
                </button>
              </form>

              <div className="info-box">
                <p><strong>📌 Comment ça marche ?</strong></p>
                <ol>
                  <li>Renseignez votre nom et email ci-dessus</li>
                  <li>Laissez un avis 5⭐ sur Google Maps</li>
                  <li>Copiez le lien et tournez la roue de la chance !</li>
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
