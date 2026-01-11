import './PrivacyPolicy.css'

function PrivacyPolicy() {
  return (
    <div className="page privacy-page">
      <div className="container">
        <h1 className="page-title">🔒 Politique de confidentialité</h1>
        
        <div className="card privacy-content">
          <section>
            <h2>1. Collecte des données</h2>
            <p>
              Dans le cadre de notre jeu-concours avec roue de la chance, nous collectons les données suivantes :
            </p>
            <ul>
              <li>Nom complet</li>
              <li>Adresse email</li>
              <li>Lien vers votre avis Google ou capture d'écran</li>
              <li>Adresse IP et empreinte du navigateur (pour éviter les fraudes)</li>
            </ul>
          </section>

          <section>
            <h2>2. Utilisation des données</h2>
            <p>Vos données personnelles sont utilisées uniquement pour :</p>
            <ul>
              <li>Valider votre participation au jeu-concours</li>
              <li>Vous envoyer votre récompense par email</li>
              <li>Prévenir les participations multiples (limite 1 par personne)</li>
              <li>Générer des statistiques anonymisées</li>
            </ul>
            <p>
              <strong>Nous ne vendons ni ne partageons vos données avec des tiers.</strong>
            </p>
          </section>

          <section>
            <h2>3. Conservation des données</h2>
            <p>
              Vos données sont conservées pendant 12 mois maximum, puis automatiquement supprimées.
              Les données d'avis Google sont stockées de manière sécurisée et ne sont consultées que pour la validation.
            </p>
          </section>

          <section>
            <h2>4. Vos droits (RGPD)</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul>
              <li><strong>Droit d'accès :</strong> Demander une copie de vos données</li>
              <li><strong>Droit de rectification :</strong> Corriger vos données</li>
              <li><strong>Droit à l'effacement :</strong> Supprimer vos données</li>
              <li><strong>Droit d'opposition :</strong> Refuser le traitement de vos données</li>
              <li><strong>Droit à la portabilité :</strong> Récupérer vos données dans un format lisible</li>
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous à : <strong>privacy@maisongiel.fr</strong>
            </p>
          </section>

          <section>
            <h2>5. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données :
            </p>
            <ul>
              <li>Chiffrement des données sensibles</li>
              <li>Accès restreint aux données (uniquement administrateurs)</li>
              <li>Sauvegardes régulières</li>
              <li>Serveurs sécurisés en Europe</li>
            </ul>
          </section>

          <section>
            <h2>6. Cookies</h2>
            <p>
              Nous utilisons des cookies techniques pour :
            </p>
            <ul>
              <li>Empêcher les participations multiples</li>
              <li>Améliorer l'expérience utilisateur</li>
              <li>Analyser le trafic du site (Google Analytics, anonymisé)</li>
            </ul>
            <p>
              Vous pouvez désactiver les cookies dans les paramètres de votre navigateur, 
              mais cela peut affecter le fonctionnement du site.
            </p>
          </section>

          <section>
            <h2>7. Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité ou l'exercice de vos droits, contactez-nous :
            </p>
            <ul>
              <li><strong>Email :</strong> privacy@maisongiel.fr</li>
              <li><strong>Adresse :</strong> Maison Giel, [Adresse complète]</li>
              <li><strong>Téléphone :</strong> +33 X XX XX XX XX</li>
            </ul>
          </section>

          <section>
            <h2>8. Modifications</h2>
            <p>
              Cette politique de confidentialité peut être modifiée à tout moment. 
              La version en vigueur est toujours disponible sur cette page.
            </p>
            <p><strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
          </section>

          <div className="rgpd-badge">
            <p>✅ <strong>Site 100% conforme RGPD</strong></p>
            <p>Vos données sont protégées et respectent la réglementation européenne sur la protection des données.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
