@echo off
echo Starting New Year Website Local Server...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js not found
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist node_modules (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo Failed to install dependencies
        pause
        exit /b 1
    )
)

echo Ready! Starting server...
echo.
echo Local access: http://localhost:3000
echo Network access: http://your-ip:3000
echo.
echo Press Ctrl+C to stop the server
echo ==========================================

npm start