import React, { useState } from 'react';
import { sendMessage } from '../api/messageApi';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // 处理输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // 表单验证
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '请输入您的姓名';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '请输入您的邮箱';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = '请输入您的留言';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = '留言内容至少需要10个字符';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      await sendMessage(formData);
      
      // 重置表单
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      
      // 显示成功消息
      setSuccess(true);
      
      // 5秒后隐藏成功消息
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('提交留言失败:', error);
      alert('提交留言失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        <h1>联系我</h1>
        
        {success ? (
          <div className="success-message">
            <h2>留言提交成功！</h2>
            <p>感谢您的留言，我会尽快回复您。</p>
          </div>
        ) : (
          <div className="contact-form-container">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">姓名 *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="请输入您的姓名"
                  disabled={submitting}
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">邮箱 *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="请输入您的邮箱"
                  disabled={submitting}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="message">留言内容 *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="请输入您想对我说的话..."
                  rows={6}
                  disabled={submitting}
                />
                {errors.message && <span className="error">{errors.message}</span>}
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? '提交中...' : '发送留言'}
              </button>
            </form>

            <div className="contact-info">
              <h3>联系方式</h3>
              <p>如果您有任何问题或合作意向，请通过上方表单与我联系。</p>
              <p>我通常会在24小时内回复您的消息。</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;