import React, { useState, useEffect } from 'react';
import { Character } from '@/entities/Character';
import PhoneFrame from '../components/phone/PhoneFrame';
import { ArrowLeft, Plus, User, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

export default function Characters() {
  const [characters, setCharacters] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingChar, setEditingChar] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    persona: '',
    avatar: '',
    pat_suffix: '',
  });

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    const chars = await Character.list('-created_date');
    setCharacters(chars);
  };

  const handleCreateNew = () => {
    setEditingChar(null);
    setFormData({ name: '', persona: '', avatar: '', pat_suffix: '' });
    setShowEditor(true);
  };

  const handleEdit = char => {
    setEditingChar(char);
    setFormData({
      name: char.name,
      persona: char.persona,
      avatar: char.avatar || '',
      pat_suffix: char.pat_suffix || '',
    });
    setShowEditor(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.persona.trim()) {
      alert('请填写角色名称和人设');
      return;
    }

    try {
      if (editingChar) {
        await Character.update(editingChar.id, formData);
      } else {
        await Character.create(formData);
      }
      setShowEditor(false);
      loadCharacters();
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    }
  };

  const handleDelete = async char => {
    if (confirm(`确定要删除角色"${char.name}"吗？`)) {
      try {
        await Character.delete(char.id);
        loadCharacters();
      } catch (error) {
        console.error('删除失败:', error);
        alert('删除失败，请重试');
      }
    }
  };

  if (showEditor) {
    return (
      <PhoneFrame>
        <div className="editor-screen">
          <div className="header">
            <button onClick={() => setShowEditor(false)} className="back-btn">
              <ArrowLeft size={24} />
            </button>
            <h1 className="header-title">{editingChar ? '编辑角色' : '创建角色'}</h1>
            <button onClick={handleSave} className="save-btn">
              保存
            </button>
          </div>

          <div className="editor-content">
            <div className="form-group">
              <label>角色名称</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="输入角色名称..."
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>头像URL</label>
              <input
                type="text"
                value={formData.avatar}
                onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="输入头像图片链接..."
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>拍一拍后缀</label>
              <input
                type="text"
                value={formData.pat_suffix}
                onChange={e => setFormData({ ...formData, pat_suffix: e.target.value })}
                placeholder="例如：的脑袋瓜"
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>角色人设</label>
              <textarea
                value={formData.persona}
                onChange={e => setFormData({ ...formData, persona: e.target.value })}
                placeholder="详细描述这个角色的性格、背景、说话方式等..."
                className="form-textarea"
              />
            </div>
          </div>

          <style jsx>{`
            .editor-screen {
              height: 100%;
              background: #000;
              display: flex;
              flex-direction: column;
            }

            .editor-content {
              flex: 1;
              padding: 20px;
              display: flex;
              flex-direction: column;
              gap: 16px;
            }

            .form-group {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }

            .form-group label {
              color: white;
              font-size: 16px;
              font-weight: 500;
            }

            .form-input {
              background: rgba(28, 28, 30, 1);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 8px;
              padding: 12px 16px;
              color: white;
              font-size: 16px;
            }

            .form-input::placeholder {
              color: #8e8e93;
            }

            .form-textarea {
              background: rgba(28, 28, 30, 1);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 8px;
              padding: 16px;
              color: white;
              font-size: 16px;
              resize: none;
              flex: 1;
              min-height: 200px;
            }

            .form-textarea::placeholder {
              color: #8e8e93;
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
            .save-btn {
              color: #007aff;
              background: none;
              border: none;
              padding: 8px 12px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
              font-weight: 500;
            }

            .header-title {
              color: white;
              font-size: 18px;
              font-weight: 600;
              margin: 0;
            }
          `}</style>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className="characters-screen">
        <div className="header">
          <Link to={createPageUrl('Home')} className="back-btn">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="header-title">人设管理</h1>
          <button onClick={handleCreateNew} className="add-btn">
            <Plus size={24} />
          </button>
        </div>

        <div className="characters-list">
          <AnimatePresence>
            {characters.map(char => (
              <motion.div
                key={char.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="char-card">
                  <CardHeader className="card-header">
                    <div className="char-info">
                      <div className="char-avatar">
                        {char.avatar ? <img src={char.avatar} alt={char.name} /> : <User size={24} color="#007aff" />}
                      </div>
                      <div className="char-details">
                        <CardTitle className="char-name">{char.name}</CardTitle>
                        {char.pat_suffix && <p className="char-suffix">拍一拍{char.pat_suffix}</p>}
                        <div className="char-meta">
                          创建于 {new Date(char.created_date).toLocaleDateString('zh-CN')}
                        </div>
                      </div>
                    </div>
                    <div className="char-actions">
                      <button onClick={() => handleEdit(char)} className="action-btn edit-btn">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(char)} className="action-btn delete-btn">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="card-content">
                    <div className="char-preview">
                      {char.persona.substring(0, 120)}
                      {char.persona.length > 120 && '...'}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {characters.length === 0 && (
            <div className="empty-state">
              <User size={48} color="#8e8e93" />
              <h3>还没有角色人设</h3>
              <p>创建你的第一个AI角色</p>
              <Button onClick={handleCreateNew} className="create-btn">
                <Plus size={16} className="mr-2" />
                创建角色
              </Button>
            </div>
          )}
        </div>

        <style jsx>{`
          .characters-screen {
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
          }

          .header-title {
            color: white;
            font-size: 20px;
            font-weight: 600;
            margin: 0;
          }

          .characters-list {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
          }

          .char-card {
            background: rgba(28, 28, 30, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
            margin-bottom: 16px;
          }

          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 16px 20px 12px;
          }

          .char-info {
            display: flex;
            gap: 12px;
            flex: 1;
          }

          .char-avatar {
            width: 48px;
            height: 48px;
            border-radius: 24px;
            background: rgba(58, 58, 60, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            flex-shrink: 0;
          }

          .char-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .char-details {
            flex: 1;
          }

          .char-name {
            color: white;
            font-size: 18px;
            margin: 0 0 4px 0;
          }

          .char-suffix {
            color: #8e8e93;
            font-size: 14px;
            margin: 0 0 8px 0;
          }

          .char-meta {
            color: #636366;
            font-size: 12px;
          }

          .char-actions {
            display: flex;
            gap: 8px;
          }

          .action-btn {
            background: none;
            border: none;
            color: #8e8e93;
            padding: 8px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .edit-btn:hover {
            background: rgba(0, 122, 255, 0.1);
            color: #007aff;
          }

          .delete-btn:hover {
            background: rgba(255, 59, 48, 0.1);
            color: #ff3b30;
          }

          .card-content {
            padding: 0 20px 16px;
          }

          .char-preview {
            color: #d1d1d6;
            font-size: 14px;
            line-height: 1.5;
          }

          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 60px 20px;
            color: #8e8e93;
          }

          .empty-state h3 {
            color: white;
            font-size: 20px;
            margin: 16px 0 8px 0;
          }

          .empty-state p {
            font-size: 14px;
            margin: 0 0 24px 0;
          }

          .create-btn {
            background: #007aff;
            color: white;
          }

          .create-btn:hover {
            background: #0056d6;
          }

          :global(.char-card .card-header) {
            padding: 16px 20px 12px;
          }

          :global(.char-card .card-content) {
            padding: 0 20px 16px;
          }
        `}</style>
      </div>
    </PhoneFrame>
  );
}
