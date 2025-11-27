const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 认证中间件 - 验证JWT token
const auth = async (req, res, next) => {
  try {
    // 从Authorization头获取token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        statusCode: 401,
        message: '未授权访问，请提供有效的认证token'
      });
    }
    
    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 查找对应的用户
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        statusCode: 401,
        message: '用户不存在或已被删除'
      });
    }
    
    // 将用户信息和token附加到请求对象上，以便后续使用
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    // 处理不同类型的错误
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        statusCode: 401,
        message: '无效的token，请提供有效的认证token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        statusCode: 401,
        message: '认证token已过期，请重新登录获取新token'
      });
    }
    
    // 其他未知错误
    res.status(500).json({
      statusCode: 500,
      message: '认证过程中发生错误'
    });
  }
};

// 可选认证中间件 - 不强制要求token，但如果提供了有效token则附加用户信息
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      // 验证token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (user) {
        req.user = user;
        req.token = token;
      }
    }
    
    next();
  } catch (error) {
    // 不抛出错误，仅记录日志，继续执行
    console.error('可选认证过程中的错误:', error);
    next();
  }
};

module.exports = { auth, optionalAuth };