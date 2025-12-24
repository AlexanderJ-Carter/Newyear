import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const sourceData = path.join(rootDir, 'server-data', 'memories.json');
const sourceUploads = path.join(rootDir, 'uploads');

// 注意：在 Vite 构建中，public 目录的内容会被直接复制到 dist 根目录
// 所以我们需要把数据暂存到 public 目录，构建完再清理，或者直接构建完后复制到 dist
// 为了简单和稳健，我们选择：构建 -> 复制数据到 dist

const distDir = path.join(rootDir, 'dist');
const distDataDir = path.join(distDir, 'data');
const distUploadsDir = path.join(distDir, 'uploads');

console.log('🚀 开始构建静态版本...');

// 1. 运行 Vite 构建 (注入 VITE_APP_MODE=static)
// Windows 下设置环境变量略有不同，cross-env 是个好选择，但为了不引入新依赖，我们用 set
try {
    const buildCommand = process.platform === 'win32' 
        ? 'set VITE_APP_MODE=static && npm run build'
        : 'VITE_APP_MODE=static npm run build';
    
    execSync(buildCommand, { stdio: 'inherit', cwd: rootDir });
} catch (e) {
    console.error('❌ 构建失败', e);
    process.exit(1);
}

console.log('📂 正在复制数据文件...');

// 2. 确保目标目录存在
if (!fs.existsSync(distDataDir)) fs.mkdirSync(distDataDir, { recursive: true });
if (!fs.existsSync(distUploadsDir)) fs.mkdirSync(distUploadsDir, { recursive: true });

// 3. 复制 memories.json
if (fs.existsSync(sourceData)) {
    fs.copyFileSync(sourceData, path.join(distDataDir, 'memories.json'));
    console.log('✅ memories.json 已复制');
} else {
    console.warn('⚠️ 未找到 memories.json，将使用空数据');
    fs.writeFileSync(path.join(distDataDir, 'memories.json'), '[]');
}

// 4. 复制 uploads 文件夹
// 简单的递归复制函数
function copyFolderSync(from, to) {
    if (!fs.existsSync(to)) fs.mkdirSync(to);
    fs.readdirSync(from).forEach(element => {
        if (fs.lstatSync(path.join(from, element)).isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element));
        } else {
            copyFolderSync(path.join(from, element), path.join(to, element));
        }
    });
}

if (fs.existsSync(sourceUploads)) {
    console.log('📂 正在复制上传的图片/视频 (这可能需要一点时间)...');
    copyFolderSync(sourceUploads, distUploadsDir);
    console.log(`✅ 已复制所有文件到 ${distUploadsDir}`);
}

console.log('================================================');
console.log('🎉 静态版本构建完成！');
console.log('👉 现在你可以将 dist/ 目录的内容推送到 GitHub Pages');
console.log('================================================');
