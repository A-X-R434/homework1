import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useRef } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Projects from './pages/Projects/Projects';
import Blog from './pages/Blog/Blog';
import './App.css';

function App() {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const nodeRef = useRef(null);

  // Navbar component
  const Navbar = () => {
    const navigate = useNavigate();
    const currentLocation = useLocation();
    
    // 返回上一级功能
    const handleGoBack = () => {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        // 如果没有历史记录，默认返回主页
        navigate('/');
      }
    };
    
    return (
      <nav className="navbar">
        {/* 只在非根路径显示返回按钮，放置在导航栏顶部 */}
        {currentLocation.pathname !== '/' && (
          <button 
            className="back-button"
            onClick={handleGoBack}
            aria-label="Go back"
          >
            <FaArrowLeft />
          </button>
        )}
        <div className="logo">
          <Link to="/">Project Management System</Link>
          
        </div>
      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/blog">Blog</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
    );
  };

  return (
    <div className="app">
      <div className="system-header">Wanghan's Project Management System</div>
      <Navbar />
      <div className="main-content">
        <TransitionGroup>
          <CSSTransition
            nodeRef={nodeRef}
            key={location.key}
            timeout={300}
            classNames="page-transition"
          >
            <div ref={nodeRef}>
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/projects" element={
                isAuthenticated ? <Projects /> : <Navigate to="/login" replace />}
              />
              <Route path="/blog" element={
                isAuthenticated ? <Blog /> : <Navigate to="/login" replace />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </div>
  );
}

export default App;
