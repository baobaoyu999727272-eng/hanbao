@echo off
echo == 部署命令指南 ==
echo.
echo 1. 确保您已经创建了 hanbao 仓库: https://github.com/baobaoyu999727272-eng/hanbao
echo 2. 确保您有 GitHub Personal Access Token (需要 repo 权限)
echo.
echo 然后在 PowerShell 中运行以下命令:
echo.
echo git remote set-url origin https://YOUR_TOKEN@github.com/baobaoyu999727272-eng/hanbao.git
echo git push --force -u origin main
echo git remote set-url origin https://github.com/baobaoyu999727272-eng/hanbao.git
echo.
echo 替换 YOUR_TOKEN 为您的 GitHub Personal Access Token
echo.
pause
