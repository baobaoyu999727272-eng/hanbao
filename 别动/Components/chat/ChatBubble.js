import React from 'react';
import { motion } from 'framer-motion';

export default function ChatBubble({ message, isUser, avatar, theme = 'default' }) {
  const themes = {
    default: {
      user: { bg: '#007aff', text: '#fff' },
      ai: { bg: '#f2f2f7', text: '#000' },
    },
    pink_blue: {
      user: { bg: '#ff6b9d', text: '#fff' },
      ai: { bg: '#4ecdc4', text: '#fff' },
    },
    purple_yellow: {
      user: { bg: '#a8e6cf', text: '#333' },
      ai: { bg: '#ffd3a5', text: '#333' },
    },
  };

  const currentTheme = themes[theme] || themes.default;
  const style = currentTheme[isUser ? 'user' : 'ai'];

  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="message-image-container">
            <img src={message.image_url} alt="发送的图片" className="message-image" />
            {message.content && <p className="image-caption">{message.content}</p>}
          </div>
        );
      case 'transfer':
        return (
          <div className="transfer-message">
            <div className="transfer-icon">💰</div>
            <div className="transfer-content">
              <div className="transfer-amount">¥{message.metadata?.amount || '0.00'}</div>
              <div className="transfer-note">{message.metadata?.note || '转账'}</div>
            </div>
          </div>
        );
      case 'voice':
        return (
          <div className="voice-message">
            <div className="voice-icon">🎤</div>
            <div className="voice-duration">{message.metadata?.duration || '1"'}</div>
          </div>
        );
      default:
        return <p className="message-text">{message.content}</p>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`chat-bubble ${isUser ? 'user-bubble' : 'ai-bubble'}`}
    >
      {!isUser && avatar && <img src={avatar} alt="头像" className="bubble-avatar" />}

      <div
        className="bubble-content"
        style={{
          backgroundColor: style.bg,
          color: style.text,
        }}
      >
        {renderContent()}
        <div className="message-time">
          {new Date(message.created_date).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      <style jsx>{`
        .chat-bubble {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          max-width: 85%;
        }

        .user-bubble {
          flex-direction: row-reverse;
          margin-left: auto;
        }

        .ai-bubble {
          margin-right: auto;
        }

        .bubble-avatar {
          width: 36px;
          height: 36px;
          border-radius: 18px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .bubble-content {
          border-radius: 18px;
          padding: 12px 16px;
          position: relative;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          max-width: 100%;
          word-wrap: break-word;
        }

        .message-text {
          margin: 0;
          line-height: 1.4;
          font-size: 16px;
        }

        .message-time {
          font-size: 11px;
          opacity: 0.6;
          margin-top: 4px;
        }

        .message-image-container {
          max-width: 200px;
        }

        .message-image {
          width: 100%;
          border-radius: 12px;
          margin-bottom: 4px;
        }

        .image-caption {
          margin: 8px 0 0 0;
          font-size: 14px;
        }

        .transfer-message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 4px 0;
        }

        .transfer-icon {
          font-size: 24px;
        }

        .transfer-amount {
          font-size: 18px;
          font-weight: 600;
        }

        .transfer-note {
          font-size: 14px;
          opacity: 0.8;
        }

        .voice-message {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 80px;
        }

        .voice-icon {
          font-size: 20px;
        }

        .voice-duration {
          font-size: 14px;
        }
      `}</style>
    </motion.div>
  );
}
