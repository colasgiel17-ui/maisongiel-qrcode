import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>🎁 Maison Giel</h1>
          </Link>
          <nav className="nav">
            <Link to="/" className="nav-link">Accueil</Link>
            <Link to="/submit-review" className="nav-link">Participer</Link>
            <Link to="/admin" className="nav-link">Admin</Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
