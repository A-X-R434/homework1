import React, { createContext, useState, useEffect, useContext } from 'react';
import { registerUser, loginUser } from '../api/userApi';

// 创建认证Context
const AuthContext = createContext();

// 认证Provider组件
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 初始化：从localStorage读取token和用户信息
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  // 注册函数
  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = { username, email, password };
      const response = await registerUser(userData);
      
      // 安全检查response和response.data
      if (!response || !response.data) {
        throw new Error('注册失败：无效的服务器响应');
      }
      
      const { token: newToken, user: newUser } = response.data;
      
      // 检查必要的数据字段
      if (!newToken || !newUser) {
        throw new Error('注册失败：缺少必要的认证信息');
      }
      
      // 存储token和用户信息
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setToken(newToken);
      setUser(newUser);
      
      return response;
    } catch (err) {
      setError(err.message || '注册失败');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 登录函数
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const credentials = { email, password };
      const response = await loginUser(credentials);
      
      // 安全检查response和response.data
      if (!response || !response.data) {
        throw new Error('登录失败：无效的服务器响应');
      }
      
      const { token: newToken, user: newUser } = response.data;
      
      // 检查必要的数据字段
      if (!newToken || !newUser) {
        throw new Error('登录失败：缺少必要的认证信息');
      }
      
      // 存储token和用户信息
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setToken(newToken);
      setUser(newUser);
      
      return response;
    } catch (err) {
      setError(err.message || '登录失败');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 登出函数
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // 认证状态值
  const authValue = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义Hook，用于在组件中访问认证状态
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;