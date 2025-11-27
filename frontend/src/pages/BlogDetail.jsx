import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { getBlogPost, createComment } from '../api/blogApi';
import '../styles/BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  // 获取博客文章详情
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await getBlogPost(id);
        setBlogPost(response.data);
      } catch (err) {
        setError(err);
        console.error('获取博客详情失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  // 提交评论
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      alert('评论内容不能为空');
      return;
    }

    try {
      setSubmittingComment(true);
      await createComment(id, { body: commentText });
      
      // 更新评论列表
      const updatedPost = await getBlogPost(id);
      setBlogPost(updatedPost.data);
      
      setCommentText('');
      setCommentSuccess(true);
      
      // 3秒后清除成功提示
      setTimeout(() => setCommentSuccess(false), 3000);
    } catch (err) {
      console.error('提交评论失败:', err);
      alert('提交评论失败，请重试');
    } finally {
      setSubmittingComment(false);
    }
  };

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return <Loading message="加载博客详情中..." />;
  }

  if (error || !blogPost) {
    return (
      <Error 
        error={error || { message: '找不到该博客文章' }} 
        onRetry={() => window.location.reload()} 
      />
    );
  }

  return (
    <div className="blog-detail-page">
      <div className="container">
        {/* 博客文章内容 */}
        <article className="blog-content">
          <h1>{blogPost.title}</h1>
          
          <div className="blog-meta">
            <span className="author">作者: {blogPost.author?.username || '未知作者'}</span>
            <span className="date">发布时间: {formatDate(blogPost.createdAt)}</span>
            {blogPost.updatedAt !== blogPost.createdAt && (
              <span className="updated">更新时间: {formatDate(blogPost.updatedAt)}</span>
            )}
          </div>
          
          <div className="blog-body">
            {blogPost.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>

        {/* 评论部分 */}
        <section className="comments-section">
          <h2>评论 ({blogPost.comments?.length || 0})</h2>
          
          {/* 评论表单 */}
          {isAuthenticated ? (
            <div className="comment-form-container">
              <h3>发表评论</h3>
              {commentSuccess && (
                <div className="comment-success">评论提交成功！</div>
              )}
              <form onSubmit={handleSubmitComment}>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="写下你的评论..."
                  rows={4}
                  disabled={submittingComment}
                />
                <button 
                  type="submit" 
                  disabled={submittingComment}
                  className="submit-comment-btn"
                >
                  {submittingComment ? '提交中...' : '发表评论'}
                </button>
              </form>
            </div>
          ) : (
            <p className="login-to-comment">
              请先<a href="/login">登录</a>后发表评论
            </p>
          )}

          {/* 评论列表 */}
          <div className="comments-list">
            {blogPost.comments && blogPost.comments.length > 0 ? (
              blogPost.comments.map(comment => (
                <div key={comment._id} className="comment">
                  <div className="comment-header">
                    <span className="comment-author">{comment.author?.username}</span>
                    <span className="comment-date">{formatDate(comment.createdAt)}</span>
                  </div>
                  <div className="comment-body">
                    {comment.body}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-comments">暂无评论，快来发表第一条评论吧！</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogDetail;