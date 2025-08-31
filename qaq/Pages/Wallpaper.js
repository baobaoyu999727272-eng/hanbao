import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PhoneFrame from '../components/phone/PhoneFrame';

const presetWallpapers = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=800&fit=crop',
  'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=800&fit=crop',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=800&fit=crop',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=800&fit=crop',
  'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?w=400&h=800&fit=crop',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=800&fit=crop',
];

const gradientWallpapers = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
];

export default function Wallpaper() {
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);
  const [customWallpaper, setCustomWallpaper] = useState('');

  const handleSelectPreset = wallpaper => {
    setSelectedWallpaper(wallpaper);
  };

  const handleSelectGradient = gradient => {
    setSelectedWallpaper(gradient);
  };

  const handleApplyWallpaper = () => {
    if (selectedWallpaper) {
      // 这里可以保存壁纸设置
      localStorage.setItem('hanbao-wallpaper', selectedWallpaper);
      alert('壁纸已应用！');
    } else {
      alert('请先选择一个壁纸');
    }
  };

  const handleCustomUrl = () => {
    if (customWallpaper.trim()) {
      setSelectedWallpaper(customWallpaper.trim());
    }
  };

  return (
    <PhoneFrame>
      <div className="wallpaper-screen">
        <div className="header">
          <Link to={createPageUrl('Home')} className="back-btn">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="header-title">壁纸设置</h1>
          <div className="header-spacer" />
        </div>

        <div className="wallpaper-content">
          {/* 当前预览 */}
          <div className="preview-section">
            <h2 className="section-title">预览</h2>
            <div className="wallpaper-preview">
              <div
                className="preview-frame"
                style={{
                  background: selectedWallpaper?.includes('gradient')
                    ? selectedWallpaper
                    : selectedWallpaper
                    ? `url(${selectedWallpaper}) center/cover`
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                <div className="preview-clock">12:34</div>
                <div className="preview-apps">
                  <div className="preview-app"></div>
                  <div className="preview-app"></div>
                  <div className="preview-app"></div>
                </div>
              </div>
            </div>
          </div>

          {/* 自定义URL */}
          <div className="custom-section">
            <h2 className="section-title">自定义壁纸</h2>
            <div className="custom-input-group">
              <input
                type="url"
                value={customWallpaper}
                onChange={e => setCustomWallpaper(e.target.value)}
                placeholder="输入图片URL..."
                className="url-input"
              />
              <Button onClick={handleCustomUrl} variant="outline" className="load-btn">
                加载
              </Button>
            </div>
          </div>

          {/* 预设壁纸 */}
          <div className="preset-section">
            <h2 className="section-title">精选壁纸</h2>
            <div className="wallpaper-grid">
              {presetWallpapers.map((wallpaper, index) => (
                <div
                  key={index}
                  className={`wallpaper-item ${selectedWallpaper === wallpaper ? 'selected' : ''}`}
                  onClick={() => handleSelectPreset(wallpaper)}
                  style={{ backgroundImage: `url(${wallpaper})` }}
                />
              ))}
            </div>
          </div>

          {/* 渐变壁纸 */}
          <div className="gradient-section">
            <h2 className="section-title">渐变色</h2>
            <div className="gradient-grid">
              {gradientWallpapers.map((gradient, index) => (
                <div
                  key={index}
                  className={`gradient-item ${selectedWallpaper === gradient ? 'selected' : ''}`}
                  onClick={() => handleSelectGradient(gradient)}
                  style={{ background: gradient }}
                />
              ))}
            </div>
          </div>

          {/* 应用按钮 */}
          <div className="action-section">
            <Button onClick={handleApplyWallpaper} className="apply-btn">
              <Palette size={16} className="mr-2" />
              应用壁纸
            </Button>
          </div>
        </div>

        <style jsx>{`
          .wallpaper-screen {
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

          .wallpaper-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
          }

          .preview-section {
            margin-bottom: 30px;
          }

          .section-title {
            color: white;
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 16px 0;
          }

          .wallpaper-preview {
            display: flex;
            justify-content: center;
          }

          .preview-frame {
            width: 120px;
            height: 240px;
            border-radius: 20px;
            position: relative;
            border: 2px solid rgba(255, 255, 255, 0.1);
            overflow: hidden;
          }

          .preview-clock {
            color: white;
            font-size: 16px;
            font-weight: 300;
            text-align: center;
            margin-top: 30px;
            text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
          }

          .preview-apps {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
          }

          .preview-app {
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 4px;
          }

          .custom-section {
            margin-bottom: 30px;
          }

          .custom-input-group {
            display: flex;
            gap: 8px;
          }

          .url-input {
            flex: 1;
            background: rgba(28, 28, 30, 1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 10px 16px;
            color: white;
            font-size: 16px;
          }

          .url-input::placeholder {
            color: #8e8e93;
          }

          .load-btn {
            background: rgba(58, 58, 60, 1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
            white-space: nowrap;
          }

          .preset-section,
          .gradient-section {
            margin-bottom: 30px;
          }

          .wallpaper-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }

          .wallpaper-item {
            aspect-ratio: 1;
            background-size: cover;
            background-position: center;
            border-radius: 12px;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.2s ease;
          }

          .wallpaper-item.selected {
            border-color: #007aff;
            transform: scale(0.95);
          }

          .gradient-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }

          .gradient-item {
            aspect-ratio: 1;
            border-radius: 12px;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.2s ease;
          }

          .gradient-item.selected {
            border-color: #007aff;
            transform: scale(0.95);
          }

          .action-section {
            text-align: center;
          }

          .apply-btn {
            background: #007aff;
            color: white;
            width: 100%;
            font-size: 16px;
            padding: 12px;
          }

          .apply-btn:hover {
            background: #0056d6;
          }
        `}</style>
      </div>
    </PhoneFrame>
  );
}
