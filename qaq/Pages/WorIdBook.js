import React, { useState, useEffect } from 'react';
import { WorldBook } from '@/entities/WorldBook';
import PhoneFrame from '../components/phone/PhoneFrame';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

export default function WorldBookScreen() {
  const [worldBooks, setWorldBooks] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({ name: '', content: '', description: '' });

  useEffect(() => {
    loadWorldBooks();
  }, []);

  const loadWorldBooks = async () => {
    const books = await WorldBook.list('-created_date');
    setWorldBooks(books);
  };

  const handleCreateNew = () => {
    setEditingBook(null);
    setFormData({ name: '', content: '', description: '' });
    setShowEditor(true);
  };

  const handleEdit = book => {
    setEditingBook(book);
    setFormData({
      name: book.name,
      content: book.content,
      description: book.description || '',
    });
    setShowEditor(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.content.trim()) {
      alert('请填写书名和内容');
      return;
    }

    try {
      if (editingBook) {
        await WorldBook.update(editingBook.id, formData);
      } else {
        await WorldBook.create(formData);
      }
      setShowEditor(false);
      loadWorldBooks();
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    }
  };

  const handleDelete = async book => {
    if (confirm(`确定要删除"${book.name}"吗？`)) {
      try {
        await WorldBook.delete(book.id);
        loadWorldBooks();
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
            <h1 className="header-title">{editingBook ? '编辑世界书' : '创建世界书'}</h1>
            <button onClick={handleSave} className="save-btn">
              保存
            </button>
          </div>

          <div className="editor-content">
            <div className="form-group">
              <label>书名</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入世界书的名称..."
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>简介</label>
              <input
                type="text"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="简短描述这个世界观..."
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>内容</label>
              <textarea
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                placeholder="在此处输入详细的世界观设定..."
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
              min-height: 300px;
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
      <div className="worldbook-screen">
        <div className="header">
          <Link to={createPageUrl('Home')} className="back-btn">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="header-title">世界书</h1>
          <button onClick={handleCreateNew} className="add-btn">
            <Plus size={24} />
          </button>
        </div>

        <div className="worldbook-list">
          <AnimatePresence>
            {worldBooks.map(book => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="book-card">
                  <CardHeader className="card-header">
                    <div className="book-info">
                      <div className="book-icon">
                        <Book size={24} color="#007aff" />
                      </div>
                      <div className="book-details">
                        <CardTitle className="book-title">{book.name}</CardTitle>
                        {book.description && <p className="book-description">{book.description}</p>}
                        <div className="book-meta">
                          创建于 {new Date(book.created_date).toLocaleDateString('zh-CN')}
                        </div>
                      </div>
                    </div>
                    <div className="book-actions">
                      <button onClick={() => handleEdit(book)} className="action-btn edit-btn">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(book)} className="action-btn delete-btn">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="card-content">
                    <div className="book-preview">
                      {book.content.substring(0, 150)}
                      {book.content.length > 150 && '...'}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {worldBooks.length === 0 && (
            <div className="empty-state">
              <Book size={48} color="#8e8e93" />
              <h3>还没有世界书</h3>
              <p>创建你的第一个世界观设定</p>
              <Button onClick={handleCreateNew} className="create-btn">
                <Plus size={16} className="mr-2" />
                创建世界书
              </Button>
            </div>
          )}
        </div>

        <style jsx>{`
          .worldbook-screen {
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

          .worldbook-list {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
          }

          .book-card {
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

          .book-info {
            display: flex;
            gap: 12px;
            flex: 1;
          }

          .book-icon {
            flex-shrink: 0;
            margin-top: 2px;
          }

          .book-details {
            flex: 1;
          }

          .book-title {
            color: white;
            font-size: 18px;
            margin: 0 0 8px 0;
          }

          .book-description {
            color: #8e8e93;
            font-size: 14px;
            margin: 0 0 8px 0;
          }

          .book-meta {
            color: #636366;
            font-size: 12px;
          }

          .book-actions {
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

          .book-preview {
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

          :global(.book-card .card-header) {
            padding: 16px 20px 12px;
          }

          :global(.book-card .card-content) {
            padding: 0 20px 16px;
          }
        `}</style>
      </div>
    </PhoneFrame>
  );
}
