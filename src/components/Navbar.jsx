import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Navbar() {
  const linkStyle = ({ isActive }) => ({
    position: 'relative',
    color: isActive ? '#C02C38' : '#4A4A4A',
    fontWeight: 500
  })

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '70px',
      background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
      zIndex: 1000, borderBottom: '1px solid rgba(0,0,0,0.03)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem', fontFamily: 'Noto Serif SC', fontWeight: 700, color: '#C02C38' }}>
          <img src={`${import.meta.env.BASE_URL}assets/images/newyear-icon.svg`} alt="Logo" style={{ height: '32px' }} />
          <span>春节记忆馆</span>
        </NavLink>
        <div style={{ display: 'flex', gap: '30px' }}>
          {['首页', '文化殿堂', '时光宝盒'].map((text, index) => {
             const path = index === 0 ? '/' : index === 1 ? '/knowledge' : '/memories'
             return (
               <NavLink to={path} key={path} style={linkStyle}>
                 {({ isActive }) => (
                   <>
                     {text}
                     {isActive && (
                       <motion.div
                         layoutId="underline"
                         style={{ position: 'absolute', bottom: '-5px', left: 0, width: '100%', height: '2px', background: '#C02C38' }}
                       />
                     )}
                   </>
                 )}
               </NavLink>
             )
          })}
        </div>
      </div>
    </nav>
  )
}
