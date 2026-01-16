import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import VerifyReview from './pages/VerifyReview'
import WheelOfFortune from './pages/WheelOfFortune'
import Reward from './pages/Reward'
import Admin from './pages/Admin'
import RGPD from './pages/RGPD'
import ValidateReward from './pages/ValidateReward'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/verify-review" element={<VerifyReview />} />
          <Route path="/wheel" element={<WheelOfFortune />} />
          <Route path="/reward" element={<Reward />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/rgpd" element={<RGPD />} />
          <Route path="/validate/:code" element={<ValidateReward />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
