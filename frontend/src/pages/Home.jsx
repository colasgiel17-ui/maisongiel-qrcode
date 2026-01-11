import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="page home-page">
      <div className="container">
        <div className="home-content">
          <motion.div
            className="card hero-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>🎁 Gagnez des récompenses en laissant votre avis !</h2>
            
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>📝 Laissez un avis</h3>
                  <p>Partagez votre expérience sur Google Maps</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>🎰 Tournez la roue</h3>
                  <p>Tentez votre chance pour gagner une récompense</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>🎉 Récupérez votre prix</h3>
                  <p>Profitez de votre récompense en magasin</p>
                </div>
              </div>
            </div>

            <div className="cta-buttons">
              <button 
                className="btn btn-primary btn-large"
                onClick={() => navigate('/submit-review')}
              >
                ✨ J'ai laissé un avis !
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => window.open('https://www.google.com/maps/place/Boulangerie+P%C3%A2tisserie+Maison+Giel+Saint-Yrieix-Sur-Charente/@45.6771281,0.1186605,601m/data=!3m2!1e3!4b1!4m6!3m5!1s0x47fe2fcf4f8a3a2b:0xdd9957b5f6e04651!8m2!3d45.6771244!4d0.1212354!16s%2Fg%2F11w4xsl4_r?entry=ttu&g_ep=EgoyMDI2MDEwNi4wIKXMDSoASAFQAw%3D%3D', '_blank')}
              >
                📝 Laisser un avis Google
              </button>
            </div>
          </motion.div>

          <motion.div
            className="card info-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2>🎁 Récompenses disponibles</h2>
            <ul className="rewards-list">
              <li>☕ Café offert</li>
              <li>🥤 Boisson offerte</li>
              <li>🍰 Pâtisserie offerte</li>
              <li>💰 1€ de réduction</li>
              <li>💰 2€ de réduction</li>
            </ul>
            <p className="info-text">
              ⚠️ Une seule participation par personne. Conforme à la réglementation RGPD.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Home
