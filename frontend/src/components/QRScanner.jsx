import { useState, useEffect } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import axios from '../services/api'
import './QRScanner.css'

function QRScanner({ onScanSuccess, onClose }) {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [scanner, setScanner] = useState(null)

  const startScanner = () => {
    setScanning(true)
    setError(null)

    const qrScanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      rememberLastUsedCamera: true,
      showTorchButtonIfSupported: true,
      showZoomSliderIfSupported: true,
      defaultZoomValueIfSupported: 2,
      supportedScanTypes: []
    }, /* verbose= */ false)

    qrScanner.render(async (decodedText) => {
      // Arrêter le scanner
      qrScanner.clear()
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
      // Erreur de scan (normal, on continue de scanner)
    })

    setScanner(qrScanner)
  }

  const stopScanner = () => {
    if (scanner) {
      scanner.clear()
      setScanner(null)
    }
    setScanning(false)
  }

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.clear()
      }
    }
  }, [scanner])

  return (
    <div className="qr-scanner-modal">
      <div className="qr-scanner-content">
        <div className="qr-scanner-header">
          <h2>📷 Scanner un QR Code</h2>
          <button className="close-btn" onClick={() => {
            stopScanner()
            onClose()
          }}>✕</button>
        </div>

        {!scanning && !result && !error && (
          <div className="scanner-start">
            <p>📱 Utilisez la caméra de votre appareil pour scanner le QR Code du client</p>
            <p className="permission-note">⚠️ Vous devrez autoriser l'accès à votre caméra</p>
            <button className="btn btn-primary btn-large" onClick={startScanner}>
              📸 Démarrer le scan
            </button>
          </div>
        )}

        {scanning && (
          <div className="scanner-active">
            <div id="qr-reader"></div>
            <p className="scan-instruction">Pointez la caméra vers le QR Code</p>
            <button className="btn btn-outline" onClick={stopScanner}>
              ❌ Annuler
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
            <button className="btn btn-primary" onClick={() => {
              stopScanner()
              onClose()
            }}>
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
