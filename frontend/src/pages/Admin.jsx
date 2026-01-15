import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Html5QrcodeScanner } from 'html5-qrcode'
import axios from '../services/api'
import './Admin.css'

function Admin() {
  const navigate = useNavigate()
  const [authenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)
  const [participations, setParticipations] = useState([])
  const [scanning, setScanning] = useState(false)
  const [validationResult, setValidationResult] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      setAuthenticated(true)
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
        setAuthenticated(true)
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
    setAuthenticated(false)
  }

  const startScanner = () => {
    setScanning(true)
    setValidationResult(null)

    setTimeout(() => {
      const scanner = new Html5QrcodeScanner('qr-reader', {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      }, false)

      scanner.render(async (decodedText) => {
        scanner.clear()
        handleScan(decodedText)
      })
    }, 100)
  }

  const handleScan = async (decodedText) => {
    console.log('QR Code scanné:', decodedText)
    
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.post('/api/admin/validate', 
        { code: decodedText },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        // Afficher le résultat dans une modale
        setValidationResult({
          success: true,
          name: response.data.name,
          reward: response.data.reward
        })
        
        // Rafraîchir les stats
        loadData()
        
        // Arrêter le scan
        setScanning(false)
      }
    } catch (error) {
      setValidationResult({
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la validation'
      })
    }
  }

  const closeScanner = () => {
    setScanning(false)
    setValidationResult(null)
  }

  if (!authenticated) {
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>📋 Participations récentes</h2>
            <span style={{ 
              background: 'var(--primary-color)', 
              color: 'white', 
              padding: '0.5rem 1rem', 
              borderRadius: '2rem',
              fontWeight: '700'
            }}>
              {participations.length} participation{participations.length > 1 ? 's' : ''}
            </span>
          </div>
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

        {scanning && (
          <div className="modal-overlay" onClick={closeScanner}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>📷 Scanner QR Code</h2>
                <button className="close-btn" onClick={closeScanner}>✕</button>
              </div>
              
              <div id="qr-reader"></div>
            </div>
          </div>
        )}

        {/* Modale de résultat de validation */}
        {validationResult && (
          <div className="validation-modal-overlay" onClick={() => setValidationResult(null)}>
            <div className="validation-modal" onClick={(e) => e.stopPropagation()}>
              {validationResult.success ? (
                <>
                  <div className="validation-icon success">✅</div>
                  <h2>Récompense validée !</h2>
                  <div className="validation-details">
                    <p className="customer-name">👤 {validationResult.name}</p>
                    <p className="reward-type">🎁 {validationResult.reward}</p>
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setValidationResult(null)}
                  >
                    OK
                  </button>
                </>
              ) : (
                <>
                  <div className="validation-icon error">❌</div>
                  <h2>Erreur</h2>
                  <p className="error-text">{validationResult.message}</p>
                  <button 
                    className="btn btn-outline"
                    onClick={() => setValidationResult(null)}
                  >
                    Réessayer
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
