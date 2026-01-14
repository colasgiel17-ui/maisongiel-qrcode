import axios from 'axios'

// En production (Vercel), utilise l'URL du backend Render via VITE_API_URL
// En développement local, utilise localhost:3000
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

export default api
