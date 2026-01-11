import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import './RewardSuccess.css'

function RewardSuccess() {
  const location = useLocation()
  const navigate = useNavigate()

  const reward = location.state?.reward
  const userName = location.state?.userName
  const code = location.state?.code

  if (!reward) {
    navigate('/')
    return null
  }

  const downloadCoupon = () => {
    // Simuler le téléchargement d'un PDF
    alert('Téléchargement du bon en cours... (À implémenter avec PDFKit côté backend)')
  }

  return (
    <div className="page success-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="success-content"
        >
          <div className="confetti">🎉🎊✨🎈🎁</div>
          
          <h1 className="success-title">🎉 Félicitations {userName} !</h1>
          
          <div className="card reward-card">
            <div className="reward-icon">🏆</div>
            <h2>Vous avez gagné :</h2>
            <div className="reward-name">{reward.label}</div>
            
            <div className="coupon-section">
              <div className="coupon-code">
                <span className="code-label">Votre code :</span>
                <span className="code-value">{code}</span>
              </div>
              
              <p className="code-instructions">
                Présentez ce code en caisse pour profiter de votre récompense
              </p>

              <div className="action-buttons">
                <button className="btn btn-primary" onClick={downloadCoupon}>
                  📥 Télécharger le bon
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(code)
                    alert('Code copié !')
                  }}
                >
                  📋 Copier le code
                </button>
              </div>
            </div>

            <div className="validity-info">
              <p>✅ Valable jusqu'au : {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('fr-FR')}</p>
              <p>📍 À utiliser dans notre établissement</p>
              <p>⚠️ Non cumulable avec d'autres promotions</p>
            </div>
          </div>

          <div className="card reward-details">
            <h2>🎁 Votre récompense</h2>
            <div className="reward-name">{reward.label}</div>
            
            <div className="qr-code-section">
              <p className="qr-instruction">
                📱 Présentez ce QR Code en magasin
              </p>
              <div className="qr-code-container">
                <QRCodeSVG 
                  value={code}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="code-text">Code : <strong>{code}</strong></p>
            </div>

            <div className="reward-info">
              <div className="info-row">
                <span className="info-icon">👤</span>
                <span className="info-text">{userName || 'Client'}</span>
              </div>
              <div className="info-row">
                <span className="info-icon">📅</span>
                <span className="info-text">
                  Valable jusqu'au {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              <div className="info-row">
                <span className="info-icon">⚠️</span>
                <span className="info-text">Utilisable une seule fois</span>
              </div>
            </div>

            <div className="action-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => window.print()}
              >
                🖨️ Imprimer
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => navigate('/')}
              >
                🏠 Retour à l'accueil
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RewardSuccess
