import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from '../services/api'
import './SubmitReview.css'

function SubmitReview() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reviewLink: '',
    screenshot: null,
    consent: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }

    if (!formData.reviewLink && !formData.screenshot) {
      setError('Veuillez fournir soit le lien de votre avis, soit une capture d\'écran')
      return
    }

    if (!formData.consent) {
      setError('Veuillez accepter la politique de confidentialité')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('email', formData.email)
      if (formData.reviewLink) data.append('reviewLink', formData.reviewLink)
      if (formData.screenshot) data.append('screenshot', formData.screenshot)

      console.log('📤 Envoi du formulaire avec:', { 
        name: formData.name, 
        email: formData.email, 
        reviewLink: !!formData.reviewLink, 
        screenshot: !!formData.screenshot 
      })

      const response = await axios.post('/api/reviews/submit', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      console.log('✅ Réponse reçue:', response.data)

      if (response.data.success) {
        const userId = response.data.userId
        console.log('✅ userId reçu:', userId)
        
        // Rediriger vers la roue avec le userId
        navigate('/wheel', { 
          state: { userId: userId }
        })
      }
    } catch (err) {
      console.error('❌ Erreur:', err)
      setError(err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page submit-review-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="page-title">📝 Soumettez votre avis</h1>
          <p className="page-subtitle">
            Validez votre participation en quelques clics
          </p>

          <div className="form-container">
            <div className="card">
              <form onSubmit={handleSubmit} className="review-form">
                <div className="form-group">
                  <label className="form-label">
                    Nom complet <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="Jean Dupont"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="jean.dupont@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <small className="form-help">
                    Votre email ne sera utilisé que pour vous envoyer votre récompense
                  </small>
                </div>

                <div className="form-section">
                  <h3>Preuve de votre avis</h3>
                  <p className="section-description">
                    Choisissez l'une des deux options ci-dessous
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    🔗 Lien de l'avis Google
                  </label>
                  <input
                    type="url"
                    name="reviewLink"
                    className="form-input"
                    placeholder="https://maps.app.goo.gl/... ou https://www.google.com/maps/..."
                    value={formData.reviewLink}
                    onChange={handleChange}
                  />
                  <small className="form-help">
                    ⚠️ Important : Le lien doit être un avis Google Maps de <strong>Boulangerie Pâtisserie Maison Giel Saint-Yrieix-Sur-Charente</strong>
                    <br />
                    � Astuce : Après avoir publié votre avis, cliquez sur "Partager" puis copiez le lien court (maps.app.goo.gl)
                  </small>
                </div>

                <div className="form-divider">
                  <span>OU</span>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    📷 Capture d'écran de l'avis
                  </label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      name="screenshot"
                      id="screenshot"
                      className="file-input"
                      accept="image/*"
                      onChange={handleChange}
                    />
                    <label htmlFor="screenshot" className="file-input-label">
                      {formData.screenshot ? formData.screenshot.name : '📎 Choisir un fichier'}
                    </label>
                  </div>
                  <small className="form-help">
                    Formats acceptés : JPG, PNG (max 5 Mo)
                  </small>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      required
                    />
                    <span>
                      J'accepte la <a href="/privacy" target="_blank">politique de confidentialité</a> et 
                      le traitement de mes données personnelles (RGPD) <span className="required">*</span>
                    </span>
                  </label>
                </div>

                {error && (
                  <div className="error-message">
                    ⚠️ {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary btn-submit"
                  disabled={loading}
                >
                  {loading ? '⏳ Vérification en cours...' : '🎰 Accéder à la roue de la chance'}
                </button>
              </form>
            </div>

            <div className="card info-sidebar">
              <h3>💡 Conseils</h3>
              <ul className="tips-list">
                <li>
                  <strong>Comment trouver le lien de mon avis ?</strong>
                  <p>
                    1. Laissez votre avis sur Google Maps pour <strong>Maison Giel</strong><br/>
                    2. Une fois publié, cliquez sur votre profil<br/>
                    3. Sélectionnez votre avis → "Partager" → "Copier le lien"<br/>
                    4. Collez le lien ici
                  </p>
                </li>
                <li>
                  <strong>Je préfère envoyer une capture</strong>
                  <p>Faites une capture d'écran montrant clairement votre nom, votre avis et le nom de l'établissement <strong>Maison Giel</strong></p>
                </li>
                <li>
                  <strong>Mes données sont-elles protégées ?</strong>
                  <p>Oui ! Nous sommes 100% conformes RGPD. Vos données ne seront jamais vendues.</p>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SubmitReview
