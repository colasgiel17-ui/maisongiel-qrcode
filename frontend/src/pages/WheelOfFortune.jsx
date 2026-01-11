import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from '../services/api'
import './WheelOfFortune.css'

const REWARDS = [
  { id: 1, label: '☕ Café offert', color: '#ff8c42', probability: 0.24 },
  { id: 2, label: '💰 2€', color: '#ffa94d', probability: 0.25 },
  { id: 3, label: '💰 1€', color: '#ffb366', probability: 0.35 },
  { id: 4, label: '🥤 Boisson offerte', color: '#ffc480', probability: 0.15 },
  { id: 5, label: '🍰 Pâtisserie offerte', color: '#ffd499', probability: 0.01 }
]

function WheelOfFortune() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [selectedReward, setSelectedReward] = useState(null)
  const [canSpin, setCanSpin] = useState(true)

  const participationToken = location.state?.participationToken
  const userName = location.state?.userName

  useEffect(() => {
    if (!participationToken) {
      navigate('/submit-review')
    }
  }, [participationToken, navigate])

  const spinWheel = async () => {
    if (isSpinning || !canSpin) return

    setIsSpinning(true)
    setCanSpin(false)

    try {
      // Appel API pour obtenir la récompense
      const response = await axios.post('/api/rewards/spin', {
        token: participationToken
      })

      const rewardData = response.data.reward
      const rewardIndex = REWARDS.findIndex(r => r.id === rewardData.id)
      
      // Calcul de la rotation
      const segmentAngle = 360 / REWARDS.length
      const targetRotation = 360 * 5 + (rewardIndex * segmentAngle) + (segmentAngle / 2)
      
      setRotation(targetRotation)

      // Animation terminée après 5 secondes
      setTimeout(() => {
        setIsSpinning(false)
        setSelectedReward(rewardData)
        
        // Redirection vers la page de succès après 2 secondes
        setTimeout(() => {
          navigate('/success', { 
            state: { 
              reward: rewardData,
              userName: userName,
              code: response.data.code
            } 
          })
        }, 2000)
      }, 5000)

    } catch (error) {
      console.error('Erreur lors du spin:', error)
      alert('Une erreur est survenue. Veuillez réessayer.')
      setIsSpinning(false)
      setCanSpin(true)
    }
  }

  return (
    <div className="page wheel-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="page-title">🎰 La Roue de la Chance</h1>
          <p className="page-subtitle">
            {userName ? `${userName}, c` : 'C'}'est parti ! Tournez la roue et découvrez votre récompense
          </p>

          <div className="wheel-container">
            <div className="wheel-wrapper">
              {/* Indicateur */}
              <div className="wheel-pointer">▼</div>

              {/* La roue */}
              <div 
                className="wheel"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
                }}
              >
                {REWARDS.map((reward, index) => {
                  const angle = (360 / REWARDS.length) * index
                  return (
                    <div
                      key={reward.id}
                      className="wheel-segment"
                      style={{
                        transform: `rotate(${angle}deg)`,
                        backgroundColor: reward.color
                      }}
                    >
                      <div className="segment-text">
                        {reward.label}
                      </div>
                    </div>
                  )
                })}
                
                {/* Centre de la roue */}
                <div className="wheel-center">
                  <span>🎁</span>
                </div>
              </div>
            </div>

            <button
              className={`btn btn-primary btn-spin ${isSpinning ? 'spinning' : ''}`}
              onClick={spinWheel}
              disabled={!canSpin || isSpinning}
            >
              {isSpinning ? '🔄 Rotation...' : '🎰 TOURNER LA ROUE'}
            </button>

            {selectedReward && !isSpinning && (
              <motion.div
                className="reward-announcement"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2>🎉 Félicitations !</h2>
                <p className="reward-text">{selectedReward.label}</p>
                <p className="redirect-text">Redirection vers votre récompense...</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default WheelOfFortune
