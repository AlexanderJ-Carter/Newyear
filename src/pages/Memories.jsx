import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import UploadModal from '../components/UploadModal'

export default function Memories() {
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedItem, setSelectedItem] = useState(null)
  const [showUpload, setShowUpload] = useState(false)

  // 判断是否为静态模式 (GitHub Pages)
  const isStatic = import.meta.env.VITE_APP_MODE === 'static'

  // 从 API 或 静态JSON 加载数据
  const fetchMemories = async () => {
    try {
      // 静态模式读取 public/data/memories.json，本地模式读取 API
      const url = isStatic ? '/data/memories.json' : '/api/memories'
      const res = await fetch(url)
      const data = await res.json()
      setMemories(data)
    } catch (err) {
      console.error('加载记忆失败:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMemories()
  }, [])

  const handleUploadSuccess = (newMemory) => {
    setMemories(prev => [newMemory, ...prev])
  }
  
  const handleDelete = async (e, id) => {
    e.stopPropagation() 
    if (!window.confirm('确定要永久删除这条记忆吗？')) return

    try {
      const res = await fetch(`/api/memories/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setMemories(prev => prev.filter(item => item.id !== id))
      } else {
        alert('删除失败: ' + data.error)
      }
    } catch (err) {
      alert('网络错误，无法删除')
    }
  }
  
  const filteredData = filter === 'all' 
    ? memories 
    : memories.filter(item => item.type === filter)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-container container">
      <header style={{ textAlign: 'center', padding: '60px 0 40px', position: 'relative' }}>
        <h1 style={{ marginBottom: '10px' }}>时光宝盒</h1>
        <p style={{ color: '#888' }}>珍藏每一个温暖的瞬间</p>
        
        {/* 仅在非静态模式下显示上传按钮 */}
        {!isStatic && (
          <button 
            onClick={() => setShowUpload(true)}
            style={{
              position: 'absolute', right: 0, top: '60px',
              background: '#C02C38', color: '#fff', padding: '10px 20px', borderRadius: '30px',
              display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 4px 15px rgba(192,44,56,0.3)'
            }}
          >
            <span>📤</span> <span style={{fontSize: '0.9rem'}}>上传记忆</span>
          </button>
        )}
      </header>

      {/* 筛选器 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px' }}>
        {['all', 'video', 'photo'].map(type => (
          <button 
            key={type}
            onClick={() => setFilter(type)}
            style={{
              padding: '8px 20px', borderRadius: '20px', transition: '0.3s',
              background: filter === type ? '#C02C38' : '#fff',
              color: filter === type ? '#fff' : '#4A4A4A',
              border: filter === type ? '1px solid #C02C38' : '1px solid rgba(0,0,0,0.1)'
            }}
          >
            {type === 'all' ? '全部' : type === 'video' ? '视频' : '照片'}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#888' }}>正在读取记忆...</div>
      ) : (
        <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px', paddingBottom: '60px' }}>
          <AnimatePresence>
            {filteredData.map(item => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
                onClick={() => setSelectedItem(item)}
                style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
              >
                {/* 仅在非静态模式下显示删除按钮 */}
                {!isStatic && (
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    style={{
                      position: 'absolute', top: '10px', right: '10px', zIndex: 10,
                      width: '30px', height: '30px', borderRadius: '50%',
                      background: 'rgba(0,0,0,0.6)', color: '#fff',
                      display: 'flex', justifyContent: 'center', alignItems: 'center',
                      border: 'none', cursor: 'pointer', transition: '0.2s'
                    }}
                    title="删除"
                    onMouseEnter={e => e.target.style.background = '#ff4444'}
                    onMouseLeave={e => e.target.style.background = 'rgba(0,0,0,0.6)'}
                  >
                    🗑️
                  </button>
                )}

                <div style={{ width: '100%', aspectRatio: '16/9', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                  {item.type === 'video' ? (
                     <>
                       <video src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                       <div style={{ position: 'absolute', width: '50px', height: '50px', background: 'rgba(0,0,0,0.6)', borderRadius: '50%', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}>▶</div>
                     </>
                  ) : (
                     <img src={item.url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <div style={{ padding: '20px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span style={{ fontSize: '0.8rem', color: '#C02C38', background: 'rgba(192,44,56,0.08)', padding: '4px 8px', borderRadius: '4px' }}>
                       {item.type === 'video' ? '视频' : '照片'}
                     </span>
                     <span style={{ fontSize: '0.8rem', color: '#999' }}>{item.date}</span>
                   </div>
                   <h3 style={{ fontSize: '1.1rem', margin: '8px 0', fontWeight: 700 }}>{item.title}</h3>
                   <p style={{ fontSize: '0.9rem', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <UploadModal onClose={() => setShowUpload(false)} onUploadSuccess={handleUploadSuccess} />
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.95)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <div onClick={e => e.stopPropagation()} style={{ maxWidth: '90%', maxHeight: '90%' }}>
              {selectedItem.type === 'video' ? (
                <video src={selectedItem.url} controls autoPlay style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px' }} />
              ) : (
                <img src={selectedItem.url} alt={selectedItem.title} style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px' }} />
              )}
              <h3 style={{ color: '#fff', textAlign: 'center', marginTop: '10px' }}>{selectedItem.title}</h3>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}