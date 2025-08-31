import React, { useState, useEffect } from 'react';
import { Chat } from '@/entities/Chat';
import { Message } from '@/entities/Message';
import PhoneFrame from '../components/phone/PhoneFrame';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    const chatData = await Chat.list('-last_time');
    setChats(chatData);
  };

  const createNewChat = async () => {
    const newChat = await Chat.create({
      name: '新的聊天',
      type: 'single',
      persona: '你是一个友好的AI助手',
      last_message: '开始聊天吧！',
      last_time: new Date().toISOString(),
    });

    navigate(createPageUrl(`Chat?id=${newChat.id}`));
  };

  const filteredChats = chats.filter(chat => chat.name.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <PhoneFrame>
      <div className="chat-list-screen">
        {/* 顶部导航 */}
        <div className="header">
          <Link to={createPageUrl('Home')} className="back-btn">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="header-title">消息</h1>
          <button onClick={createNewChat} className="add-btn">
            <Plus size={24} />
          </button>
        </div>

        {/* 搜索栏 */}
        <div className="search-container">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="搜索聊天记录"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* 聊天列表 */}
        <div className="chat-list">
          {filteredChats.map(chat => (
            <Link key={chat.id} to={createPageUrl(`Chat?id=${chat.id}`)} className="chat-item">
              <div className="chat-avatar">
                <img
                  src={chat.avatar || `https://ui-avatars.com/api/?name=${chat.name}&background=007aff&color=fff`}
                  alt={chat.name}
                />
              </div>
              <div className="chat-info">
                <div className="chat-name">{chat.name}</div>
                <div className="chat-last-message">{chat.last_message || '开始聊天吧！'}</div>
              </div>
              <div className="chat-meta">
                <div className="chat-time">
                  {chat.last_time
                    ? new Date(chat.last_time).toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : ''}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 底部导航 */}
        <div className="bottom-nav">
          <Link to={createPageUrl('Moments')} className="nav-item">
            <span>朋友圈</span>
          </Link>
        </div>

        <style jsx>{`
          .chat-list-screen {
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

          .back-btn,
          .add-btn {
            color: #007aff;
            background: none;
            border: none;
            padding: 8px;
            border-radius: 8px;
            cursor: pointer;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .back-btn:hover,
          .add-btn:hover {
            background: rgba(0, 122, 255, 0.1);
          }

          .header-title {
            color: white;
            font-size: 20px;
            font-weight: 600;
            margin: 0;
          }

          .search-container {
            padding: 16px 20px;
            background: #000;
          }

          .search-bar {
            background: rgba(28, 28, 30, 1);
            border-radius: 12px;
            display: flex;
            align-items: center;
            padding: 10px 16px;
            gap: 8px;
          }

          .search-icon {
            color: #8e8e93;
          }

          .search-input {
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            flex: 1;
            outline: none;
          }

          .search-input::placeholder {
            color: #8e8e93;
          }

          .chat-list {
            flex: 1;
            overflow-y: auto;
            background: #000;
          }

          .chat-item {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            color: white;
            text-decoration: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            transition: background-color 0.2s ease;
          }

          .chat-item:hover {
            background: rgba(28, 28, 30, 0.5);
          }

          .chat-item:active {
            background: rgba(28, 28, 30, 0.8);
          }

          .chat-avatar {
            width: 50px;
            height: 50px;
            border-radius: 25px;
            overflow: hidden;
            margin-right: 12px;
            background: #333;
          }

          .chat-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .chat-info {
            flex: 1;
            min-width: 0;
          }

          .chat-name {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 4px;
            color: white;
          }

          .chat-last-message {
            font-size: 14px;
            color: #8e8e93;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .chat-meta {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 4px;
          }

          .chat-time {
            font-size: 12px;
            color: #8e8e93;
          }

          .bottom-nav {
            background: rgba(28, 28, 30, 0.95);
            backdrop-filter: blur(20px);
            padding: 16px 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          .nav-item {
            color: #007aff;
            text-decoration: none;
            font-size: 16px;
            font-weight: 500;
            text-align: center;
            display: block;
          }
        `}</style>
      </div>
    </PhoneFrame>
  );
}
