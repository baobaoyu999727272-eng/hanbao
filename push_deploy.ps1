# push_deploy.ps1
# 用法：在 PowerShell 中 cd 到项目目录后运行：
# powershell -ExecutionPolicy Bypass -File .\push_deploy.ps1

$repoRemote = 'https://github.com/baobaoyu999727272-eng/baobaoyu-xiaoshouji.git'
$ownerRepo = 'baobaoyu999727272-eng/baobaoyu-xiaoshouji'

Write-Host "== GitHub Push & Deploy Helper =="
Write-Host "Repository: $repoRemote"

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
  git commit -m "deploy site" -q
  Write-Host "Committed changes."
} catch {
  Write-Host "No changes to commit or commit failed (ok)."
}

# 确保分支为 main
try {
  git branch -M main
} catch {}

# 交互式获取 token（SecureString）
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
} catch {}

git remote add origin $authUrl

Write-Host "Pushing to remote... (this will use the token you entered)"
$pushResult = & git push -u origin main
$pushExit = $LASTEXITCODE

# 恢复远端 URL（移除 token）
try {
  git remote set-url origin $repoRemote
} catch {}

# 清理内存中的 token 变量
Remove-Variable token -ErrorAction SilentlyContinue
Remove-Variable tokenSecure -ErrorAction SilentlyContinue

if ($pushExit -eq 0) {
  Write-Host "Push succeeded. Actions will run and deploy may take a few minutes." -ForegroundColor Green
} else {
  Write-Host "Push failed with exit code $pushExit. See git output above for details." -ForegroundColor Red
}

Write-Host "Done. Open https://github.com/$ownerRepo/actions to monitor the workflow."
