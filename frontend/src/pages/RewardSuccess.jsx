import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import './RewardSuccess.css'

function RewardSuccess() {
  const location = useLocation()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const reward = location.state?.reward
  const code = location.state?.code
  const userName = location.state?.userName

  useEffect(() => {
    if (!reward || !code) {
      navigate('/')
    }
  }, [reward, code, navigate])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!reward || !code) return null

  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + 30)

  return (
    <div className="page success-page">
      <div className="container">
        <motion.div
          className="success-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="success-header">
            <div className="success-icon">🎉</div>
            <h1>Félicitations !</h1>
            <p>Vous avez gagné une récompense</p>
          </div>

          <div className="card reward-card">
            <div className="reward-title">
              <span className="reward-icon">🎁</span>
              <h2>{reward.label}</h2>
            </div>

            <div className="qr-section">
              <p className="qr-label">Présentez ce QR Code en magasin</p>
              <div className="qr-display">
                <QRCodeSVG 
                  value={code}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>

            <div className="code-section">
              <p className="code-label">Ou utilisez ce code :</p>
              <div className="code-display">
                <span className="code-value">{code}</span>
                <button 
                  className={`btn-copy ${copied ? 'copied' : ''}`}
                  onClick={handleCopyCode}
                >
                  {copied ? '✓ Copié' : '📋 Copier'}
                </button>
              </div>
            </div>

            <div className="reward-details">
              <div className="detail-item">
                <span className="detail-icon">👤</span>
                <span className="detail-text">{userName || 'Client'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📅</span>
                <span className="detail-text">
                  Valable jusqu'au {expirationDate.toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">⚠️</span>
                <span className="detail-text">Utilisable une seule fois</span>
              </div>
            </div>

            <button 
              className="btn btn-primary btn-full"
              onClick={() => navigate('/')}
            >
              🏠 Retour à l'accueil
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RewardSuccess
