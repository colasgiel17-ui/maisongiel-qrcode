import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      setAuthenticated(true)
      loadDashboard()
    }
  }, [])

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      
      const [statsRes, participationsRes] = await Promise.all([
        axios.get('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/admin/participations', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      setStats(statsRes.data.stats)
      setParticipations(participationsRes.data.participations)
    } catch (error) {
      console.error('Erreur chargement dashboard:', error)
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout()
      }
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await axios.post('/api/admin/login', {
        username,
        password
      })

      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token)
        setAuthenticated(true)
        loadDashboard()
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur de connexion')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setAuthenticated(false)
    navigate('/admin')
  }

  if (!authenticated) {
    return (
      <div className="page admin-page">
        <div className="container">
          <div className="login-card">
            <h1>🔒 Administration</h1>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="username">Identifiant</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="btn btn-primary btn-block">
                Se connecter
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
          <h1>📊 Tableau de bord</h1>
          <button onClick={handleLogout} className="btn btn-outline">
            Déconnexion
          </button>
        </div>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total participations</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-value">{stats.used}</div>
              <div className="stat-label">Récompenses utilisées</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">En attente</div>
            </div>
          </div>
        )}

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>📋 Toutes les participations</h2>
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

          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            💡 Les clients scannent leur QR code avec l'appareil photo de leur téléphone.
            Leur récompense s'affiche automatiquement sur une page publique.
          </p>

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
                      {p.reward_used === 1 || p.reward_used === true ? (
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
      </div>
    </div>
  )
}

export default Admin
