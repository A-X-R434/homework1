import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BlogPostCard.css';

const BlogPostCard = ({ post }) => {
  const { _id, title, content, author, createdAt } = post;
  
  // 生成博客摘要（截取前150个字符）
  const getSummary = (text) => {
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
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

  return (
    <div className="blog-post-card">
      <div className="blog-post-header">
        <h3 className="blog-post-title">
          <Link to={`/blog/${_id}`}>{title}</Link>
        </h3>
        <div className="blog-post-meta">
          <span className="author">作者: {author && typeof author === 'object' && author.username ? author.username : '未知作者'}</span>
          <span className="date">发布时间: {formatDate(createdAt)}</span>
        </div>
      </div>
      
      <div className="blog-post-summary">
        {getSummary(content)}
      </div>
      
      <div className="blog-post-footer">
        <Link to={`/blog/${_id}`} className="read-more">
          阅读更多
        </Link>
      </div>
    </div>
  );
};

export default BlogPostCard;