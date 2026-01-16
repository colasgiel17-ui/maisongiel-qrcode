import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from '../services/api'
import './WheelOfFortune.css'

function WheelOfFortune() {
  const navigate = useNavigate()
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [sessionId, setSessionId] = useState(null)

  useEffect(() => {
    // Récupérer la session depuis localStorage
    const storedSessionId = localStorage.getItem('sessionId')
    
    if (!storedSessionId) {
      alert('❌ Session expirée. Veuillez recommencer.')
      navigate('/')
      return
    }
    
    setSessionId(storedSessionId)
  }, [navigate])

  const prizes = [
    { label: 'Café offert', emoji: '☕', color: '#FF6B6B' },
    { label: 'Boisson offerte', emoji: '🥤', color: '#4ECDC4' },
    { label: 'Pâtisserie offerte', emoji: '🍰', color: '#FFE66D' },
    { label: '1€ de réduction', emoji: '💰', color: '#95E1D3' },
    { label: '2€ de réduction', emoji: '💵', color: '#F38181' }
  ]

  const spinWheel = async () => {
    if (spinning || !sessionId) return

    setSpinning(true)

    try {
      const response = await axios.post('/api/rewards/spin', {
        sessionId
      })

      if (response.data.success) {
        const { reward, code } = response.data

        // Sauvegarder dans localStorage
        localStorage.setItem('rewardCode', code)
        localStorage.setItem('rewardType', reward.label)

        // Animation de la roue
        const randomDegree = Math.floor(Math.random() * 360) + 1800
        setRotation(randomDegree)

        // Après l'animation, rediriger directement vers /validate/:code
        setTimeout(() => {
          navigate(`/validate/${code}`)
        }, 4000)
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Une erreur est survenue')
      setSpinning(false)
    }
  }

  if (!sessionId) return null

  return (
    <div className="page wheel-page">
      <div className="container">
        <motion.div
          className="wheel-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h1 className="wheel-title">🎡 Roue de la Chance</h1>
          <p className="wheel-subtitle">Cliquez pour découvrir votre récompense !</p>

          <div className="wheel-wrapper">
            <div className="wheel-arrow">▼</div>

            <motion.div
              className="wheel"
              animate={{ rotate: rotation }}
              transition={{ duration: 4, ease: "easeOut" }}
            >
              {prizes.map((prize, index) => {
                const angle = (360 / prizes.length) * index
                return (
                  <div
                    key={index}
                    className="wheel-segment"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      background: prize.color
                    }}
                  >
                    <div className="segment-content">
                      <span className="segment-emoji">{prize.emoji}</span>
                      <span className="segment-label">{prize.label}</span>
                    </div>
                  </div>
                )
              })}
              <div className="wheel-center">🎁</div>
            </motion.div>
          </div>

          {!spinning ? (
            <button 
              className="btn btn-primary btn-spin"
              onClick={spinWheel}
            >
              🎰 Tourner la roue
            </button>
          ) : (
            <div className="spinning-text">
              🎵 La roue tourne... 🎵
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default WheelOfFortune
