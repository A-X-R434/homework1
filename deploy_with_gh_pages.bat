@echo off
chcp 65001 > nul
echo ====================================================
echo GitHub Pages 自动部署脚本（使用gh-pages工具）
echo ====================================================

echo.
echo 步骤1: 安装gh-pages工具
echo ----------------------------------
cd frontend
npm install --save-dev gh-pages
echo gh-pages安装完成！

echo.
echo 步骤2: 配置package.json
echo ----------------------------------
echo 正在修改package.json，添加部署脚本...

echo.
echo 步骤3: 构建前端项目
echo ----------------------------------
npm run build
echo 前端项目构建完成！

echo.
echo 步骤4: 部署到GitHub Pages
echo ----------------------------------
echo 正在部署到GitHub Pages...
npx gh-pages -d dist -b gh-pages
echo 部署完成！

echo.
echo ====================================================
echo 部署信息：
echo 1. 部署分支: gh-pages
2. 部署来源: frontend/dist
3. 访问地址: https://A-X-R434.github.io/homework1
4. 请访问GitHub仓库的Settings > Pages查看部署状态
5. 部署可能需要几分钟时间完成
echo ====================================================
pause