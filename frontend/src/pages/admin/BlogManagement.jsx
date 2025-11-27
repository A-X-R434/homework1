import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '../../api/blogApi';
import '../../styles/admin/BlogManagement.css';

const BlogManagement = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  // 获取博客文章列表
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await getBlogPosts();
      setBlogPosts(response.data);
    } catch (err) {
      setError(err);
      console.error('获取博客列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 处理表单输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 表单验证
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '请输入博客标题';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = '请输入博客内容';
    } else if (formData.content.trim().length < 50) {
      newErrors.content = '博客内容至少需要50个字符';
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理创建博客
  const handleCreateBlogPost = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      await createBlogPost(formData);
      
      // 重置表单
      setFormData({
        title: '',
        content: ''
      });
      
      setShowCreateForm(false);
      fetchBlogPosts();
    } catch (err) {
      console.error('创建博客失败:', err);
      alert('创建博客失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 开始编辑博客
  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content
    });
  };

  // 处理更新博客
  const handleUpdateBlogPost = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      await updateBlogPost(editingPost._id, formData);
      
      setEditingPost(null);
      setFormData({
        title: '',
        content: ''
      });
      
      fetchBlogPosts();
    } catch (err) {
      console.error('更新博客失败:', err);
      alert('更新博客失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 处理删除博客
  const handleDelete = async (postId) => {
    if (window.confirm('确定要删除这篇博客吗？')) {
      try {
        await deleteBlogPost(postId);
        fetchBlogPosts();
      } catch (err) {
        console.error('删除博客失败:', err);
        alert('删除博客失败，请重试');
      }
    }
  };

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (loading) {
    return <Loading message="加载博客列表中..." />;
  }

  if (error) {
    return (
      <Error 
        error={error} 
        onRetry={fetchBlogPosts} 
      />
    );
  }

  return (
    <div className="blog-management">
      <div className="page-header">
        <h1>博客管理</h1>
        <button 
          className="create-btn" 
          onClick={() => {
            setShowCreateForm(true);
            setEditingPost(null);
          }}
        >
          发布新博客
        </button>
      </div>

      {/* 创建/编辑表单 */}
      {(showCreateForm || editingPost) && (
        <div className="blog-form-container">
          <form 
            onSubmit={editingPost ? handleUpdateBlogPost : handleCreateBlogPost}
            className="blog-form"
          >
            <h2>{editingPost ? '编辑博客' : '发布新博客'}</h2>
            
            <div className="form-group">
              <label htmlFor="title">博客标题 *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="请输入博客标题"
                disabled={submitting}
              />
              {formErrors.title && <span className="error">{formErrors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="content">博客内容 *</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="请输入博客内容（至少50个字符）"
                rows={10}
                disabled={submitting}
              />
              {formErrors.content && <span className="error">{formErrors.content}</span>}
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? '提交中...' : (editingPost ? '更新博客' : '发布博客')}
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingPost(null);
                  setFormData({
                    title: '',
                    content: ''
                  });
                  setFormErrors({});
                }}
                disabled={submitting}
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 博客列表 */}
      <div className="blog-list">
        <h2>博客列表</h2>
        {blogPosts.length === 0 ? (
          <p className="no-blogs">暂无博客，请发布新博客</p>
        ) : (
          <div className="blogs-grid">
            {blogPosts.map(post => (
              <div key={post._id} className="blog-card">
                <h3>{post.title}</h3>
                <p className="meta">
                  作者: {post.author?.username || '未知作者'}
                  <span className="date">发布时间: {formatDate(post.createdAt)}</span>
                </p>
                <p className="excerpt">
                  {post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content}
                </p>
                
                <div className="blog-actions">
                  <button 
                    className="edit-btn" 
                    onClick={() => handleEdit(post)}
                  >
                    编辑
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDelete(post._id)}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;