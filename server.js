import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001; // 后端运行端口

// 中间件
app.use(cors());
app.use(express.json());

// 静态资源服务
// 1. 服务上传的文件
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 配置 Multer 存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    // 生成文件名: type-timestamp-random.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  }
});

const upload = multer({ storage: storage });

// 数据文件路径
const DATA_FILE = path.join(__dirname, 'server-data', 'memories.json');

// --- API 接口 ---

// 1. 获取所有记忆
app.get('/api/memories', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            // 如果文件不存在，初始化为空数组
            if (err.code === 'ENOENT') {
                return res.json([]);
            }
            return res.status(500).json({ error: '无法读取数据' });
        }
        try {
            res.json(JSON.parse(data));
        } catch (e) {
            res.json([]);
        }
    });
});

// 2. 上传文件并保存记忆
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: '没有上传文件' });
    }

    const { title, description, date, type } = req.body;
    
    // 构建新的记忆对象
    const newMemory = {
        id: req.file.filename.split('.')[0], // 使用文件名作为ID
        type: type || (req.file.mimetype.startsWith('video') ? 'video' : 'photo'),
        title: title || '未命名',
        description: description || '',
        url: `uploads/${req.file.filename}`, // 相对路径
        date: date || new Date().toISOString().split('T')[0],
        timestamp: Date.now()
    };

    // 读取现有数据并更新
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        let memories = [];
        if (!err && data) {
            try {
                memories = JSON.parse(data);
            } catch (e) {}
        }

        memories.unshift(newMemory); // 加到最前面

        // 写入文件
        fs.writeFile(DATA_FILE, JSON.stringify(memories, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: '保存数据失败' });
            }
            res.json({ success: true, memory: newMemory });
        });
    });
});

// 3. 删除记忆
app.delete('/api/memories/:id', (req, res) => {
    const id = req.params.id;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: '读取数据失败' });

        let memories = [];
        try {
            memories = JSON.parse(data);
        } catch (e) {}

        const memoryIndex = memories.findIndex(m => m.id === id);
        if (memoryIndex === -1) {
            return res.status(404).json({ error: '找不到该记忆' });
        }

        const memory = memories[memoryIndex];
        
        // 尝试删除物理文件 (即使文件不存在也继续删除记录)
        const filePath = path.join(__dirname, memory.url);
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr && unlinkErr.code !== 'ENOENT') {
                console.error('删除文件失败:', unlinkErr);
                // 这里可以选择是否中断，通常为了数据一致性，我们允许继续删除记录
            }

            // 从数组中移除
            memories.splice(memoryIndex, 1);

            // 保存更新后的 JSON
            fs.writeFile(DATA_FILE, JSON.stringify(memories, null, 2), (writeErr) => {
                if (writeErr) {
                    return res.status(500).json({ error: '更新数据库失败' });
                }
                res.json({ success: true });
            });
        });
    });
});

// 4. 生产环境：托管 React 构建文件
// 当我们运行 npm run build 后，dist 目录会被生成
app.use(express.static(path.join(__dirname, 'dist')));

// 任何不匹配 API 的请求都返回 React 的 index.html (支持前端路由)
// 使用正则 /.*/ 替代 '*' 以避免 path-to-regexp 版本冲突报错
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🏮 春节记忆馆服务器已启动!`);
    console.log(`📡 本地访问: http://localhost:${PORT}`);
    console.log(`🌍 局域网访问: http://[您的IP]:${PORT}`);
    console.log(`📂 文件存储在: ${path.join(__dirname, 'uploads')}`);
    console.log(`=========================================`);
});