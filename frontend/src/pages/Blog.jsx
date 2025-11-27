import React, { useState, useEffect } from 'react';
import BlogPostCard from '../components/BlogPostCard';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { getBlogPosts } from '../api/blogApi';
import '../styles/Blog.css';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 获取所有博客文章
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await getBlogPosts();
        // 按发布时间倒序排列，最新的文章在前面
        const sortedPosts = response.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBlogPosts(sortedPosts);
      } catch (err) {
        setError(err);
        console.error('获取博客文章失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // 重试获取博客文章
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    
    getBlogPosts()
      .then(response => {
        const sortedPosts = response.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBlogPosts(sortedPosts);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return <Loading message="加载博客文章中..." />;
  }

  if (error) {
    return <Error error={error} onRetry={handleRetry} />;
  }

  return (
    <div className="blog-page">
      <div className="container">
        <h1>博客文章</h1>
        
        {blogPosts.length > 0 ? (
          <div className="blog-posts-grid">
            {blogPosts.map(post => (
              <BlogPostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="no-posts">
            <p>暂无博客文章</p>
            <p>敬请期待更多精彩内容！</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;