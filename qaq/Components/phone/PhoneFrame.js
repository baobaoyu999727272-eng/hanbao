import React from 'react';
import StatusBar from './StatusBar';

export default function PhoneFrame({ children, showNotch = true }) {
  return (
    <div className="phone-frame">
      {showNotch && <div className="phone-notch" />}
      <div className="phone-screen">
        <StatusBar />
        <div className="screen-content">{children}</div>
      </div>

      <style jsx>{`
        .phone-frame {
          width: 100%;
          height: 100%;
          background: #000;
          border-radius: 40px;
          padding: 8px;
          position: relative;
          box-shadow: 0 0 0 2px #333, 0 20px 40px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .phone-notch {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 140px;
          height: 28px;
          background: #000;
          border-radius: 0 0 16px 16px;
          z-index: 10;
        }

        .phone-screen {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border-radius: 32px;
          overflow: hidden;
          position: relative;
        }

        .screen-content {
          height: calc(100% - 44px);
          overflow: hidden;
        }

        @media (max-width: 480px) {
          .phone-frame {
            border-radius: 0;
            padding: 0;
            box-shadow: none;
          }

          .phone-screen {
            border-radius: 0;
          }

          .phone-notch {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
