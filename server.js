import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app); // 创建 HTTP 服务器
// 配置 Socket.io，允许跨域
const io = new Server(httpServer, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());

// --- Socket.io 直播信令逻辑 ---
let broadcaster; // 记录当前主播的 Socket ID

io.on("connection", (socket) => {
    // --- 在线人数更新 ---
    io.emit('update-viewers', io.engine.clientsCount);

    socket.on("disconnect", () => {
        io.emit('update-viewers', io.engine.clientsCount);
        // 原有的 WebRTC 断开逻辑
        socket.to(broadcaster).emit("disconnectPeer", socket.id);
    });

    // --- 聊天弹幕 ---
    socket.on("send-message", (message) => {
        // 将收到的消息广播给所有人（包括发送者自己）
        io.emit("new-message", message);
    });

    // --- 直播信令逻辑 ---
    // 1. 主播上线
    socket.on("broadcaster", () => {
        broadcaster = socket.id;
        socket.broadcast.emit("broadcaster"); // 告诉所有观众：主播来了
    });

    // 2. 观众上线
    socket.on("watcher", () => {
        if (broadcaster) {
            socket.to(broadcaster).emit("watcher", socket.id); // 告诉主播：有个观众(id)想看
        }
    });

    // ... (省略其他 WebRTC 信令事件) ...
    // 3. WebRTC 握手：Offer (主播 -> 观众)
    socket.on("offer", (id, message) => {
        socket.to(id).emit("offer", socket.id, message);
    });

    // 4. WebRTC 握手：Answer (观众 -> 主播)
    socket.on("answer", (id, message) => {
        socket.to(id).emit("answer", socket.id, message);
    });

    // 5. 网络候选路径交换 (Candidate)
    socket.on("candidate", (id, message) => {
        socket.to(id).emit("candidate", socket.id, message);
    });
});
// ----------------------------

// 静态资源服务
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  }
});

const upload = multer({ storage: storage });
const DATA_FILE = path.join(__dirname, 'server-data', 'memories.json');

// API 接口
app.get('/api/memories', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') return res.json([]);
            return res.status(500).json({ error: '无法读取数据' });
        }
        try { res.json(JSON.parse(data)); } catch (e) { res.json([]); }
    });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: '没有上传文件' });
    const { title, description, date, type } = req.body;
    const newMemory = {
        id: req.file.filename.split('.')[0],
        type: type || (req.file.mimetype.startsWith('video') ? 'video' : 'photo'),
        title: title || '未命名',
        description: description || '',
        url: `uploads/${req.file.filename}`,
        date: date || new Date().toISOString().split('T')[0],
        timestamp: Date.now()
    };
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        let memories = [];
        if (!err && data) { try { memories = JSON.parse(data); } catch (e) {} }
        memories.unshift(newMemory);
        fs.writeFile(DATA_FILE, JSON.stringify(memories, null, 2), (err) => {
            if (err) return res.status(500).json({ error: '保存数据失败' });
            res.json({ success: true, memory: newMemory });
        });
    });
});

app.delete('/api/memories/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: '读取数据失败' });
        let memories = [];
        try { memories = JSON.parse(data); } catch (e) {}
        const memoryIndex = memories.findIndex(m => m.id === id);
        if (memoryIndex === -1) return res.status(404).json({ error: '找不到该记忆' });
        const memory = memories[memoryIndex];
        const filePath = path.join(__dirname, memory.url);
        fs.unlink(filePath, (unlinkErr) => {
            memories.splice(memoryIndex, 1);
            fs.writeFile(DATA_FILE, JSON.stringify(memories, null, 2), (writeErr) => {
                if (writeErr) return res.status(500).json({ error: '更新数据库失败' });
                res.json({ success: true });
            });
        });
    });
});

app.use(express.static(path.join(__dirname, 'dist')));
// 路由必须使用正则匹配
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 使用 httpServer.listen 而不是 app.listen
httpServer.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🏮 春节记忆馆 (含直播) 服务器已启动!`);
    console.log(`📡 本地/局域网访问端口: ${PORT}`);
    console.log(`=========================================`);
});
