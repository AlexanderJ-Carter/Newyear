import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// --- 数据源 ---
const CONTENT_DATA = {
  history: {
    title: '千年文脉 · 历史渊源',
    intro: '春节，即农历新年，是一年之岁首、传统意义上的年节。俗称新春、新岁、岁旦等，口头上又称过年、过大年。',
    items: [
      {
        title: '起源：上古祭祀',
        icon: '🔥',
        desc: '春节历史悠久，由上古时代岁首祈年祭祀演变而来。万物本乎天、人本乎祖，祈年祭祀、敬天法祖，报本反始也。'
      },
      {
        title: '传说：年兽的故事',
        icon: '🦁',
        desc: '相传古时有一叫“年”的怪兽，头长触角，凶猛异常。人们发现年兽怕红、怕火、怕响声，于是便有了贴红联、放鞭炮的习俗。'
      },
      {
        title: '定型：汉武太初',
        icon: '📜',
        desc: '汉武帝时期颁行《太初历》，正式确立夏正（农历一月）为岁首。此后两千多年，春节的时间基本固定下来。'
      }
    ]
  },
  customs: {
    title: '礼仪之邦 · 岁时习俗',
    intro: '春节期间的庆祝活动极为丰富多样，带有浓郁的民族特色。',
    items: [
      {
        title: '腊月廿四 · 扫尘',
        icon: '🧹',
        desc: '“腊月二十四，掸尘扫房子”。北方称“扫房”，南方称“掸尘”。寓意除旧布新，把一切“穷运”、“晦气”统统扫出门。'
      },
      {
        title: '大年三十 · 守岁',
        icon: '🏮',
        desc: '除夕夜灯火通明，全家团聚，通宵不眠，名为“守岁”。寓意对流逝岁月的惜别，以及对来临新岁的殷切期盼。'
      },
      {
        title: '正月初一 · 拜年',
        icon: '🧧',
        desc: '早晨，晚辈要先向长辈拜年，祝福长辈健康长寿。长辈受拜以后，将事先准备好的“压岁钱”分给晚辈。'
      },
      {
        title: '正月十五 · 元宵',
        icon: '🍡',
        desc: '赏花灯、吃汤圆、猜灯谜、放烟花。元宵节的结束，标志着过年活动的正式落幕。'
      }
    ]
  },
  food: {
    title: '舌尖中国 · 吉祥美食',
    intro: '在春节，每一道菜都不仅仅是食物，更是一份美好的祝福。',
    items: [
      {
        title: '饺子 · 招财进宝',
        icon: '🥟',
        desc: '形似元宝，寓意招财进宝。饺子谐音“交子”，意为新旧交替。有的饺子里还会包入硬币，吃到的人更有福气。'
      },
      {
        title: '鱼 · 年年有余',
        icon: '🐟',
        desc: '无鱼不成席。鱼谐音“余”，象征着富贵和盈余。吃鱼时通常要留头留尾，寓意有头有尾，从年头富到年尾。'
      },
      {
        title: '年糕 · 步步高升',
        icon: '🍰',
        desc: '年糕谐音“年高”，寓意人们的工作和生活一年比一年提高。南方多吃甜年糕，北方则有炸年糕等做法。'
      },
      {
        title: '春卷 · 迎春纳福',
        icon: '🌯',
        desc: '立春吃春卷，是中国民间的传统习俗。春卷金黄酥脆，形状像金条，也寓意着黄金万两。'
      }
    ]
  },
  zodiac: {
    title: '丙午马年 · 腾飞之岁',
    intro: '2026年是农历丙午年（马年），五行属火，是充满活力与激情的一年。',
    items: [
      {
        title: '生肖性格',
        icon: '🐎',
        desc: '马年出生的人通常性格开朗、思维敏捷、装扮入时、善于辞令、洞察力强。他们崇尚自由，充满精力。'
      },
      {
        title: '马年寓意',
        icon: '🚀',
        desc: '马象征着“龙马精神”，代表着进取、奋斗和腾飞。成语“马到成功”、“一马当先”都寄托了人们对事业顺遂的美好祝愿。'
      },
      {
        title: '流年运势',
        icon: '🔥',
        desc: '丙午年为“天河水”命，又是“火马”之年。火主礼，象征着热情与繁荣。这一年适合开拓创新，敢于冒险。'
      }
    ]
  }
}

export default function Knowledge() {
  const [activeTab, setActiveTab] = useState('history')

  const tabs = [
    { id: 'history', label: '渊源' },
    { id: 'customs', label: '习俗' },
    { id: 'food', label: '美食' },
    { id: 'zodiac', label: '马年' },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="page-container container"
      style={{ paddingBottom: '80px' }}
    >
      {/* 头部 */}
      <header style={{ textAlign: 'center', padding: '60px 0 40px' }}>
        <h1 style={{ marginBottom: '15px', fontSize: '2.5rem', color: '#2B2B2B' }}>春节文化殿堂</h1>
        <p style={{ color: '#888', fontFamily: 'Noto Serif SC', fontSize: '1.1rem' }}>
          传承千年文脉 · 感受华夏春韵
        </p>
      </header>

      {/* 标签导航 */}
      <div style={{ 
        display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '50px',
        flexWrap: 'wrap'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 30px',
              borderRadius: '50px',
              fontSize: '1.1rem',
              fontWeight: 600,
              fontFamily: 'Noto Serif SC',
              transition: 'all 0.3s ease',
              background: activeTab === tab.id ? '#C02C38' : '#fff',
              color: activeTab === tab.id ? '#fff' : '#4A4A4A',
              border: activeTab === tab.id ? '1px solid #C02C38' : '1px solid rgba(0,0,0,0.1)',
              boxShadow: activeTab === tab.id ? '0 8px 20px rgba(192, 44, 56, 0.3)' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* 版块介绍 */}
          <div style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '800px', margin: '0 auto 40px' }}>
            <h2 style={{ color: '#C02C38', marginBottom: '15px' }}>{CONTENT_DATA[activeTab].title}</h2>
            <p style={{ color: '#666', lineHeight: 1.8 }}>{CONTENT_DATA[activeTab].intro}</p>
          </div>

          {/* 卡片网格 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '30px' 
          }}>
            {CONTENT_DATA[activeTab].items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{ 
                  background: '#fff', 
                  borderRadius: '16px', 
                  padding: '30px', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.02)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                whileHover={{ y: -5, boxShadow: '0 15px 35px rgba(0,0,0,0.08)' }}
              >
                {/* 装饰背景角 */}
                <div style={{
                  position: 'absolute', top: -20, right: -20, 
                  width: '100px', height: '100px', 
                  background: 'linear-gradient(135deg, transparent 50%, rgba(212, 175, 55, 0.1) 50%)',
                  borderRadius: '50%'
                }}></div>

                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '20px', 
                  background: 'rgba(255,248,240,1)', 
                  width: '80px', height: '80px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '20px',
                  color: '#C02C38'
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: '#2B2B2B' }}>{item.title}</h3>
                <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.95rem', textAlign: 'justify' }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 底部点缀 */}
      <div style={{ marginTop: '80px', textAlign: 'center', opacity: 0.6 }}>
        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🧧</div>
        <p style={{ fontFamily: 'Noto Serif SC', color: '#C02C38' }}>百节年为首 · 四季春为先</p>
      </div>

    </motion.div>
  )
}