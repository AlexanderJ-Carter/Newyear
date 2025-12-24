import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const targetDate = new Date('2026-02-17T00:00:00+08:00')
    const timer = setInterval(() => {
      const now = new Date()
      const diff = targetDate - now

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        })
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const itemStyle = {
    background: 'rgba(255,255,255,0.8)', padding: '20px 30px', borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    minWidth: '120px', textAlign: 'center'
  }

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '60px' }}>
      {Object.entries(timeLeft).map(([unit, value]) => (
        <motion.div key={unit} style={itemStyle} whileHover={{ y: -5 }}>
          <div style={{ fontSize: '3.5rem', fontWeight: 700, color: '#C02C38', lineHeight: 1 }}>
            {value.toString().padStart(2, '0')}
          </div>
          <div style={{ color: '#888', marginTop: '5px', fontFamily: 'Noto Serif SC' }}>
            {unit === 'days' ? '天' : unit === 'hours' ? '时' : unit === 'minutes' ? '分' : '秒'}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="page-container"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative' }}
    >
      {/* 灯笼装饰 */}
      <motion.img src={`${import.meta.env.BASE_URL}assets/images/newyear-icon.svg`} alt="lantern" 
        style={{ position: 'absolute', top: '80px', left: '10%', width: '100px', zIndex: 1 }}
        animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.img src={`${import.meta.env.BASE_URL}assets/images/newyear-icon.svg`} alt="lantern" 
        style={{ position: 'absolute', top: '80px', right: '10%', width: '100px', zIndex: 1 }}
        animate={{ rotate: [5, -5, 5] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div style={{ marginTop: '100px' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '20px', background: 'linear-gradient(to bottom, #2B2B2B, #8E1E26)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          丙午马年 · 新春
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#888', letterSpacing: '5px', marginBottom: '50px', fontFamily: 'Noto Serif SC' }}>
          传承千年文脉 · 记录美好时光
        </p>

        <Countdown />

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Link to="/memories" style={{ 
            padding: '12px 30px', borderRadius: '50px', background: '#C02C38', color: '#fff', 
            boxShadow: '0 4px 15px rgba(192, 44, 56, 0.3)', fontSize: '1.1rem', fontWeight: 600 
          }}>
            📸 开启时光宝盒
          </Link>
          <Link to="/knowledge" style={{ 
            padding: '12px 30px', borderRadius: '50px', background: '#fff', color: '#C02C38', 
            border: '1px solid #C02C38', fontSize: '1.1rem', fontWeight: 600 
          }}>
            📚 探索春节文化
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
