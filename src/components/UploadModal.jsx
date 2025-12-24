import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function UploadModal({ onClose, onUploadSuccess }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !title) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('description', desc)
    // 自动判断类型
    const type = file.type.startsWith('video') ? 'video' : 'photo'
    formData.append('type', type)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      
      if (data.success) {
        onUploadSuccess(data.memory)
        onClose()
      } else {
        alert('上传失败: ' + data.error)
      }
    } catch (err) {
      alert('上传出错，请检查服务器是否启动')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'rgba(0,0,0,0.8)', zIndex: 2000,
        display: 'flex', justifyContent: 'center', alignItems: 'center'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', padding: '30px', borderRadius: '16px', width: '90%', maxWidth: '500px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }}
      >
        <h2 style={{ marginBottom: '20px', color: '#C02C38', textAlign: 'center' }}>📤 添加新记忆</h2>
        
        <div 
          onClick={() => fileInputRef.current.click()}
          style={{
            border: '2px dashed #C02C38', borderRadius: '12px', padding: '20px',
            textAlign: 'center', cursor: 'pointer', background: 'rgba(192,44,56,0.05)',
            marginBottom: '20px', minHeight: '150px', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center'
          }}
        >
          {preview ? (
            file.type.startsWith('video') ? (
               <video src={preview} style={{ maxHeight: '200px', maxWidth: '100%' }} />
            ) : (
               <img src={preview} alt="preview" style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: '8px' }} />
            )
          ) : (
            <>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📁</div>
              <p style={{ color: '#888' }}>点击或拖拽上传图片/视频</p>
            </>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*,video/*" 
            style={{ display: 'none' }} 
          />
        </div>

        <input 
          type="text" placeholder="标题 (必填)" value={title} onChange={e => setTitle(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px', outline: 'none' }}
        />
        
        <textarea 
          placeholder="描述这个美好的瞬间..." value={desc} onChange={e => setDesc(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px', height: '80px', outline: 'none', resize: 'none' }}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={onClose}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#f5f5f5', color: '#666' }}
          >
            取消
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isUploading || !file || !title}
            style={{ 
              flex: 1, padding: '12px', borderRadius: '8px', 
              background: isUploading ? '#ccc' : '#C02C38', 
              color: '#fff', cursor: isUploading ? 'not-allowed' : 'pointer'
            }}
          >
            {isUploading ? '上传中...' : '确认上传'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
