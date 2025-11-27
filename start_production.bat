@echo off

REM 检查Node.js是否安装
node -v > nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未检测到Node.js，请先安装Node.js 14.x或更高版本
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js环境检测成功

REM 检查backend目录是否存在
if not exist "backend" (
    echo 错误: 找不到backend目录，请确保脚本在项目根目录运行
    pause
    exit /b 1
)

REM 检查.env文件是否存在
if not exist "backend\.env" (
    echo 警告: 找不到backend\.env文件
    echo 正在从.env.example复制...
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env"
        echo 已创建.env文件，请编辑该文件配置正确的数据库连接和密钥
        echo 按任意键继续...
        pause
    ) else (
        echo 错误: 找不到.env.example文件
        pause
        exit /b 1
    )
)

REM 进入backend目录
cd backend

REM 检查依赖是否已安装
if not exist "node_modules" (
    echo 未检测到node_modules，正在安装依赖...
    npm install
    if %errorlevel% neq 0 (
        echo 错误: 依赖安装失败
        pause
        exit /b 1
    )
)

REM 检查前端dist目录是否存在
if not exist "..\frontend\dist" (
    echo 警告: 找不到前端构建文件(frontend\dist)
    echo 请确保已在前端目录运行 npm run build
    echo 继续启动后端服务，但前端可能无法访问...
    echo 按任意键继续...
    pause
)

echo 正在启动生产环境服务...
echo 服务启动后，请访问: http://localhost:5000
echo 或使用本机IP地址在其他电脑访问: http://你的IP地址:5000
echo.

REM 设置NODE_ENV为production并启动服务
set NODE_ENV=production
npm run start

REM 如果start命令失败，尝试直接使用node
if %errorlevel% neq 0 (
    echo "npm run start" 失败，尝试直接使用node启动...
    node server.js
)

pause