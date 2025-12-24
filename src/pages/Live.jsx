import { useEffect, useRef, useState, useCallback } from 'react'
import io from 'socket.io-client'
import { motion } from 'framer-motion'

const peerConnectionConfig = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
}

export default function Live() {
  const [role, setRole] = useState(null)
  const [status, setStatus] = useState('选择您的身份')
  const [videoDevices, setVideoDevices] = useState([])
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0)

  // --- State ---
  const [viewerCount, setViewerCount] = useState(0)
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  
  const videoRef = useRef(null)
  const socketRef = useRef(null)
  const peerConnections = useRef({})
  const localStream = useRef(null)
  const chatContainerRef = useRef(null)

  const initSocket = useCallback(() => {
    if (!socketRef.current) {
      const socketUrl = import.meta.env.DEV ? 'http://localhost:3001' : window.location.origin
      socketRef.current = io(socketUrl)

      socketRef.current.on('update-viewers', (count) => {
        setViewerCount(count)
      })

      socketRef.current.on('new-message', (message) => {
        const newMessage = { id: Date.now() + Math.random(), text: message, time: new Date().toLocaleTimeString() }
        setMessages(prev => [...prev, newMessage])
      })
    }
    return socketRef.current
  }, [])
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevs = devices.filter(d => d.kind === 'videoinput')
        setVideoDevices(videoDevs)
      } catch (err) {}
    }
    getDevices()

    initSocket()

    return () => {
      stopSession() // Cleanup on unmount
    }
  }, [initSocket])

  // --- 辅助函数：完全停止当前会话 ---
  const stopSession = () => {
      if (localStream.current) {
          localStream.current.getTracks().forEach(t => t.stop())
          localStream.current = null
      }
      Object.values(peerConnections.current).forEach(pc => pc.close())
      peerConnections.current = {}
      
      if (socketRef.current) {
          socketRef.current.disconnect()
          socketRef.current = null
      }
  }

  // --- 用户点击退出 ---
  const handleExit = () => {
      stopSession()
      setRole(null)
      setStatus('选择您的身份')
      setMessages([])
      // 重新连接 Socket 以获取在线人数
      setTimeout(initSocket, 500)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (chatInput.trim() && socketRef.current) {
      socketRef.current.emit('send-message', chatInput)
      setChatInput('')
    }
  }

  const startBroadcast = async () => {
    setRole('broadcaster')
    setStatus('正在初始化直播...')
    const socket = initSocket()
    socket.emit('broadcaster')

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        localStream.current = stream
        if (videoRef.current) {
            videoRef.current.srcObject = stream
            videoRef.current.muted = true
        }
        setStatus('直播中 - 等待观众...')

        socket.on('watcher', id => {
            const peerConnection = new RTCPeerConnection(peerConnectionConfig)
            peerConnections.current[id] = peerConnection

            // 添加当前流的所有轨道
            if (localStream.current) {
                localStream.current.getTracks().forEach(track => {
                    peerConnection.addTrack(track, localStream.current)
                })
            }

            peerConnection.onicecandidate = event => {
                if (event.candidate) {
                    socket.emit('candidate', id, event.candidate)
                }
            }

            peerConnection.createOffer()
                .then(sdp => peerConnection.setLocalDescription(sdp))
                .then(() => {
                    socket.emit('offer', id, peerConnection.localDescription)
                })
        })

        socket.on('answer', (id, description) => {
            if (peerConnections.current[id]) {
                peerConnections.current[id].setRemoteDescription(description)
            }
        })

        socket.on('candidate', (id, candidate) => {
            if (peerConnections.current[id]) {
                peerConnections.current[id].addIceCandidate(new RTCIceCandidate(candidate))
            }
        })
        
        socket.on('disconnectPeer', id => {
             if (peerConnections.current[id]) {
                 peerConnections.current[id].close()
                 delete peerConnections.current[id]
             }
        })

    } catch (e) {
        console.error(e)
        setStatus('无法获取摄像头/麦克风权限，请确保允许访问')
    }
  }

  const startWatching = () => {
    setRole('viewer')
    setStatus('正在连接直播间...')
    const socket = initSocket()
    socket.emit('watcher')
    
    socket.on('offer', (id, description) => {
        const peerConnection = new RTCPeerConnection(peerConnectionConfig)
        peerConnections.current[id] = peerConnection

        peerConnection.ontrack = event => {
             if (videoRef.current) {
                 videoRef.current.srcObject = event.streams[0]
                 setStatus('正在观看直播')
             }
        }

        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                socket.emit('candidate', id, event.candidate)
            }
        }

        peerConnection.setRemoteDescription(description)
            .then(() => peerConnection.createAnswer())
            .then(sdp => peerConnection.setLocalDescription(sdp))
            .then(() => {
                socket.emit('answer', id, peerConnection.localDescription)
            })
    })
    
    socket.on('candidate', (id, candidate) => {
        if(peerConnections.current[id]) {
             peerConnections.current[id].addIceCandidate(new RTCIceCandidate(candidate))
        }
    })

    socket.on('broadcaster', () => {
        setStatus('主播上线，正在连接...')
        socket.emit('watcher')
    })
    
    socket.on('disconnectPeer', () => {
         if (videoRef.current) videoRef.current.srcObject = null
         setStatus('直播已结束')
    })
  }

  // --- 切换视频流轨道 (用于切换摄像头或屏幕共享) ---
  const replaceVideoTrack = (newTrack) => {
      if (localStream.current) {
          const oldTrack = localStream.current.getVideoTracks()[0];
          if (oldTrack) {
              localStream.current.removeTrack(oldTrack);
              oldTrack.stop();
          }
          localStream.current.addTrack(newTrack);
      } else {
          // 如果还没有流，创建一个新的
          localStream.current = new MediaStream([newTrack])
      }
      
      if (videoRef.current) {
          videoRef.current.srcObject = localStream.current;
      }

      Object.values(peerConnections.current).forEach(pc => {
          const sender = pc.getSenders().find(s => s.track.kind === 'video');
          if (sender) {
              sender.replaceTrack(newTrack);
          }
      });
  }

  const switchCamera = async () => {
      if (videoDevices.length < 2) return;
      const nextIndex = (currentDeviceIndex + 1) % videoDevices.length;
      setCurrentDeviceIndex(nextIndex);
      
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: videoDevices[nextIndex].deviceId } },
            audio: true
        });
        const videoTrack = newStream.getVideoTracks()[0];
        replaceVideoTrack(videoTrack);
      } catch (e) {
        console.error("切换摄像头失败", e)
      }
  }

  const startScreenShare = async () => {
      try {
          const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
          const screenTrack = stream.getVideoTracks()[0];
          
          replaceVideoTrack(screenTrack);

          // 监听用户点击浏览器自带的"停止共享"按钮
          screenTrack.onended = async () => {
              // 尝试切回摄像头
              try {
                  const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                  replaceVideoTrack(cameraStream.getVideoTracks()[0]);
              } catch (e) {
                  console.log('无法自动切回摄像头');
              }
          };
      } catch (e) {
          console.error("屏幕共享失败或取消", e);
      }
  }

  return (
    <div className="page-container container" style={{ textAlign: 'center', paddingBottom: '50px' }}>
      <header style={{ padding: '60px 0 30px' }}>
        <h1 style={{ marginBottom: '10px' }}>除夕云直播</h1>
        <p style={{ color: '#888' }}>千里共婵娟 · 实时话团圆</p>
      </header>
      
      <div style={{ marginBottom: '15px', color: '#C02C38', fontWeight: 600, fontSize: '1.2rem' }}>{status}</div>
      
      <div style={{ marginBottom: '30px', color: '#888', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
        <span>👤</span>
        <span>{viewerCount} 人在线</span>
      </div>

      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        style={{ maxWidth: '900px', margin: '0 auto 20px', background: '#000', borderRadius: '16px', overflow: 'hidden', aspectRatio: '16/9', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', position: 'relative' }}>
        <video ref={videoRef} autoPlay playsInline controls={role === 'viewer'} style={{ width: '100%', height: '100%', objectFit: 'contain' }}></video>
        
        {!role && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #2B2B2B 0%, #1a1a1a 100%)', color: '#fff', flexDirection: 'column', gap: '20px' }}>
            <div style={{ fontSize: '4rem' }}>📡</div>
            <div>请选择模式</div>
        </div>}
      </motion.div>

      {!role && (
           <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '40px' }}>
                <button onClick={startBroadcast} style={{ padding: '12px 30px', borderRadius: '30px', background: '#C02C38', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>我是主播</button>
                <button onClick={startWatching} style={{ padding: '12px 30px', borderRadius: '30px', background: '#D4AF37', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>我是观众</button>
           </div>
      )}
      
      {role && (
           <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
               {role === 'broadcaster' && (
                   <>
                       {videoDevices.length > 1 && (
                           <button onClick={switchCamera} style={{ padding: '10px 20px', borderRadius: '20px', background: '#fff', border: '1px solid #ddd', color: '#333' }}>📸 切换摄像头</button>
                       )}
                       <button onClick={startScreenShare} style={{ padding: '10px 20px', borderRadius: '20px', background: '#fff', border: '1px solid #ddd', color: '#333' }}>🖥️ 屏幕共享</button>
                   </>
               )}
               <button onClick={handleExit} style={{ padding: '10px 20px', borderRadius: '20px', background: '#f5f5f5', border: '1px solid #ccc', color: '#666' }}>
                   {role === 'broadcaster' ? '⏹ 结束直播' : '🚪 退出观看'}
               </button>
           </div>
      )}

      {/* 聊天区域 */}
      {role && (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* 聊天记录框 */}
          <div 
            ref={chatContainerRef}
            style={{ 
              height: '300px', 
              overflowY: 'auto', 
              background: '#f8f8f8', 
              borderRadius: '12px', 
              padding: '15px',
              border: '1px solid #eee',
              marginBottom: '15px',
              textAlign: 'left',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.03)'
            }}
          >
            {messages.length === 0 && <div style={{ color: '#ccc', textAlign: 'center', marginTop: '100px' }}>暂无消息，快来打个招呼吧~</div>}
            {messages.map(msg => (
              <div key={msg.id} style={{ marginBottom: '10px', animation: 'fadeIn 0.3s' }}>
                <span style={{ color: '#999', fontSize: '0.8rem', marginRight: '8px' }}>[{msg.time}]</span>
                <span style={{ color: '#333', background: '#fff', padding: '6px 12px', borderRadius: '8px', display: 'inline-block', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>{msg.text}</span>
              </div>
            ))}
          </div>

          {/* 发送框 */}
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="说点什么..."
              style={{ flex: 1, padding: '12px 15px', borderRadius: '30px', border: '1px solid #ddd', outline: 'none' }}
            />
            <button type="submit" style={{ padding: '12px 25px', borderRadius: '30px', background: '#D4AF37', color: '#fff', fontWeight: 'bold' }}>
              发送
            </button>
          </form>
        </div>
      )}

      <div style={{ marginTop: '50px', color: '#999', fontSize: '0.85rem' }}>
        <p>💡 提示：为了保护隐私，浏览器仅允许在 <strong>HTTPS</strong> 或 <strong>localhost</strong> 环境下进行直播。</p>
      </div>
    </div>
  )
}