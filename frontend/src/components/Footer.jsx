import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <h3>个人作品集</h3>
            <p>展示我的项目、技能和博客文章</p>
          </div>
          
          <div className="footer-links">
            <h4>快速链接</h4>
            <ul>
              <li><Link to="/">首页</Link></li>
              <li><Link to="/projects">项目</Link></li>
              <li><Link to="/blog">博客</Link></li>
              <li><Link to="/contact">联系我</Link></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h4>联系方式</h4>
            <p>随时与我取得联系</p>
            <Link to="/contact" className="contact-btn">发送消息</Link>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} 个人作品集. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;