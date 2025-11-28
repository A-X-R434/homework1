@echo off
chcp 65001 > nul
echo ====================================================
echo GitHub Pages 配置指南
echo ====================================================

echo.
echo 步骤1: 推送前端构建文件到GitHub仓库
echo ----------------------------------
echo 正在添加dist目录到Git...
git add frontend/dist
git commit -m "Add frontend build files for GitHub Pages"
git push origin main
echo 推送完成！

echo.
echo 步骤2: 配置GitHub Pages
echo ----------------------------------
echo 请按照以下步骤在GitHub网站上操作：
echo 1. 访问您的GitHub仓库：https://github.com/A-X-R434/homework1
echo 2. 点击顶部的 "Settings" 选项卡
echo 3. 在左侧菜单中选择 "Pages"
echo 4. 在 "Source" 部分：
echo    - 选择 "Deploy from a branch"
echo    - 在 "Branch" 下拉菜单中选择 "main"
echo    - 在文件夹选择中，输入 "frontend/dist"
echo 5. 点击 "Save" 按钮
echo 6. GitHub将开始部署您的网站
echo 7. 部署完成后，您将看到访问网址：https://A-X-R434.github.io/homework1
echo.
echo 注意事项：
echo - 部署可能需要几分钟时间
echo - 确保您的仓库是公开的
echo - 检查URL是否正确访问您的应用
echo ====================================================
echo 配置指南结束！请按照上述步骤在GitHub网站上完成设置。
pause