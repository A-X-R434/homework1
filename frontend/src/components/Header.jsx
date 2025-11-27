import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // 处理登出
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>个人作品集</h1>
          </Link>
          
          <nav className="nav">
            <ul className="nav-links">
              <li><Link to="/">首页</Link></li>
              <li><Link to="/projects">项目</Link></li>
              <li><Link to="/blog">博客</Link></li>
              <li><Link to="/contact">联系我</Link></li>
              
              {/* 认证状态感知的导航 */}
              {!isAuthenticated ? (
                // 未登录状态：显示登录/注册
                <>
                  <li><Link to="/login">登录</Link></li>
                  <li><Link to="/register">注册</Link></li>
                </>
              ) : (
                // 登录状态：显示用户信息/管理员后台/退出
                <div className="auth-user-menu">
                  <span className="user-greeting">欢迎, {user?.username}</span>
                  <li><Link to="/admin">管理员后台</Link></li>
                  <li><button onClick={handleLogout} className="logout-btn">退出</button></li>
                </div>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;