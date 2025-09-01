# 自定义域名配置指南

## 📋 需要准备的内容

1. 您拥有的域名（例如：your-domain.com）
2. 域名提供商的DNS管理界面访问权限

## 🔧 配置步骤

### 步骤1：修改 CNAME 文件

编辑项目根目录的 `CNAME` 文件，将内容改为您的域名：

```
your-domain.com
```

### 步骤2：配置DNS记录

在您的域名提供商（如阿里云、腾讯云、Cloudflare等）的DNS管理界面添加以下记录：

#### 方案A：使用 CNAME 记录（推荐）

```
类型: CNAME
名称: www (或 @，取决于您想要的访问方式)
值: baobaoyu999727272-eng.github.io
```

#### 方案B：使用 A 记录

```
类型: A
名称: @ (根域名)
值: 
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

如果需要 www 子域名：

```
类型: CNAME
名称: www
值: baobaoyu999727272-eng.github.io
```

### 步骤3：在 GitHub 设置页面配置

1. 访问：<https://github.com/baobaoyu999727272-eng/hanbao/settings/pages>
2. 在 "Custom domain" 框中输入您的域名
3. 勾选 "Enforce HTTPS"（强烈推荐）
4. 点击 Save

### 步骤4：验证配置

- DNS 生效通常需要几分钟到几小时
- 使用 `nslookup your-domain.com` 检查DNS是否生效
- 访问您的自定义域名确认网站正常显示

## 🌟 常见域名提供商设置示例

### 阿里云（万网）

1. 登录阿里云控制台
2. 域名 → 域名列表 → 解析
3. 添加记录：类型CNAME，主机记录www，记录值baobaoyu999727272-eng.github.io

### 腾讯云

1. 登录腾讯云控制台
2. 域名注册 → 我的域名 → 解析
3. 添加记录：记录类型CNAME，主机记录www，记录值baobaoyu999727272-eng.github.io

### Cloudflare

1. 登录Cloudflare控制台
2. 选择您的域名 → DNS
3. Add record：Type CNAME，Name www，Target baobaoyu999727272-eng.github.io

## ⚠️ 注意事项

- 确保域名已备案（如果是中国大陆访问）
- DNS生效时间：几分钟到24小时不等
- 建议先用子域名（如www.your-domain.com）测试
- HTTPS证书会自动生成，但可能需要几分钟时间

## 📞 需要帮助？

如果您有具体的域名，我可以帮您生成详细的DNS配置说明。
