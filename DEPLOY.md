# 🚀 部署指南

## 快速开始

### 1. 准备工作
在部署之前，请确保：
- 添加音频文件到 `assets/audio/` 目录
- 创建网站图标并替换 `favicon.ico`
- 测试所有功能正常工作

### 2. GitHub Pages 部署（推荐）

#### 步骤一：创建仓库
1. 登录GitHub，创建新仓库
2. 仓库名建议：`newyear-countdown` 或类似
3. 设置为Public（GitHub Pages免费版要求）

#### 步骤二：上传文件
```bash
git init
git add .
git commit -m "初始化新春倒计时网页"
git branch -M main
git remote add origin https://github.com/yourusername/newyear-countdown.git
git push -u origin main
```

#### 步骤三：启用GitHub Pages
1. 进入仓库设置 (Settings)
2. 找到 "Pages" 设置
3. Source 选择 "Deploy from a branch"
4. Branch 选择 "main"
5. Folder 保持 "/ (root)"
6. 点击 Save

#### 步骤四：配置自定义域名
1. 在DNS服务商处添加CNAME记录：
   ```
   类型：CNAME
   名称：newyear
   值：yourusername.github.io
   ```
2. 等待DNS生效（通常5-30分钟）
3. 访问 https://newyear.alexander.xin 验证

### 3. Cloudflare Pages 部署

#### 步骤一：连接仓库
1. 登录Cloudflare Dashboard
2. 选择 "Pages"
3. 点击 "Connect to Git"
4. 选择您的GitHub仓库

#### 步骤二：配置构建设置
- 项目名称：`newyear-countdown`
- 生产分支：`main`
- 构建命令：留空
- 构建输出目录：`/`

#### 步骤三：部署
1. 点击 "Save and Deploy"
2. 等待部署完成
3. 获得Cloudflare分配的域名

#### 步骤四：自定义域名
1. 在Pages项目中选择 "Custom domains"
2. 添加 `newyear.alexander.xin`
3. 按照提示配置DNS记录
4. 等待SSL证书自动配置

### 4. 域名DNS配置

#### 使用GitHub Pages
```
类型：CNAME
名称：newyear
值：yourusername.github.io
```

#### 使用Cloudflare Pages
```
类型：CNAME
名称：newyear
值：your-project.pages.dev
```

### 5. SSL/HTTPS配置

- **GitHub Pages**: 自动配置，等待几分钟后生效
- **Cloudflare Pages**: 自动配置，通常立即生效

### 6. 性能优化建议

#### 启用压缩
- GitHub Pages: 自动启用gzip
- Cloudflare: 在设置中启用压缩

#### 缓存配置
添加 `.htaccess` 文件（如果服务器支持）：
```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType audio/mpeg "access plus 1 month"
</IfModule>
```

### 7. 监控和分析

#### Google Analytics（可选）
在 `<head>` 标签中添加：
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### 8. 常见问题解决

#### 音乐无法播放
- 检查音频文件路径
- 现代浏览器要求用户交互后才能播放音频
- 确保音频文件格式为MP3且未损坏

#### 字体加载慢
- 使用Google Fonts的优化加载方式
- 考虑本地托管字体文件

#### 移动端适配问题
- 检查viewport meta标签
- 测试不同屏幕尺寸的显示效果

### 9. 维护和更新

#### 定期检查
- 倒计时目标日期是否正确
- 所有链接是否有效
- 音频文件是否正常播放

#### 内容更新
- 每年更新为新的目标年份
- 更新祝福语内容
- 优化性能和用户体验

## 📞 技术支持

如遇部署问题，请检查：
1. 文件路径是否正确
2. DNS配置是否生效
3. SSL证书是否正常
4. 浏览器控制台是否有错误信息

---
*祝部署顺利！新年快乐！* 🎊