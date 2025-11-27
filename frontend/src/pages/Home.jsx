import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import BlogPostCard from '../components/BlogPostCard';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { getProjects } from '../api/projectApi';
import { getBlogPosts } from '../api/blogApi';
import '../styles/Home.css';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 获取最新的项目和博客数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResponse, blogResponse] = await Promise.all([
          getProjects(),
          getBlogPosts()
        ]);
        
        // 只显示最新的3个项目和3篇博客
        setProjects(projectsResponse.data.slice(0, 3));
        setBlogPosts(blogResponse.data.slice(0, 3));
      } catch (err) {
        setError(err);
        console.error('获取数据失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading message="加载首页内容中..." />;
  }

  if (error) {
    return (
      <Error 
        error={error} 
        onRetry={() => window.location.reload()} 
      />
    );
  }

  return (
    <div className="home-page">
      {/* 关于我部分 */}
      <section className="about-section">
        <div className="container">
          <h2>关于我</h2>
          <p>你好！我是一名全栈开发者，专注于创建现代化、响应式的Web应用。我热爱技术，不断学习和探索新的开发领域。</p>
          <p>这个作品集展示了我过去的项目、技术博客以及联系方式。欢迎浏览我的作品并与我取得联系！</p>
        </div>
      </section>

      {/* 项目预览部分 */}
      <section className="projects-preview">
        <div className="container">
          <div className="section-header">
            <h2>最新项目</h2>
            <Link to="/projects" className="view-all">查看全部</Link>
          </div>
          
          <div className="projects-grid">
            {projects.length > 0 ? (
              projects.map(project => (
                <ProjectCard key={project._id} project={project} />
              ))
            ) : (
              <p className="no-projects">暂无项目展示</p>
            )}
          </div>
        </div>
      </section>

      {/* 博客预览部分 */}
      <section className="blog-preview">
        <div className="container">
          <div className="section-header">
            <h2>最新博客</h2>
            <Link to="/blog" className="view-all">查看全部</Link>
          </div>
          
          <div className="blog-grid">
            {blogPosts.length > 0 ? (
              blogPosts.map(post => (
                <BlogPostCard key={post._id} post={post} />
              ))
            ) : (
              <p className="no-posts">暂无博客文章</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;