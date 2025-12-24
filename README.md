# 🏮 春节记忆馆 - 2026

这是一个现代化的、全栈的春节主题 Web 应用，旨在记录和分享新春的美好瞬间。项目基于 **React + Vite + Node.js** 构建，并集成了**实时直播**功能。

## ✨ 核心功能

- **时光宝盒**: 支持上传、查看、删除照片和视频，形成一个动态的春节记忆相册。
- **文化殿堂**: 以互动的卡片形式，深入介绍春节的历史渊源、传统习俗和美食文化。
- **云直播**: 基于 WebRTC 和 Socket.io 技术，允许用户进行低延迟的摄像头或屏幕共享直播，非常适合家庭异地“云团圆”。
- **双模部署**:
  1.  **本地全功能模式**: 运行 Node.js 服务器，拥有上传、删除、直播等全部功能。
  2.  **静态展示模式**: 一键打包成纯静态网站，可部署到 Cloudflare Pages 或 GitHub Pages，实现高速全球访问。

## 🛠️ 技术栈

- **前端**: React, Vite, React Router, Framer Motion
- **后端**: Node.js, Express
- **实时通信**: Socket.io, WebRTC
- **部署**: Cloudflare Tunnel (动态服务), Cloudflare Pages (静态站点)

## 🚀 如何使用

详细的使用和部署方法，请参考项目根目录下的说明文档：

-   **`LOCAL_SERVER_GUIDE.md`**: 如何在本地启动全功能服务进行开发和管理。
-   **`DEPLOY_GUIDE.md`**: 如何将项目作为静态网站发布到公网。
-   **`CONTENT_LIVE_GUIDE.md`**: 如何管理相册内容和使用直播功能。

---

© 2025 Alexander.xin
