import { useState, useEffect } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import axios from '../services/api'
import './Admin.css'

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)
  const [participations, setParticipations] = useState([])
  const [showScanner, setShowScanner] = useState(false)
  const [scanResult, setScanResult] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      setIsAuthenticated(true)
      loadData()
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await axios.post('/api/admin/login', { username, password })
      
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token)
        setIsAuthenticated(true)
        loadData()
      }
    } catch (error) {
      setError('Identifiants incorrects')
    }
  }

  const loadData = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const config = { headers: { Authorization: `Bearer ${token}` } }

      const [statsRes, partRes] = await Promise.all([
        axios.get('/api/admin/stats', config),
        axios.get('/api/admin/participations', config)
      ])

      setStats(statsRes.data.stats)
      setParticipations(partRes.data.participations)
    } catch (error) {
      console.error('Erreur chargement:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
  }

  const startScanner = () => {
    setShowScanner(true)
    setScanResult(null)

    setTimeout(() => {
      const scanner = new Html5QrcodeScanner('qr-reader', {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      }, false)

      scanner.render(async (decodedText) => {
        scanner.clear()
        
        try {
          const token = localStorage.getItem('adminToken')
          const response = await axios.post(
            '/api/admin/validate',
            { code: decodedText },
            { headers: { Authorization: `Bearer ${token}` } }
          )

          if (response.data.success) {
            setScanResult({
              success: true,
              name: response.data.name,
              reward: response.data.reward
            })
            loadData()
          }
        } catch (error) {
          setScanResult({
            success: false,
            message: error.response?.data?.message || 'Erreur'
          })
        }
      })
    }, 100)
  }

  const closeScanner = () => {
    setShowScanner(false)
    setScanResult(null)
  }

  if (!isAuthenticated) {
    return (
      <div className="page admin-page">
        <div className="container">
          <div className="card login-card">
            <h1>🔐 Admin</h1>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="submit" className="btn btn-primary btn-block">
                Connexion
              </button>
            </form>
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
              onClick={startScanner}
            >
              📷 Scanner QR Code
            </button>
            <button className="btn btn-outline" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        </div>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{stats.total}</h3>
              <p>Total Participations</p>
            </div>
            <div className="stat-card">
              <h3>{stats.pending}</h3>
              <p>En attente</p>
            </div>
            <div className="stat-card">
              <h3>{stats.used}</h3>
              <p>Utilisées</p>
            </div>
          </div>
        )}

        <div className="card">
          <h2>📋 Participations récentes</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Récompense</th>
                  <th>Code</th>
                  <th>Statut</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {participations.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.email}</td>
                    <td>{p.reward_type || '-'}</td>
                    <td>{p.reward_code || '-'}</td>
                    <td>
                      {p.reward_used === 1 ? (
                        <span className="badge badge-success">✓ Utilisé</span>
                      ) : p.reward_code ? (
                        <span className="badge badge-warning">En attente</span>
                      ) : (
                        <span className="badge badge-secondary">Pas de roue</span>
                      )}
                    </td>
                    <td>{new Date(p.created_at).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showScanner && (
          <div className="modal-overlay" onClick={closeScanner}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>📷 Scanner QR Code</h2>
                <button className="close-btn" onClick={closeScanner}>✕</button>
              </div>
              
              {!scanResult ? (
                <div id="qr-reader"></div>
              ) : scanResult.success ? (
                <div className="scan-success">
                  <div className="success-icon">✅</div>
                  <h3>Récompense validée !</h3>
                  <p><strong>Client :</strong> {scanResult.name}</p>
                  <p><strong>Récompense :</strong> {scanResult.reward}</p>
                  <button className="btn btn-primary" onClick={closeScanner}>
                    Fermer
                  </button>
                </div>
              ) : (
                <div className="scan-error">
                  <div className="error-icon">❌</div>
                  <h3>Erreur</h3>
                  <p>{scanResult.message}</p>
                  <button className="btn btn-primary" onClick={startScanner}>
                    Réessayer
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
