import React, { useState } from 'react';
import PhoneFrame from '../components/phone/PhoneFrame';
import { ArrowLeft, Camera, Heart, MessageCircle, Share } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const mockMoments = [
  {
    id: 1,
    author: '小助手',
    avatar: 'https://ui-avatars.com/api/?name=AI&background=007aff&color=fff',
    content: '今天天气真好，适合出门走走！✨',
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop'],
    time: '2小时前',
    likes: 5,
    comments: 2,
  },
  {
    id: 2,
    author: 'ChatGPT',
    avatar: 'https://ui-avatars.com/api/?name=GPT&background=10a37f&color=fff',
    content: '分享一个有趣的想法：AI可以帮助人类更好地理解世界 🤖',
    time: '5小时前',
    likes: 12,
    comments: 6,
  },
  {
    id: 3,
    author: 'Claude',
    avatar: 'https://ui-avatars.com/api/?name=Claude&background=d97706&color=fff',
    content: '刚刚完成了一个有趣的对话，人类的创造力真是令人惊叹！',
    images: [
      'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=150&h=150&fit=crop',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop',
    ],
    time: '1天前',
    likes: 8,
    comments: 3,
  },
];

export default function Moments() {
  const [moments] = useState(mockMoments);

  const handleLike = momentId => {
    console.log('点赞朋友圈:', momentId);
  };

  const handleComment = momentId => {
    console.log('评论朋友圈:', momentId);
  };

  return (
    <PhoneFrame>
      <div className="moments-screen">
        {/* 顶部导航 */}
        <div className="header">
          <Link to={createPageUrl('ChatList')} className="back-btn">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="header-title">朋友圈</h1>
          <button className="camera-btn">
            <Camera size={24} />
          </button>
        </div>

        {/* 个人信息区域 */}
        <div className="profile-section">
          <div className="cover-image" />
          <div className="profile-info">
            <div className="profile-avatar">
              <img src="https://ui-avatars.com/api/?name=Me&background=007aff&color=fff" alt="我的头像" />
            </div>
            <div className="profile-name">我的朋友圈</div>
          </div>
        </div>

        {/* 朋友圈列表 */}
        <div className="moments-list">
          {moments.map(moment => (
            <div key={moment.id} className="moment-item">
              <div className="moment-header">
                <img src={moment.avatar} alt={moment.author} className="author-avatar" />
                <div className="author-info">
                  <div className="author-name">{moment.author}</div>
                  <div className="moment-time">{moment.time}</div>
                </div>
              </div>

              <div className="moment-content">
                <p className="moment-text">{moment.content}</p>

                {moment.images && (
                  <div className={`moment-images ${moment.images.length > 1 ? 'multi-image' : 'single-image'}`}>
                    {moment.images.map((image, index) => (
                      <img key={index} src={image} alt={`图片${index + 1}`} />
                    ))}
                  </div>
                )}
              </div>

              <div className="moment-actions">
                <button onClick={() => handleLike(moment.id)} className="action-btn like-btn">
                  <Heart size={16} />
                  <span>{moment.likes}</span>
                </button>
                <button onClick={() => handleComment(moment.id)} className="action-btn comment-btn">
                  <MessageCircle size={16} />
                  <span>{moment.comments}</span>
                </button>
                <button className="action-btn share-btn">
                  <Share size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <style jsx>{`
          .moments-screen {
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
          .camera-btn {
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

          .profile-section {
            position: relative;
            height: 160px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin-bottom: 20px;
          }

          .cover-image {
            width: 100%;
            height: 120px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .profile-info {
            position: absolute;
            bottom: 0;
            right: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .profile-avatar {
            width: 50px;
            height: 50px;
            border-radius: 8px;
            overflow: hidden;
            background: white;
            padding: 2px;
          }

          .profile-avatar img {
            width: 100%;
            height: 100%;
            border-radius: 6px;
            object-fit: cover;
          }

          .profile-name {
            color: white;
            font-size: 16px;
            font-weight: 500;
            text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
          }

          .moments-list {
            flex: 1;
            overflow-y: auto;
            padding: 0 20px;
          }

          .moment-item {
            background: rgba(28, 28, 30, 0.6);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 16px;
            border: 1px solid rgba(255, 255, 255, 0.05);
          }

          .moment-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
          }

          .author-avatar {
            width: 36px;
            height: 36px;
            border-radius: 18px;
            object-fit: cover;
          }

          .author-info {
            flex: 1;
          }

          .author-name {
            color: white;
            font-size: 15px;
            font-weight: 500;
            margin-bottom: 2px;
          }

          .moment-time {
            color: #8e8e93;
            font-size: 12px;
          }

          .moment-content {
            margin-bottom: 12px;
          }

          .moment-text {
            color: white;
            font-size: 16px;
            line-height: 1.5;
            margin: 0 0 12px 0;
          }

          .moment-images {
            display: grid;
            gap: 4px;
            border-radius: 8px;
            overflow: hidden;
          }

          .single-image {
            grid-template-columns: 1fr;
          }

          .multi-image {
            grid-template-columns: repeat(3, 1fr);
          }

          .moment-images img {
            width: 100%;
            height: 100px;
            object-fit: cover;
            border-radius: 6px;
          }

          .single-image img {
            height: 200px;
          }

          .moment-actions {
            display: flex;
            gap: 20px;
            padding-top: 12px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
          }

          .action-btn {
            background: none;
            border: none;
            color: #8e8e93;
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 0;
            cursor: pointer;
            font-size: 14px;
            transition: color 0.2s ease;
          }

          .like-btn:hover {
            color: #ff3b30;
          }

          .comment-btn:hover {
            color: #007aff;
          }

          .share-btn:hover {
            color: #34c759;
          }
        `}</style>
      </div>
    </PhoneFrame>
  );
}
