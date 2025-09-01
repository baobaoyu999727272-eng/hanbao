# deploy_to_hanbao.ps1
# 强制部署到新的 hanbao 仓库

$repoUrl = 'https://github.com/baobaoyu999727272-eng/hanbao.git'
$ownerRepo = 'baobaoyu999727272-eng/hanbao'

Write-Host "== 强制部署到 Hanbao 仓库 =="
Write-Host "目标仓库: $repoUrl"
Write-Host ""

# 检查项目文件
if (Test-Path "index.html") {
  Write-Host "✅ 找到 index.html 文件"
}
else {
  Write-Host "⚠️  警告: 未找到 index.html 文件"
}

# 显示即将部署的文件
Write-Host ""
Write-Host "即将部署的文件:"
Get-ChildItem -Name | Where-Object { $_ -notlike ".git*" } | ForEach-Object { Write-Host "  - $_" }

Write-Host ""
Write-Host "请输入您的 GitHub Personal Access Token"
Write-Host "获取地址: https://github.com/settings/tokens"
Write-Host "需要 'repo' 权限"
Write-Host ""

$tokenSecure = Read-Host "GitHub Token (输入隐藏)" -AsSecureString
if (-not $tokenSecure) {
  Write-Host "❌ 未提供 Token，操作取消" -ForegroundColor Red
  exit 1
}

# 转换 token
$ptr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($tokenSecure)
$token = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($ptr)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) | Out-Null

Write-Host "准备部署..."

# 确保工作区干净
git add .
$commitMessage = "部署小手机项目到 hanbao 仓库 - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

try {
  git commit -m $commitMessage | Out-Null
  Write-Host "✅ 提交成功: $commitMessage"
}
catch {
  Write-Host "ℹ️  没有新的更改需要提交"
}

# 设置远程仓库（带 token）
$authUrl = "https://$token@github.com/$ownerRepo.git"

try {
  git remote set-url origin $authUrl | Out-Null
  Write-Host "✅ 设置远程仓库 URL"
}
catch {
  Write-Host "❌ 设置远程仓库失败"
  exit 1
}

# 强制推送（创建新的仓库历史）
Write-Host ""
Write-Host "正在推送到 hanbao 仓库..."
Write-Host "使用强制推送来创建全新的仓库历史"

$pushOutput = & git push --force -u origin main 2>&1
$pushExit = $LASTEXITCODE

# 恢复 URL（移除 token）
git remote set-url origin $repoUrl

# 清理 token
Remove-Variable token -ErrorAction SilentlyContinue
Remove-Variable tokenSecure -ErrorAction SilentlyContinue

Write-Host ""
if ($pushExit -eq 0) {
  Write-Host "🎉 部署成功！" -ForegroundColor Green
  Write-Host "项目已部署到: $repoUrl" -ForegroundColor Green
  Write-Host ""
  Write-Host "后续步骤:"
  Write-Host "1. 访问仓库: https://github.com/$ownerRepo"
  Write-Host "2. 在仓库设置中启用 GitHub Pages（如需要）"
  Write-Host "3. 查看部署状态: https://github.com/$ownerRepo/actions"
}
else {
  Write-Host "❌ 部署失败，错误代码: $pushExit" -ForegroundColor Red
  Write-Host "错误输出:" -ForegroundColor Red
  Write-Host $pushOutput -ForegroundColor Red
  Write-Host ""
  Write-Host "可能的问题:"
  Write-Host "- 仓库不存在，请先在 GitHub 创建 hanbao 仓库"
  Write-Host "- Token 权限不足，需要 'repo' 权限"
  Write-Host "- 网络连接问题"
}

Write-Host ""
Write-Host "完成。仓库地址: https://github.com/$ownerRepo"
