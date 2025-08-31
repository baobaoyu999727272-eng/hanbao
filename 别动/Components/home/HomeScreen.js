import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { MessageCircle, Settings, Book, User, Image, Users } from 'lucide-react';

const apps = [
  {
    name: '消息',
    icon: MessageCircle,
    url: 'ChatList',
    color: '#25d366',
    description: 'AI聊天对话',
  },
  {
    name: '世界书',
    icon: Book,
    url: 'WorldBook',
    color: '#007aff',
    description: '世界观设定',
  },
  {
    name: '人设',
    icon: User,
    url: 'Characters',
    color: '#ff9500',
    description: '角色人设管理',
  },
  {
    name: '朋友圈',
    icon: Users,
    url: 'Moments',
    color: '#34c759',
    description: 'AI朋友圈',
  },
  {
    name: '壁纸',
    icon: Image,
    url: 'Wallpaper',
    color: '#af52de',
    description: '个性化壁纸',
  },
  {
    name: '设置',
    icon: Settings,
    url: 'Settings',
    color: '#8e8e93',
    description: '应用设置',
  },
];

export default function HomeScreen() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const dateStr = now.toLocaleDateString('zh-CN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="home-screen">
      {/* 时钟区域 */}
      <div className="clock-container">
        <div className="main-time">{timeStr}</div>
        <div className="main-date">{dateStr}</div>
      </div>

      {/* 应用网格 */}
      <div className="app-grid">
        {apps.map((app, index) => (
          <Link key={app.name} to={createPageUrl(app.url)} className="app-link">
            <div className="app-icon" style={{ '--app-color': app.color }}>
              <div className="app-icon-bg">
                <app.icon size={32} className="app-icon-svg" />
              </div>
              <span className="app-label">{app.name}</span>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .home-screen {
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 20px 20px;
          position: relative;
          overflow: hidden;
        }

        .home-screen::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }

        .clock-container {
          text-align: center;
          color: white;
          margin-bottom: 60px;
          position: relative;
          z-index: 1;
        }

        .main-time {
          font-size: 72px;
          font-weight: 200;
          line-height: 1;
          margin-bottom: 8px;
          text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
        }

        .main-date {
          font-size: 18px;
          font-weight: 400;
          opacity: 0.9;
          text-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
        }

        .app-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          width: 100%;
          max-width: 280px;
          position: relative;
          z-index: 1;
        }

        .app-link {
          text-decoration: none;
          transition: transform 0.2s ease, filter 0.2s ease;
        }

        .app-link:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }

        .app-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .app-icon-bg {
          width: 60px;
          height: 60px;
          background: var(--app-color);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1);
          transition: transform 0.2s ease;
        }

        .app-icon-bg:active {
          transform: scale(0.95);
        }

        .app-icon-svg {
          color: white;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
        }

        .app-label {
          color: white;
          font-size: 12px;
          font-weight: 500;
          text-align: center;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
        }

        @media (max-width: 480px) {
          .home-screen {
            padding: 20px;
          }

          .main-time {
            font-size: 60px;
          }

          .app-grid {
            gap: 24px;
            max-width: 240px;
          }

          .app-icon-bg {
            width: 56px;
            height: 56px;
          }
        }
      `}</style>
    </div>
  );
}
