import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import './Reward.css'

function Reward() {
  const location = useLocation()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [qrCodeValue, setQrCodeValue] = useState('')

  const reward = location.state?.reward
  const code = location.state?.code
  const name = location.state?.name

  useEffect(() => {
    if (!reward || !code) {
      navigate('/')
    }
  }, [reward, code, navigate])

  useEffect(() => {
    const code = localStorage.getItem('rewardCode')
    const type = localStorage.getItem('rewardType')
    const name = localStorage.getItem('userName')

    if (!code || !type) {
      navigate('/')
      return
    }

    setQrCodeValue(`${window.location.origin}/validate/${code}`)
  }, [navigate])

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!reward || !code) return null

  return (
    <div className="page reward-page">
      <div className="container">
        <motion.div
          className="reward-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="confetti">🎉🎊✨🎁🌟</div>
          
          <h1 className="reward-title">Félicitations {name} !</h1>
          <p className="reward-subtitle">Vous avez gagné :</p>

          <div className="reward-prize">
            <h2>{reward.label}</h2>
          </div>

          <div className="qr-section">
            <p className="qr-instruction">
              📱 Présentez ce QR Code en magasin
            </p>
            <div className="qr-container">
              <QRCodeSVG 
                value={qrCodeValue}
                size={250}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>

          <div className="code-section">
            <p className="code-label">Ou utilisez ce code :</p>
            <div className="code-box">
              <span className="code-value">{code}</span>
              <button 
                className="btn-copy"
                onClick={handleCopy}
              >
                {copied ? '✓' : '📋'}
              </button>
            </div>
          </div>

          <div className="info-section">
            <p>⏰ Valable 30 jours</p>
            <p>⚠️ Utilisable une seule fois</p>
          </div>

          <button 
            className="btn btn-outline"
            onClick={() => navigate('/')}
          >
            🏠 Retour à l'accueil
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default Reward
