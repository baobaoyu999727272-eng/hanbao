部署说明

1) 在 GitHub 上创建一个新的仓库（例如：baobaoyu），或使用已有仓库。
2) 将本地项目初始化为 git 仓库并推送到 GitHub：

# Windows PowerShell 示例
git init
git add .
git commit -m "initial"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin main

3) GitHub Actions 已包含一个 Pages 部署工作流 `.github/workflows/deploy-pages.yml`，当你把代码推送到 `main` 分支时，它会自动构建并部署仓库根目录到 GitHub Pages。

4) 部署完成后，前往仓库的 Settings -> Pages，确认 Pages 站点已生效并访问页面。
