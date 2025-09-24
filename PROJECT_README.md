# 🐴 2026马年春节倒计时网站

一个精美的春节倒计时网站，包含记忆展示、知识问答等功能，为即将到来的2026年马年春节做准备！

## 🌟 功能特色

### 🕒 倒计时功能
- 实时计算距离2026年春节的剩余时间
- 动态祝福语轮播
- 根据倒计时天数自动切换背景主题
- 支持背景音乐播放

### 📸 记忆展示
- 支持视频和图片分别管理
- 智能文件命名系统：`v/p-YYYYMMDD-标题-描述.扩展名`
- 自动按时间排序
- 优雅的卡片式展示界面

### 🧠 知识问答
- 春节传统文化知识测试
- 交互式问答界面
- 实时评分系统
- 答案解析功能

### 🎨 视觉设计
- 春节主题色彩搭配
- 动态粒子效果背景
- 流畅的页面转场动画
- 完全响应式设计

## 📁 项目结构

```
├── index.html              # 主页（倒计时）
├── memories.html           # 记忆展示页面
├── knowledge.html          # 知识问答页面
├── assets/
│   ├── css/               # 样式文件
│   │   ├── main.css       # 主样式
│   │   ├── memories.css   # 记忆页面样式
│   │   └── knowledge.css  # 问答页面样式
│   ├── js/                # JavaScript文件
│   │   ├── main.js        # 主脚本
│   │   ├── memories.js    # 记忆页面脚本
│   │   └── knowledge.js   # 问答页面脚本
│   ├── images/            # 网站UI图片
│   ├── videos/            # 记忆视频文件
│   ├── photos/            # 记忆图片文件
│   └── audio/             # 音频文件
└── docs/                  # 文档文件
```

## 🚀 使用说明

### 基本使用
1. 直接打开 `index.html` 即可运行
2. 点击导航按钮切换到不同页面
3. 点击音乐按钮控制背景音乐

### 添加记忆文件

#### 添加视频
1. 按命名规则重命名：`v-20251225-标题-描述.mp4`
2. 放入 `assets/videos/` 文件夹
3. 在 `assets/js/memories.js` 中的 `knownVideoFiles` 数组添加文件名

#### 添加图片  
1. 按命名规则重命名：`p-20251225-标题-描述.jpg`
2. 放入 `assets/photos/` 文件夹
3. 在 `assets/js/memories.js` 中的 `knownPhotoFiles` 数组添加文件名

### 文件命名规则
```
格式: [类型]-[日期]-[标题]-[描述].[扩展名]

类型: v=视频, p=图片
日期: YYYYMMDD (8位数字)
标题: 显示在页面上的标题
描述: 详细说明信息

示例:
v-20251225-年夜饭-全家包饺子的温馨时光.mp4
p-20251225-全家福-春节团聚大合影.jpg
```

## 🛠️ 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式设计，支持动画和响应式
- **JavaScript (ES6+)** - 交互逻辑
- **SVG** - 矢量图标
- **Web Audio API** - 音频控制

## 📱 浏览器兼容性

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 🌐 部署

### GitHub Pages 部署
1. 推送代码到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择main分支作为发布源
4. 访问提供的GitHub Pages URL

### 本地服务器
```bash
# 使用Python
python -m http.server 8000

# 使用Node.js (如果安装了http-server)
http-server

# 使用PHP
php -S localhost:8000
```

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

感谢所有为中华传统文化传承做出贡献的人们！

---

**祝您新年快乐，马年大吉！🐴🎊**