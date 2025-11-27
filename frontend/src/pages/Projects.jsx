import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { getProjects } from '../api/projectApi';
import '../styles/Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 获取所有项目
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects();
        setProjects(response.data);
      } catch (err) {
        setError(err);
        console.error('获取项目列表失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // 重试获取项目
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    
    getProjects()
      .then(response => {
        setProjects(response.data);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return <Loading message="加载项目列表中..." />;
  }

  if (error) {
    return <Error error={error} onRetry={handleRetry} />;
  }

  return (
    <div className="projects-page">
      <div className="container">
        <h1>我的项目</h1>
        
        {projects.length > 0 ? (
          <div className="projects-grid">
            {projects.map(project => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="no-projects">
            <p>暂无项目展示</p>
            <p>敬请期待更多精彩项目！</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;