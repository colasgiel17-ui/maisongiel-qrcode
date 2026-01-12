import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import './RGPD.css'

function RGPD() {
  const navigate = useNavigate()

  return (
    <>
      <div className="rgpd-page">
        <div className="container">
          <div className="rgpd-content">
            <button className="btn-back" onClick={() => navigate('/')}>
              ← Retour à l'accueil
            </button>

            <h1>📋 Politique de confidentialité & RGPD</h1>

            <section>
              <h2>1. Collecte des données</h2>
              <p>
                Nous collectons uniquement les données nécessaires pour la participation au jeu-concours :
                nom, email et lien d'avis Google. Ces données sont conservées de manière sécurisée.
              </p>
            </section>

            <section>
              <h2>2. Utilisation des données</h2>
              <p>
                Vos données sont utilisées exclusivement pour :
              </p>
              <ul>
                <li>Gérer votre participation au jeu-concours</li>
                <li>Vous attribuer une récompense</li>
                <li>Valider votre récompense en magasin</li>
              </ul>
            </section>

            <section>
              <h2>3. Protection des données</h2>
              <p>
                Nous mettons en œuvre toutes les mesures techniques et organisationnelles nécessaires
                pour assurer la sécurité de vos données personnelles.
              </p>
            </section>

            <section>
              <h2>4. Vos droits</h2>
              <p>
                Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression
                et d'opposition au traitement de vos données. Pour exercer ces droits, contactez-nous à :
              </p>
              <p><strong>contact@maisongiel.com</strong></p>
            </section>

            <section>
              <h2>5. Durée de conservation</h2>
              <p>
                Vos données sont conservées pendant la durée du jeu-concours et supprimées 30 jours
                après la validation de votre récompense.
              </p>
            </section>

            <section>
              <h2>6. Cookies</h2>
              <p>
                Ce site utilise uniquement des cookies techniques nécessaires au bon fonctionnement
                de l'application (session utilisateur).
              </p>
            </section>

            <section>
              <h2>📧 Contact</h2>
              <p>
                <strong>Maison Giel</strong><br />
                Saint-Yrieix-sur-Charente, France<br />
                Email: contact@maisongiel.com<br />
                Site: <a href="https://maisongiel.com" target="_blank" rel="noopener noreferrer">maisongiel.com</a>
              </p>
            </section>

            <p className="update-date">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default RGPD
