import { motion } from 'framer-motion'

export default function Knowledge() {
  const sections = [
    { title: '历史由来', icon: '📜', content: '春节起源于上古时期的岁首祈年祭祀活动，距今已有4000多年的历史。' },
    { title: '传统习俗', icon: '🏮', content: '贴春联、放鞭炮、吃团圆饭、拜年送祝福...这些传统习俗承载着中华民族的文化记忆。' },
    { title: '马年寓意', icon: '🐎', content: '马象征着奔腾向前、积极进取。马年出生的人通常性格开朗、热情奔放。' }
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-container container">
      <header style={{ textAlign: 'center', padding: '60px 0 40px' }}>
        <h1 style={{ marginBottom: '10px' }}>春节文化殿堂</h1>
        <p style={{ color: '#888' }}>传承千年文脉，感受华夏春韵</p>
      </header>

      <div style={{ display: 'grid', gap: '40px', paddingBottom: '60px' }}>
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            style={{ background: '#fff', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', gap: '20px', alignItems: 'flex-start' }}
          >
            <div style={{ fontSize: '3rem', background: 'rgba(255,255,255,0.5)', padding: '10px', borderRadius: '12px' }}>
              {section.icon}
            </div>
            <div>
              <h2 style={{ marginBottom: '10px', color: '#C02C38' }}>{section.title}</h2>
              <p style={{ lineHeight: 1.8, color: '#4A4A4A' }}>{section.content}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
