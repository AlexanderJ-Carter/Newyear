# 本地开发与服务器启动指南

本项目包含一个 React 前端和一个 Node.js 后端，实现了上传、删除、直播等全栈功能。要在本地体验全部功能，请遵循以下步骤。

## 🚀 启动全功能服务

您需要**同时打开两个终端窗口**来分别运行前端开发服务器和后端 API 服务器。

### 终端 1: 启动后端服务 (API & Socket.io)

这是所有动态功能（上传、删除、直播信令）的核心。

```bash
# 确保您在项目根目录 (D:\Website\Newyear)
node server.js
```

启动成功后，您会看到如下提示，代表 API 和直播服务已在 `3001` 端口准备就绪：
```
=========================================
🏮 春节记忆馆 (含直播) 服务器已启动!
📡 本地/局域网访问端口: 3001
=========================================
```
**请保持此终端窗口不要关闭。**

### 终端 2: 启动前端开发服务器 (Vite)

这是您能实时看到代码修改的前端界面。

```bash
# 同样在项目根目录 (D:\Website\Newyear)
npm run dev
```

启动成功后，Vite 会提供一个本地访问地址，通常是 `http://localhost:5173`。

### 如何访问

1.  在浏览器中打开 Vite 提供的地址（例如 `http://localhost:5173`）。
2.  所有对 `/api` 或 `/uploads` 的请求都会被 Vite 自动代理到 `localhost:3001`，您将体验到所有功能，包括上传和删除。

## 🌐 暴露到公网/局域网 (Cloudflare Tunnel)

如果您想让朋友或家人通过互联网访问您本地的服务（尤其是直播功能），请在**第三个终端窗口**中启动 Cloudflare Tunnel。

### 终端 3: 启动隧道

```bash
# 确保您的 config.yml 配置正确
cloudflared tunnel run mypc
```

启动后，任何人都可以通过您配置的域名（例如 `https://newyear-live.alexander.xin`）访问您电脑上运行的服务。

---

### 💡 总结

- **日常开发**: 运行 `node server.js` 和 `npm run dev`。
- **公网分享**: 运行 `node server.js` 和 `cloudflared tunnel run mypc`。
- **只发布静态页面**: 运行 `npm run deploy`（详见 `DEPLOY_GUIDE.md`）。
