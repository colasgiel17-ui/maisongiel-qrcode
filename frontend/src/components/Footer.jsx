import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>🏛️ Maison Giel</h3>
          <p>Boulangerie • Pâtisserie artisanale</p>
        </div>

        <div className="footer-section">
          <h4>📍 Adresse</h4>
          <p>Saint-Yrieix-Sur-Charente</p>
          <p>16710, France</p>
        </div>

        <div className="footer-section">
          <h4>📞 Contact</h4>
          <p>
            <a href="tel:0545381478">05 45 38 14 78</a>
          </p>
          <p>
            <a href="https://maisongiel.com/contact" target="_blank" rel="noopener noreferrer">
              ✉️ Nous contacter
            </a>
          </p>
        </div>

        <div className="footer-section">
          <h4>🔗 Liens utiles</h4>
          <p>
            <a href="https://maisongiel.com" target="_blank" rel="noopener noreferrer">
              🌐 Site principal
            </a>
          </p>
          <p>
            <a href="https://www.google.com/maps/place/Boulangerie+P%C3%A2tisserie+Maison+Giel+Saint-Yrieix-Sur-Charente" target="_blank" rel="noopener noreferrer">
              ⭐ Avis Google
            </a>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Maison Giel. Tous droits réservés.</p>
        <p className="footer-credits">
          <a href="/mentions-legales">Mentions légales</a> • 
          <a href="/politique-confidentialite"> Politique de confidentialité</a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
