# simple_deploy_hanbao.ps1
# 简化的部署脚本

$repoUrl = 'https://github.com/baobaoyu999727272-eng/hanbao.git'
$ownerRepo = 'baobaoyu999727272-eng/hanbao'

Write-Host "== 部署到 Hanbao 仓库 =="
Write-Host "目标: $repoUrl"
Write-Host ""

# 显示文件列表
Write-Host "项目文件:"
Get-ChildItem -Name | Where-Object { $_ -notlike ".git*" } | ForEach-Object { Write-Host "  - $_" }
Write-Host ""

# 获取 token
Write-Host "请输入 GitHub Personal Access Token:"
Write-Host "获取地址: https://github.com/settings/tokens"
$tokenSecure = Read-Host "Token" -AsSecureString

if (-not $tokenSecure) {
    Write-Host "未提供 Token，退出" -ForegroundColor Red
    exit 1
}

# 转换 token
$ptr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($tokenSecure)
$token = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($ptr)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)

# 准备推送
Write-Host "准备推送文件..."
git add .

$commitMsg = "Deploy to hanbao repository $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git commit -m $commitMsg

# 设置带认证的远程URL
$authUrl = "https://$token@github.com/$ownerRepo.git"
git remote set-url origin $authUrl

# 推送
Write-Host "推送到远程仓库..."
git push --force -u origin main

# 恢复URL
git remote set-url origin $repoUrl

# 清理
$token = $null
$tokenSecure = $null

Write-Host ""
Write-Host "部署完成！"
Write-Host "仓库地址: https://github.com/$ownerRepo"
