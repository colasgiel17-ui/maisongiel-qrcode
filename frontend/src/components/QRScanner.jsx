import { useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import axios from '../services/api'
import './QRScanner.css'

function QRScanner({ onScanSuccess, onClose }) {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const startScanner = () => {
    setScanning(true)
    setError(null)

    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 }
    })

    scanner.render(async (decodedText) => {
      scanner.clear()
      setScanning(false)

      try {
        // Vérifier et valider le code
        const response = await axios.post('/api/admin/validate-reward', {
          code: decodedText
        })

        if (response.data.success) {
          setResult({
            success: true,
            reward: response.data.reward,
            user: response.data.userName
          })
          onScanSuccess && onScanSuccess(response.data)
        } else {
          setError(response.data.message || 'Code invalide')
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors de la validation')
      }
    }, (errorMessage) => {
      console.log('Scan error:', errorMessage)
    })
  }

  return (
    <div className="qr-scanner-modal">
      <div className="qr-scanner-content">
        <div className="qr-scanner-header">
          <h2>📷 Scanner un QR Code</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {!scanning && !result && !error && (
          <div className="scanner-start">
            <p>Scannez le QR Code du client pour valider sa récompense</p>
            <button className="btn btn-primary" onClick={startScanner}>
              📸 Démarrer le scan
            </button>
          </div>
        )}

        {scanning && (
          <div className="scanner-active">
            <div id="qr-reader"></div>
            <button className="btn btn-outline" onClick={() => {
              setScanning(false)
              window.location.reload()
            }}>
              Annuler
            </button>
          </div>
        )}

        {result && result.success && (
          <div className="scan-success">
            <div className="success-icon">✅</div>
            <h3>Récompense validée !</h3>
            <div className="reward-info">
              <p><strong>Client :</strong> {result.user}</p>
              <p><strong>Récompense :</strong> {result.reward}</p>
            </div>
            <button className="btn btn-primary" onClick={onClose}>
              Fermer
            </button>
          </div>
        )}

        {error && (
          <div className="scan-error">
            <div className="error-icon">❌</div>
            <h3>Erreur</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => {
              setError(null)
              startScanner()
            }}>
              Réessayer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default QRScanner
