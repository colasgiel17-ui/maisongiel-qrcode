import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import axios from '../services/api'
import Footer from '../components/Footer'
import './ValidateReward.css'

function ValidateReward() {
  const { code } = useParams()
  const [loading, setLoading] = useState(true)
  const [reward, setReward] = useState(null)
  const [error, setError] = useState(null)
  const [validating, setValidating] = useState(false)

  useEffect(() => {
    const fetchReward = async () => {
      try {
        console.log('🔍 Récupération de la récompense pour:', code)
        
        const response = await axios.get(`/api/validate/${code}`)
        
        if (response.data.success) {
          setReward(response.data)
        }
      } catch (err) {
        console.error('❌ Erreur:', err)
        setError(err.response?.data?.message || 'Code invalide')
      } finally {
        setLoading(false)
      }
    }

    if (code) {
      fetchReward()
    }
  }, [code])

  const handleValidate = async () => {
    if (!window.confirm('⚠️ Confirmer l\'utilisation de cette récompense ? Cette action est irréversible.')) {
      return
    }

    setValidating(true)

    try {
      const response = await axios.post(`/api/validate/${code}/use`, {
        adminConfirm: true
      })

      if (response.data.success) {
        // Recharger les données pour afficher "utilisée"
        const updatedResponse = await axios.get(`/api/validate/${code}`)
        setReward(updatedResponse.data)
        alert('✅ Récompense validée avec succès !')
      }
    } catch (err) {
      console.error('❌ Erreur validation:', err)
      alert(err.response?.data?.message || 'Erreur lors de la validation')
    } finally {
      setValidating(false)
    }
  }

  if (loading) {
    return (
      <div className="validate-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Vérification en cours...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <>
        <div className="validate-page error-page">
          <div className="container">
            <motion.div
              className="error-container"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="error-icon">❌</div>
              <h1>Code invalide</h1>
              <p>{error}</p>
            </motion.div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <div className="validate-page success-page">
        <div className="container">
          <motion.div
            className="reward-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {reward.used ? (
              // Récompense déjà utilisée
              <>
                <div className="reward-icon used">✅</div>
                <h1>Récompense déjà utilisée</h1>
                <div className="reward-details">
                  <p className="customer-name">👤 {reward.name}</p>
                  <p className="reward-type">🎁 {reward.reward}</p>
                  <p className="used-info">
                    Utilisée le {new Date(reward.usedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </>
            ) : (
              // Récompense valide et disponible
              <>
                <div className="reward-icon">🎁</div>
                <h1>Récompense valide !</h1>
                <div className="reward-details">
                  <p className="customer-name">👤 {reward.name}</p>
                  <p className="reward-type">🎉 {reward.reward}</p>
                  <p className="reward-code">Code : {reward.code}</p>
                </div>

                {/* QR Code de la page actuelle */}
                <div className="qr-code-container">
                  <QRCodeSVG 
                    value={window.location.href}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                  <p className="qr-label">Scannez ce QR code</p>
                </div>

                <div className="reward-message">
                  <p>✅ Cette récompense est valide et peut être utilisée</p>
                  <p className="reward-instructions">
                    Le commerçant validera cette récompense lors de la remise en magasin
                  </p>
                  
                  <button 
                    onClick={handleValidate}
                    disabled={validating}
                    className="btn btn-success btn-validate"
                  >
                    {validating ? '⏳ Validation...' : '✅ Valider la récompense'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ValidateReward
