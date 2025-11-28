@echo off
REM GitHub Pages 部署脚本

cls
echo ===================================================
echo GitHub Pages 部署助手
echo ===================================================
echo.

REM 检查 Node.js 是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: 未找到 Node.js。请先安装 Node.js。
    pause
    exit /b 1
)

echo 步骤 1: 构建前端项目
echo ----------------------------------------
cd frontend

REM 检查 package.json 是否存在
if not exist package.json (
    echo 错误: 找不到 package.json 文件。请确认在正确的目录中。
    cd ..
    pause
    exit /b 1
)

echo 安装依赖...
npm install --silent
if %errorlevel% neq 0 (
    echo 错误: 依赖安装失败。
    cd ..
    pause
    exit /b 1
)

echo 构建项目...
npm run build
if %errorlevel% neq 0 (
    echo 错误: 项目构建失败。
    cd ..
    pause
    exit /b 1
)

cd ..
echo 构建完成! 构建文件位于 frontend/dist 目录

echo.
echo 步骤 2: 更新部署文档
echo ----------------------------------------
if exist README_DEPLOY.md (
    echo README_DEPLOY.md 已存在，包含部署说明
) else (
    echo 警告: README_DEPLOY.md 文件不存在。
)

echo.
echo 步骤 3: GitHub Pages 部署指南
echo ----------------------------------------
echo 请按以下步骤在 GitHub 上配置 GitHub Pages:
echo 1. 访问您的 GitHub 仓库页面: https://github.com/A-X-R434/homework1
echo 2. 点击顶部导航栏中的 "Settings"（设置）选项
echo 3. 在左侧菜单中找到并点击 "Pages"
echo 4. 在 "Build and deployment" 部分:
echo    - Source 选择 "Deploy from a branch"
echo    - Branch 选择 "main"
echo    - Folder 选择 "frontend/dist"
echo 5. 点击 "Save" 按钮
echo.
echo 完成配置后，您的网站将在几分钟内部署到:
echo https://A-X-R434.github.io/homework1

echo.
echo ===================================================
echo 部署准备工作已完成!
echo 请按照上述步骤在 GitHub 上完成 GitHub Pages 配置。
echo ===================================================
pause