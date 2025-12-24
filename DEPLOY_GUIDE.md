# 静态部署指南 (GitHub + Cloudflare Pages)

本项目支持将本地的动态内容（照片、视频、数据）打包成一个纯静态网站，非常适合部署到 Cloudflare Pages 或 GitHub Pages，实现免服务器、高速的全球访问。

## 部署流程

部署分为两步：**1. 本地打包** -> **2. 推送到 GitHub** -> **3. Cloudflare 自动构建**。

### 第一步：在本地管理内容

1.  **启动全功能服务**：按照 `LOCAL_SERVER_GUIDE.md` 的说明，运行 `node server.js`。
2.  **上传与删除**：通过 `http://localhost:3001` 访问您的网站，上传您想要公开展示的照片和视频，删除不满意的部分。
3.  所有操作都会实时保存在您电脑的 `uploads/` 和 `server-data/` 文件夹中。

### 第二步：将内容提交到 GitHub

当您对本地的内容感到满意后，需要将这些内容（包括新上传的照片）提交到您的 GitHub 仓库。

```bash
# 1. 将所有新文件和修改添加到暂存区
git add .

# 2. 创建一个提交记录
git commit -m "Update public memories for static deployment"

# 3. 推送到 master 分支
git push origin master
```
Cloudflare Pages 会自动检测到这次推送，并开始第三步。

### 第三步：Cloudflare Pages 配置与自动构建

为了让 Cloudflare 能正确地构建您的项目，请确保您已经完成了以下**一次性配置**：

1.  **仓库连接**：
    *   在 Cloudflare Pages 中，连接到您的这个 GitHub 仓库。

2.  **生产分支 (Production branch)**:
    *   选择 `master`。

3.  **构建设置 (Build settings)**:
    *   **构建命令 (Build command)**: `npm run publish:static`
    *   **输出目录 (Build output directory)**: `dist`

4.  **环境变量 (Environment variables)**:
    *   添加一个**文本 (Text)** 类型的环境变量：
    *   **变量名**: `VITE_APP_MODE`
    *   **值**: `static`

完成这些设置后，每次您向 `master` 分支推送代码，Cloudflare 都会自动拉取 -> 运行 `npm run publish:static` -> 将生成的 `dist` 文件夹部署到全球。

---

### ⚠️ 注意

-   您推送到 GitHub 的所有照片和视频都将是**公开的**。
-   GitHub 对仓库大小和单个文件大小有限制（单个文件最好不要超过 100MB），不适合存放大量或超高清的视频文件。
-   `npm run publish:static` 脚本会自动将 `uploads/` 和 `server-data/memories.json` 里的内容打包，您无需手动复制。
