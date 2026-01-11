import { useState, useEffect } from 'react'
import axios from '../services/api'
import QRScanner from '../components/QRScanner'
import './Admin.css'

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [stats, setStats] = useState(null)
  const [reviews, setReviews] = useState([])
  const [rewards, setRewards] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('stats')
  const [selectedReview, setSelectedReview] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showScanner, setShowScanner] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      setIsAuthenticated(true)
      loadData()
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/admin/login', credentials)
      localStorage.setItem('adminToken', response.data.token)
      setIsAuthenticated(true)
      loadData()
    } catch (error) {
      alert('Identifiants incorrects')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
    setStats(null)
    setReviews([])
    setRewards([])
  }

  const loadData = async () => {
    setLoading(true)
    const token = localStorage.getItem('adminToken')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    try {
      const [statsRes, reviewsRes, rewardsRes] = await Promise.all([
        axios.get('/api/admin/stats', config),
        axios.get('/api/admin/reviews', config),
        axios.get('/api/admin/rewards', config)
      ])
      
      setStats(statsRes.data)
      setReviews(reviewsRes.data)
      setRewards(rewardsRes.data)
    } catch (error) {
      console.error('Erreur chargement données:', error)
    } finally {
      setLoading(false)
    }
  }

  const viewReviewDetails = async (reviewId) => {
    const token = localStorage.getItem('adminToken')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    try {
      const response = await axios.get(`/api/admin/reviews/${reviewId}`, config)
      setSelectedReview(response.data)
      setShowModal(true)
    } catch (error) {
      console.error('Erreur chargement détails:', error)
      alert('Impossible de charger les détails de l\'avis')
    }
  }

  const verifyReview = async (reviewId) => {
    const token = localStorage.getItem('adminToken')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    try {
      await axios.patch(`/api/admin/reviews/${reviewId}/verify`, {}, config)
      alert('Avis vérifié avec succès')
      setShowModal(false)
      loadData() // Recharger les données
    } catch (error) {
      console.error('Erreur vérification:', error)
      alert('Erreur lors de la vérification')
    }
  }

  const deleteReview = async (reviewId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) return

    const token = localStorage.getItem('adminToken')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    try {
      await axios.delete(`/api/admin/reviews/${reviewId}`, config)
      alert('Avis supprimé avec succès')
      setShowModal(false)
      loadData() // Recharger les données
    } catch (error) {
      console.error('Erreur suppression:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const fetchParticipations = async () => {
    const token = localStorage.getItem('adminToken')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    try {
      const response = await axios.get('/api/admin/participations', config)
      setParticipations(response.data)
    } catch (error) {
      console.error('Erreur chargement participations:', error)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="page admin-page">
        <div className="container">
          <div className="login-container">
            <div className="card login-card">
              <h1>🔐 Connexion Administrateur</h1>
              <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                  <label className="form-label">Identifiant</label>
                  <input
                    type="text"
                    className="form-input"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mot de passe</label>
                  <input
                    type="password"
                    className="form-input"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Se connecter
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>🛡️ Tableau de bord Admin</h1>
          <div className="admin-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setShowScanner(true)}
            >
              📷 Scanner QR Code
            </button>
            <button className="btn btn-outline" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        </div>

        <div className="admin-tabs">
          <button 
            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📊 Statistiques
          </button>
          <button 
            className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            📝 Avis ({reviews.length})
          </button>
          <button 
            className={`tab ${activeTab === 'rewards' ? 'active' : ''}`}
            onClick={() => setActiveTab('rewards')}
          >
            🎁 Récompenses ({rewards.length})
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <>
            {activeTab === 'stats' && stats && (
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-value">{stats.totalParticipants}</div>
                  <div className="stat-label">Participants</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-value">{stats.totalReviews}</div>
                  <div className="stat-label">Avis Google</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🎁</div>
                  <div className="stat-value">{stats.totalRewards}</div>
                  <div className="stat-label">Récompenses distribuées</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-value">{stats.redemptionRate}%</div>
                  <div className="stat-label">Taux d'utilisation</div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="card data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map(review => (
                      <tr key={review.id}>
                        <td>{new Date(review.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td>{review.name}</td>
                        <td>{review.email}</td>
                        <td>
                          <span className={`status ${review.verified ? 'verified' : 'pending'}`}>
                            {review.verified ? '✅ Vérifié' : '⏳ En attente'}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn-small"
                            onClick={() => viewReviewDetails(review.id)}
                          >
                            Voir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'rewards' && (
              <div className="card data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Utilisateur</th>
                      <th>Récompense</th>
                      <th>Code</th>
                      <th>Utilisé</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rewards.map(reward => (
                      <tr key={reward.id}>
                        <td>{new Date(reward.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td>{reward.userName}</td>
                        <td>{reward.rewardName}</td>
                        <td><code>{reward.code}</code></td>
                        <td>
                          <span className={`status ${reward.used ? 'used' : 'available'}`}>
                            {reward.used ? '✅ Utilisé' : '🎫 Disponible'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de détails d'avis */}
      {showModal && selectedReview && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📝 Détails de l'avis</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h3>👤 Informations du participant</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Nom :</strong>
                    <span>{selectedReview.name}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Email :</strong>
                    <span>{selectedReview.email}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Date :</strong>
                    <span>{new Date(selectedReview.createdAt).toLocaleString('fr-FR')}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Adresse IP :</strong>
                    <span>{selectedReview.ipAddress}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Statut :</strong>
                    <span className={`status ${selectedReview.verified ? 'verified' : 'pending'}`}>
                      {selectedReview.verified ? '✅ Vérifié' : '⏳ En attente'}
                    </span>
                  </div>
                </div>
              </div>

              {selectedReview.reviewLink && (
                <div className="detail-section">
                  <h3>🔗 Lien de l'avis Google</h3>
                  <div className="link-box">
                    <a 
                      href={selectedReview.reviewLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="review-link"
                    >
                      {selectedReview.reviewLink}
                    </a>
                  </div>
                  <button 
                    className="btn btn-secondary btn-small"
                    onClick={() => window.open(selectedReview.reviewLink, '_blank')}
                  >
                    🔍 Ouvrir l'avis sur Google Maps
                  </button>
                </div>
              )}

              {selectedReview.screenshotPath && (
                <div className="detail-section">
                  <h3>📷 Capture d'écran</h3>
                  <div className="screenshot-container">
                    <img 
                      src={`/uploads/${selectedReview.screenshotPath}`} 
                      alt="Screenshot de l'avis"
                      className="screenshot-image"
                    />
                  </div>
                  <a 
                    href={`/uploads/${selectedReview.screenshotPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-small"
                  >
                    📥 Télécharger l'image
                  </a>
                </div>
              )}

              <div className="detail-section">
                <h3>🔒 Informations techniques</h3>
                <div className="tech-info">
                  <p><strong>Device Fingerprint :</strong></p>
                  <code>{selectedReview.deviceFingerprint}</code>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              {!selectedReview.verified && (
                <button 
                  className="btn btn-secondary"
                  onClick={() => verifyReview(selectedReview.id)}
                >
                  ✅ Vérifier l'avis
                </button>
              )}
              <button 
                className="btn btn-outline"
                onClick={() => deleteReview(selectedReview.id)}
                style={{ color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}
              >
                🗑️ Supprimer
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => setShowModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {showScanner && (
        <QRScanner 
          onClose={() => setShowScanner(false)}
          onScanSuccess={(data) => {
            setShowScanner(false)
            fetchParticipations()
          }}
        />
      )}
    </div>
  )
}

export default Admin
