import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin/AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 处理退出登录
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <h1>管理员后台</h1>
          <div className="user-info">
            <span>欢迎，{user?.username || '管理员'}</span>
            <button onClick={handleLogout} className="logout-btn">退出登录</button>
          </div>
        </div>
      </header>

      <nav className="admin-nav">
        <ul>
          <li>
            <Link to="/admin">控制台</Link>
          </li>
          <li>
            <Link to="/admin/projects">项目管理</Link>
          </li>
          <li>
            <Link to="/admin/blog">博客管理</Link>
          </li>
        </ul>
      </nav>

      <main className="admin-main">
        <div className="dashboard-overview">
          <h2>控制台概览</h2>
          <p>欢迎使用管理员控制台，您可以管理您的项目和博客内容。</p>
          
          <div className="quick-actions">
            <div className="action-card">
              <h3>项目管理</h3>
              <p>查看、创建和管理您的项目</p>
              <Link to="/admin/projects" className="btn-primary">
                管理项目
              </Link>
            </div>
            
            <div className="action-card">
              <h3>博客管理</h3>
              <p>发布、编辑和管理您的博客文章</p>
              <Link to="/admin/blog" className="btn-primary">
                管理博客
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="admin-footer">
        <p>&copy; {new Date().getFullYear()} 个人作品集管理系统</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;