import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlusSquare, FaTasks, FaFileAlt } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();

  // 处理导航到项目页面
  const handleCreateProject = () => {
    navigate('/projects');
  };

  // 处理导航到任务页面（这里我们暂时导航到项目页面）
  const handleViewTasks = () => {
    navigate('/projects');
  };

  // 处理导航到博客页面
  const handleReadBlogs = () => {
    navigate('/blog');
  };

  return (
    <div className="home-container">
      <h1>Welcome to Project Management System</h1>
      <p>This is the system homepage, where you can manage projects, view blogs, and send/receive messages</p>
      <div className="quick-actions">
        <button onClick={handleCreateProject}>
          <FaPlusSquare /> Create New Project
        </button>
        <button onClick={handleViewTasks}>
          <FaTasks /> View My Tasks
        </button>
        <button onClick={handleReadBlogs}>
          <FaFileAlt /> Read Latest Blogs
        </button>
      </div>
    </div>
  );
};

export default Home;