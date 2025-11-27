import React, { useState, useEffect } from 'react';
import { blogAPI } from '../../services/api';
import { FaPlus, FaTimes, FaPaperPlane, FaFileAlt } from 'react-icons/fa';

const Blog = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'Technical Article',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const categories = ['Announcements', 'Technical Article', 'Management Tips', 'Project Cases', 'Others'];

  // Fetch blog posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await blogAPI.getAllPosts();
        // 从响应对象中提取data属性，因为后端返回的格式是{success: true, data: [...posts]}
        setPosts(response.data || []);
      } catch (err) {
        setError('Failed to fetch posts');
        console.error('Fetch posts error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) {
      setError('Please fill in title and content');
      return;
    }

    try {
        setLoading(true);
        const postData = {
          ...newPost,
          tags: newPost.tags.split(',').map(tag => tag.trim())
        };
        const response = await blogAPI.createPost(postData);
        // 从响应对象中提取data属性，因为后端返回的格式是{success: true, data: post}
        const createdPost = response.data;
        setPosts([createdPost, ...posts]);
        setNewPost({ title: '', content: '', category: 'Technical Article', tags: '' });
        setShowCreateForm(false);
        setError('');
      } catch (err) {
        setError('Failed to create post');
          console.error('Create post error:', err);
      } finally {
        setLoading(false);
      }
  };

  return (
      <div className="blog-container">
        <div className="blog-header">
        <h1>Enterprise Blog</h1>
        <button 
          className="create-post-btn" 
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? (
            <>
              <FaTimes /> Cancel
            </>
          ) : (
            <>
              <FaPlus /> Create Post
            </>
          )}
        </button>
      </div>

        {error && <div className="error-message">{error}</div>}
        {showCreateForm && (
          <div className="create-post-form">
            <h2>Create New Post</h2>
            <form onSubmit={handleCreatePost}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newPost.title}
                onChange={handleInputChange}
                required
                placeholder="Please enter post title"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={newPost.category}
                onChange={handleInputChange}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                name="content"
                value={newPost.content}
                onChange={handleInputChange}
                required
                placeholder="Please enter post content"
                rows={10}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="tags">Tags (comma separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={newPost.tags}
                onChange={handleInputChange}
                placeholder="Example: project management,frontend development"
              />
            </div>
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating...' : <><FaPaperPlane /> Publish Post</>}
            </button>
          </form>
        </div>
      )}

      <div className="posts-list">
        <h2>Posts List</h2>
        {loading && posts.length === 0 ? (
          <div className="loading">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="no-posts">No posts available</div>
        ) : (
          <div className="posts-container">
            {posts.map(post => (
              <div key={post.id} className="post-card">
              <div className="post-header">
                <h3>{post.title}</h3>
                <span className="category-tag">{post.category}</span>
              </div>
              <p className="post-content">{post.content.substring(0, 100)}...</p>
              <div className="post-meta">
                <span className="author">Author: {post.author || 'Admin'}</span>
                <span className="date">Published: {post.date || new Date(post.createdAt).toLocaleString()}</span>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
            ))}
            </div>
          )}
        </div>
      </div>
    );
};

export default Blog;