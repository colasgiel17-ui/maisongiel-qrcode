import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import './Reward.css'

function Reward() {
  const location = useLocation()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [reward, setReward] = useState(null)
  const [code, setCode] = useState(null)
  const [userName, setUserName] = useState(null)

  useEffect(() => {
    const storedReward = localStorage.getItem('rewardType')
    const storedCode = localStorage.getItem('rewardCode')
    const storedName = localStorage.getItem('userName')

    // Si les données sont dans le localStorage (utilisateur déjà participant)
    if (storedReward && storedCode && storedName) {
      setReward(storedReward)
      setCode(storedCode)
      setUserName(storedName)
      return
    }

    // Sinon, récupérer depuis l'état de navigation
    if (!location.state) {
      navigate('/')
      return
    }

    setReward(location.state.reward)
    setCode(location.state.code)
    setUserName(location.state.name)
  }, [location, navigate])

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
          
          <h1 className="reward-title">Félicitations {userName} !</h1>
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
                value={code}
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
