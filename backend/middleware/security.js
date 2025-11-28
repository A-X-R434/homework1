const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

// 通用安全中间件配置
exports.setupSecurity = (app) => {
  // 压缩响应
  app.use(compression());
  
  // 自定义安全头
  app.use((req, res, next) => {
    // 防止点击劫持
    res.setHeader('X-Frame-Options', 'DENY');
    // 防止MIME类型嗅探
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // 启用XSS保护
    res.setHeader('X-XSS-Protection', '1; mode=block');
    // 启用Referrer Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });
};

// API速率限制器
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每IP限制请求数
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: '请求过于频繁，请稍后再试',
    statusCode: 429
  }
});

// 登录接口速率限制器（更严格）
exports.loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1小时
  max: 5, // 每IP限制登录尝试次数
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: '登录尝试次数过多，请1小时后再试',
    statusCode: 429
  }
});

// 验证环境变量是否设置
exports.validateEnv = () => {
  const requiredEnv = [
    'MONGO_URI',
    'JWT_SECRET',
    'PORT'
  ];
  
  const missing = [];
  requiredEnv.forEach(key => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });
  
  if (missing.length > 0) {
    console.error('错误: 缺少必要的环境变量:', missing);
    return false;
  }
  
  return true;
};

// 安全的响应处理
exports.sanitizeResponse = (data) => {
  if (!data) return data;
  
  // 移除敏感信息
  const sensitiveKeys = ['password', 'token', 'secret', 'privateKey'];
  
  if (typeof data === 'object') {
    const sanitized = Array.isArray(data) ? [] : {};
    
    for (const [key, value] of Object.entries(data)) {
      if (sensitiveKeys.includes(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = exports.sanitizeResponse(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
  
  return data;
};