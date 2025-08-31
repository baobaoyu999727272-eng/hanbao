import React, { useState } from 'react';
import PhoneFrame from '../components/phone/PhoneFrame';
import { ArrowLeft, Download, Upload, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [modelName, setModelName] = useState('gpt-3.5-turbo');
  const [autoReply, setAutoReply] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleSaveSettings = () => {
    // 保存设置到本地存储
    localStorage.setItem(
      'ephone-settings',
      JSON.stringify({
        apiKey,
        modelName,
        autoReply,
        darkMode,
      }),
    );
    alert('设置已保存！');
  };

  const handleExportData = () => {
    alert('数据导出功能开发中...');
  };

  const handleImportData = () => {
    alert('数据导入功能开发中...');
  };

  return (
    <PhoneFrame>
      <div className="settings-screen">
        {/* 顶部导航 */}
        <div className="header">
          <Link to={createPageUrl('Home')} className="back-btn">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="header-title">设置</h1>
          <div className="header-spacer" />
        </div>

        {/* 设置内容 */}
        <div className="settings-content">
          <Card className="settings-card">
            <CardHeader>
              <CardTitle className="card-title">API 设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="form-group">
                <Label htmlFor="api-key">API 密钥</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="输入您的 API 密钥"
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <Label htmlFor="model">模型选择</Label>
                <select
                  id="model"
                  value={modelName}
                  onChange={e => setModelName(e.target.value)}
                  className="select-field"
                >
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4o">GPT-4O</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="settings-card">
            <CardHeader>
              <CardTitle className="card-title">应用设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="switch-group">
                <div className="switch-info">
                  <Label>自动回复</Label>
                  <p className="switch-desc">开启后AI会自动回复消息</p>
                </div>
                <Switch checked={autoReply} onCheckedChange={setAutoReply} />
              </div>
              <div className="switch-group">
                <div className="switch-info">
                  <Label>深色模式</Label>
                  <p className="switch-desc">使用深色主题界面</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </CardContent>
          </Card>

          <Card className="settings-card">
            <CardHeader>
              <CardTitle className="card-title">数据管理</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleExportData} className="data-btn export-btn" variant="outline">
                <Download size={16} className="btn-icon" />
                导出数据
              </Button>
              <Button onClick={handleImportData} className="data-btn import-btn" variant="outline">
                <Upload size={16} className="btn-icon" />
                导入数据
              </Button>
            </CardContent>
          </Card>

          <div className="save-container">
            <Button onClick={handleSaveSettings} className="save-btn">
              保存设置
            </Button>
          </div>
        </div>

        <style jsx>{`
          .settings-screen {
            height: 100%;
            background: #000;
            display: flex;
            flex-direction: column;
          }

          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            background: rgba(28, 28, 30, 0.95);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .back-btn {
            color: #007aff;
            background: none;
            border: none;
            padding: 8px;
            border-radius: 8px;
            cursor: pointer;
            text-decoration: none;
            display: flex;
            align-items: center;
          }

          .header-title {
            color: white;
            font-size: 20px;
            font-weight: 600;
            margin: 0;
          }

          .header-spacer {
            width: 40px;
          }

          .settings-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
          }

          .settings-card {
            background: rgba(28, 28, 30, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
            margin-bottom: 16px;
          }

          .card-title {
            color: white;
            font-size: 18px;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .input-field {
            background: rgba(58, 58, 60, 1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
          }

          .input-field::placeholder {
            color: #8e8e93;
          }

          .select-field {
            background: rgba(58, 58, 60, 1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 16px;
          }

          .switch-group {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
          }

          .switch-info {
            flex: 1;
          }

          .switch-desc {
            font-size: 14px;
            color: #8e8e93;
            margin: 4px 0 0 0;
          }

          .data-btn {
            width: 100%;
            justify-content: flex-start;
            gap: 8px;
            background: rgba(58, 58, 60, 1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
          }

          .data-btn:hover {
            background: rgba(72, 72, 74, 1);
          }

          .btn-icon {
            color: #007aff;
          }

          .save-container {
            padding: 20px 0;
          }

          .save-btn {
            width: 100%;
            background: #007aff;
            color: white;
            font-size: 16px;
            padding: 12px;
          }

          .save-btn:hover {
            background: #0056d6;
          }

          :global(.settings-card .card-content) {
            color: white;
          }

          :global(.settings-card label) {
            color: white;
            font-size: 16px;
          }
        `}</style>
      </div>
    </PhoneFrame>
  );
}
