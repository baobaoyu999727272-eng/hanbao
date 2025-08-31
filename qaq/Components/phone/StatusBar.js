import React, { useState, useEffect } from 'react';
import { Battery, Wifi, Signal } from 'lucide-react';

export default function StatusBar() {
  const [time, setTime] = useState(new Date());
  const [battery, setBattery] = useState(85);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // 模拟电池变化
    const batteryTimer = setInterval(() => {
      setBattery(prev => {
        const newLevel = prev - 0.1;
        return newLevel < 20 ? 85 : newLevel;
      });
    }, 30000);

    return () => {
      clearInterval(timer);
      clearInterval(batteryTimer);
    };
  }, []);

  const formatTime = date => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="status-time">{formatTime(time)}</span>
      </div>

      <div className="status-right">
        <Signal size={14} className="status-icon" />
        <Wifi size={14} className="status-icon" />
        <div className="battery-container">
          <span className="battery-percentage">{Math.round(battery)}%</span>
          <Battery
            size={20}
            className={`battery-icon ${battery < 20 ? 'battery-low' : ''}`}
            fill={battery < 20 ? '#ff3b30' : 'currentColor'}
          />
        </div>
      </div>

      <style jsx>{`
        .status-bar {
          height: 44px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          background: transparent;
          position: relative;
          z-index: 5;
        }

        .status-left {
          display: flex;
          align-items: center;
        }

        .status-time {
          font-size: 16px;
          font-weight: 600;
        }

        .status-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-icon {
          color: white;
        }

        .battery-container {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .battery-percentage {
          font-size: 14px;
          font-weight: 500;
        }

        .battery-icon {
          color: white;
        }

        .battery-low {
          color: #ff3b30 !important;
        }

        @media (max-width: 480px) {
          .status-bar {
            padding: 0 16px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
}
