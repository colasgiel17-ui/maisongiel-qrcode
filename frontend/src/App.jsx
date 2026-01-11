import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import SubmitReview from './pages/SubmitReview'
import WheelOfFortune from './pages/WheelOfFortune'
import RewardSuccess from './pages/RewardSuccess'
import Admin from './pages/Admin'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/submit-review" element={<SubmitReview />} />
          <Route path="/wheel" element={<WheelOfFortune />} />
          <Route path="/success" element={<RewardSuccess />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
