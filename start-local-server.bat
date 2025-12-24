@echo off
chcp 65001 >nul
echo 🚀 正在启动春节网站本地服务器...
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到 Node.js
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查是否已安装依赖
if not exist node_modules (
    echo 📦 正在安装依赖...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
)

echo ✅ 准备完成，启动服务器...
echo.
echo 📍 本机访问: http://localhost:3000
echo 🌐 局域网访问: http://你的IP:3000
echo.
echo 按 Ctrl+C 停止服务器
echo ==========================================

npm start