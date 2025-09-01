# 安全推送到 hanbao 仓库
Write-Host "=== 推送到 hanbao 仓库 ===" -ForegroundColor Green
Write-Host ""
Write-Host "即将推送到: https://github.com/baobaoyu999727272-eng/hanbao.git"
Write-Host ""
Write-Host "请输入您的 GitHub Personal Access Token"
Write-Host "Token 需要有 'repo' 权限"
Write-Host "获取地址: https://github.com/settings/tokens"
Write-Host ""

$token = Read-Host "GitHub Token" -AsSecureString

if (-not $token) {
  Write-Host "❌ 未提供 Token" -ForegroundColor Red
  exit 1
}

# 转换为明文（仅在内存中使用）
$ptr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
$plainToken = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($ptr)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)

try {
  # 临时设置带认证的远程URL
  $authUrl = "https://$plainToken@github.com/baobaoyu999727272-eng/hanbao.git"
  git remote set-url origin $authUrl
    
  Write-Host "正在推送..." -ForegroundColor Yellow
    
  # 强制推送创建新的仓库历史
  $result = git push --force-with-lease origin main 2>&1
  $exitCode = $LASTEXITCODE
    
  if ($exitCode -eq 0) {
    Write-Host "🎉 推送成功！" -ForegroundColor Green
    Write-Host "项目已部署到: https://github.com/baobaoyu999727272-eng/hanbao"
    Write-Host ""
    Write-Host "您可以访问以下链接:"
    Write-Host "- 仓库地址: https://github.com/baobaoyu999727272-eng/hanbao"
    Write-Host "- 如需启用 GitHub Pages: https://github.com/baobaoyu999727272-eng/hanbao/settings/pages"
  }
  else {
    Write-Host "❌ 推送失败" -ForegroundColor Red
    Write-Host "输出: $result"
  }
    
}
finally {
  # 恢复原始远程URL（移除token）
  git remote set-url origin "https://github.com/baobaoyu999727272-eng/hanbao.git"
    
  # 清理内存中的token
  $plainToken = $null
  $token = $null
}

Write-Host ""
Write-Host "完成！"
