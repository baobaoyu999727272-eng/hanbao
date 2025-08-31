import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@/entities/Chat';
import { Message } from '@/entities/Message';
import { InvokeLLM } from '@/integrations/Core';
import PhoneFrame from '../components/phone/PhoneFrame';
import ChatBubble from '../Components/chat/ChatBubble';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ChatScreen() {
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chatId = params.get('id');
    if (chatId) {
      loadChat(chatId);
      loadMessages(chatId);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChat = async chatId => {
    const chatData = await Chat.list();
    const currentChat = chatData.find(c => c.id === chatId);
    setChat(currentChat);
  };

  const loadMessages = async chatId => {
    const messageData = await Message.filter({ chat_id: chatId }, 'created_date');
    setMessages(messageData);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !chat || isLoading) return;

    const userMessage = await Message.create({
      chat_id: chat.id,
      sender: 'user',
      content: inputText,
      type: 'text',
    });

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      // 构建上下文
      const recentMessages = messages.slice(-10);
      const context = recentMessages.map(msg => `${msg.sender === 'user' ? '用户' : 'AI'}: ${msg.content}`).join('\n');

      const prompt = `
你是一个友好的AI助手。以下是聊天历史：
${context}
用户: ${messageText}

请自然地回复用户的消息。回复要简洁、有帮助。
      `;

      const response = await InvokeLLM({
        prompt: prompt,
      });

      const aiMessage = await Message.create({
        chat_id: chat.id,
        sender: 'ai',
        content: response,
        type: 'text',
      });

      setMessages(prev => [...prev, aiMessage]);

      // 更新聊天的最后消息
      await Chat.update(chat.id, {
        last_message: response,
        last_time: new Date().toISOString(),
      });
    } catch (error) {
      console.error('发送消息失败:', error);
      const errorMessage = await Message.create({
        chat_id: chat.id,
        sender: 'ai',
        content: '抱歉，我现在无法回复。请稍后再试。',
        type: 'text',
      });
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!chat) {
    return (
      <PhoneFrame>
        <div className="loading-screen">
          <div className="loading-text">加载中...</div>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className="chat-screen">
        {/* 聊天头部 */}
        <div className="chat-header">
          <Link to={createPageUrl('ChatList')} className="back-btn">
            <ArrowLeft size={24} />
          </Link>
          <div className="chat-title">
            <div className="chat-name">{chat.name}</div>
            <div className="chat-status">在线</div>
          </div>
          <button className="settings-btn">
            <Settings size={20} />
          </button>
        </div>

        {/* 消息列表 */}
        <div className="messages-container">
          {messages.map(message => (
            <ChatBubble
              key={message.id}
              message={message}
              isUser={message.sender === 'user'}
              avatar={message.sender === 'ai' ? chat.avatar : null}
              theme={chat.theme}
            />
          ))}

          {isLoading && (
            <div className="typing-indicator">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="typing-text">AI正在输入...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="input-area">
          <button className="action-btn">
            <Plus size={24} />
          </button>
          <div className="input-container">
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入消息..."
              className="message-input"
              rows={1}
            />
          </div>
          <button onClick={sendMessage} disabled={!inputText.trim() || isLoading} className="send-btn">
            <Send size={20} />
          </button>
        </div>

        <style jsx>{`
          .chat-screen {
            height: 100%;
            background: #000;
            display: flex;
            flex-direction: column;
          }

          .loading-screen {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #000;
          }

          .loading-text {
            color: white;
            font-size: 16px;
          }

          .chat-header {
            display: flex;
            align-items: center;
            padding: 12px 20px;
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
            margin-right: 12px;
          }

          .chat-title {
            flex: 1;
            text-align: center;
          }

          .chat-name {
            color: white;
            font-size: 16px;
            font-weight: 600;
          }

          .chat-status {
            color: #8e8e93;
            font-size: 12px;
            margin-top: 2px;
          }

          .settings-btn {
            color: #007aff;
            background: none;
            border: none;
            padding: 8px;
            border-radius: 8px;
            cursor: pointer;
          }

          .messages-container {
            flex: 1;
            overflow-y: auto;
            padding: 16px 20px;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          }

          .typing-indicator {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            background: rgba(28, 28, 30, 0.6);
            border-radius: 18px;
            margin-bottom: 12px;
            width: fit-content;
          }

          .typing-dots {
            display: flex;
            gap: 4px;
          }

          .typing-dots span {
            width: 6px;
            height: 6px;
            background: #8e8e93;
            border-radius: 50%;
            animation: typing 1.4s infinite ease-in-out;
          }

          .typing-dots span:nth-child(2) {
            animation-delay: 0.2s;
          }

          .typing-dots span:nth-child(3) {
            animation-delay: 0.4s;
          }

          @keyframes typing {
            0%,
            60%,
            100% {
              transform: translateY(0);
            }
            30% {
              transform: translateY(-10px);
            }
          }

          .typing-text {
            color: #8e8e93;
            font-size: 14px;
          }

          .input-area {
            display: flex;
            align-items: flex-end;
            gap: 12px;
            padding: 12px 20px;
            background: rgba(28, 28, 30, 0.95);
            backdrop-filter: blur(20px);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          .action-btn {
            color: #007aff;
            background: none;
            border: none;
            padding: 8px;
            border-radius: 8px;
            cursor: pointer;
            flex-shrink: 0;
          }

          .input-container {
            flex: 1;
            background: rgba(58, 58, 60, 1);
            border-radius: 20px;
            padding: 8px 16px;
          }

          .message-input {
            width: 100%;
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            resize: none;
            outline: none;
            min-height: 20px;
            max-height: 100px;
            line-height: 20px;
          }

          .message-input::placeholder {
            color: #8e8e93;
          }

          .send-btn {
            background: #007aff;
            color: white;
            border: none;
            width: 36px;
            height: 36px;
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            flex-shrink: 0;
            transition: background-color 0.2s ease;
          }

          .send-btn:disabled {
            background: #48484a;
            cursor: not-allowed;
          }

          .send-btn:not(:disabled):hover {
            background: #0056d6;
          }
        `}</style>
      </div>
    </PhoneFrame>
  );
}
