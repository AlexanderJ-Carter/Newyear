import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Memories from './pages/Memories'
import Knowledge from './pages/Knowledge'
import { useEffect, useState } from 'react'

function App() {
  const location = useLocation()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟初始加载
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: '#C02C38', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', color: '#D4AF37', zIndex: 9999
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px', animation: 'breath 2s infinite' }}>🏮</div>
        <div style={{ fontFamily: 'Noto Serif SC', letterSpacing: '4px' }}>正在唤醒年味...</div>
        <style>{`@keyframes breath { 50% { transform: scale(1.1); opacity: 0.8; } }`}</style>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/knowledge" element={<Knowledge />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default App
