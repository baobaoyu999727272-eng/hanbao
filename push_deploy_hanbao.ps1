# push_deploy_hanbao.ps1
# 用法：在 PowerShell 中 cd 到项目目录后运行：
# powershell -ExecutionPolicy Bypass -File .\push_deploy_hanbao.ps1

$repoRemote = 'https://github.com/baobaoyu999727272-eng/hanbao.git'
$ownerRepo = 'baobaoyu999727272-eng/hanbao'

Write-Host "== GitHub Push & Deploy Helper for Hanbao Repository =="
Write-Host "Repository: $repoRemote"

# 检查当前目录是否有项目文件
if (-not (Test-Path "index.html")) {
  Write-Host "Warning: index.html not found in current directory." -ForegroundColor Yellow
  Write-Host "Make sure you're in the correct project directory." -ForegroundColor Yellow
}

# 初始化仓库（如果尚未初始化）
if (-not (Test-Path .git)) {
  Write-Host "Initializing git repository..."
  git init
}

# 添加并提交
Write-Host "Staging files..."
git add .

# 提交（如果没有改动，git commit 会返回非零，忽略）
try {
  $commitMessage = "Deploy to hanbao repository - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
  git commit -m $commitMessage -q
  Write-Host "Committed changes with message: $commitMessage"
}
catch {
  Write-Host "No changes to commit or commit failed (this is ok if no changes exist)." -ForegroundColor Yellow
}

# 确保分支为 main
try {
  git branch -M main
  Write-Host "Ensured branch is 'main'"
}
catch {
  Write-Host "Branch operation completed"
}

# 交互式获取 token（SecureString）
Write-Host ""
Write-Host "You need a GitHub Personal Access Token with 'repo' permissions."
Write-Host "Get one at: https://github.com/settings/tokens"
Write-Host ""
$tokenSecure = Read-Host "Enter your GitHub Personal Access Token (input hidden)" -AsSecureString
if (-not $tokenSecure) {
  Write-Host "No token provided. Aborting." -ForegroundColor Red
  exit 1
}

# 将 SecureString 转为明文（仅内存中）
$ptr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($tokenSecure)
$token = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($ptr)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) | Out-Null

# 使用 token 临时添加远端并推送
$authUrl = "https://$token@github.com/$ownerRepo.git"
try {
  git remote remove origin -ErrorAction SilentlyContinue
  Write-Host "Removed existing origin (if any)"
}
catch {}

Write-Host "Adding new remote origin..."
git remote add origin $authUrl

Write-Host "Pushing to hanbao repository... (this will use the token you entered)"
Write-Host "Repository URL: $repoRemote"
$pushResult = & git push -u origin main 2>&1
$pushExit = $LASTEXITCODE

# 恢复远端 URL（移除 token）
try {
  git remote set-url origin $repoRemote
  Write-Host "Cleaned up remote URL (removed token)"
}
catch {}

# 清理内存中的 token 变量
Remove-Variable token -ErrorAction SilentlyContinue
Remove-Variable tokenSecure -ErrorAction SilentlyContinue

Write-Host ""
if ($pushExit -eq 0) {
  Write-Host "✅ Push to hanbao repository succeeded!" -ForegroundColor Green
  Write-Host "Your files have been deployed to: $repoRemote" -ForegroundColor Green
  Write-Host ""
  Write-Host "Next steps:"
  Write-Host "1. Check repository: https://github.com/$ownerRepo"
  Write-Host "2. Enable GitHub Pages if needed in repository settings"
  Write-Host "3. Monitor GitHub Actions: https://github.com/$ownerRepo/actions"
}
else {
  Write-Host "❌ Push failed with exit code $pushExit" -ForegroundColor Red
  Write-Host "Git output:" -ForegroundColor Red
  Write-Host $pushResult -ForegroundColor Red
  Write-Host ""
  Write-Host "Common issues:"
  Write-Host "- Check if repository exists: https://github.com/$ownerRepo"
  Write-Host "- Verify token has 'repo' permissions"
  Write-Host "- Ensure repository is not private (or token has access)"
}

Write-Host ""
Write-Host "Done. Repository: https://github.com/$ownerRepo"
