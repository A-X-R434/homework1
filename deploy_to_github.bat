@echo off

echo 正在准备部署到 GitHub...
echo ==============================
echo GitHub 用户名: A-X-R434
echo 仓库名: homework1
echo ==============================

echo 检查 Git 状态...
git status
echo.

echo 即将推送到 GitHub，请确保您的浏览器已准备好进行认证
echo 按任意键继续...
pause > nul

echo 执行推送操作...
git push -u origin main

echo.
if %ERRORLEVEL% == 0 (
    echo 部署成功！
    echo 请访问 https://github.com/A-X-R434/homework1 查看您的仓库
) else (
    echo 部署失败。请检查网络连接或重试。
    echo 您可以手动运行 "git push -u origin main" 命令重试。
)

echo.
echo 按任意键退出...
pause > nul