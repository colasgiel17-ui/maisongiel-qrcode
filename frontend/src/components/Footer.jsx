import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Colonne 1: À propos */}
          <div className="footer-col">
            <h3>🏠 Maison Giel</h3>
            <p className="footer-description">
              Boulangerie artisanale à Saint-Yrieix-sur-Charente
            </p>
            <div className="footer-contact">
              <p>📍 Saint-Yrieix-sur-Charente, France</p>
              <p>📧 <a href="mailto:contact@maisongiel.com">contact@maisongiel.com</a></p>
              <p>🌐 <a href="https://maisongiel.com" target="_blank" rel="noopener noreferrer">maisongiel.com</a></p>
            </div>
          </div>

          {/* Colonne 2: Liens utiles */}
          <div className="footer-col">
            <h3>📋 Informations</h3>
            <ul className="footer-links">
              <li><a href="/rgpd">Politique de confidentialité</a></li>
              <li><a href="/rgpd">Mentions légales</a></li>
              <li><a href="/rgpd">Conditions générales</a></li>
              <li><a href="/rgpd">Protection des données (RGPD)</a></li>
            </ul>
          </div>

          {/* Colonne 3: Horaires */}
          <div className="footer-col">
            <h3>🕐 Horaires</h3>
            <ul className="footer-hours">
              <li><strong>Lun - Ven:</strong> 7h - 19h</li>
              <li><strong>Samedi:</strong> 7h - 19h</li>
              <li><strong>Dimanche:</strong> 7h - 13h</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Maison Giel. Tous droits réservés.</p>
          <p className="footer-credits">
            Site créé par <a href="https://trhom.com" target="_blank" rel="noopener noreferrer">TRHOM.COM</a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
