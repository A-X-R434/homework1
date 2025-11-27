// 自定义错误类
class CustomError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 404错误处理中间件
const notFound = (req, res, next) => {
  const error = new CustomError(404, `找不到此路径: ${req.originalUrl}`);
  next(error);
};

// 全局错误处理中间件
const errorHandler = (err, req, res, next) => {
  // 设置默认值
  const statusCode = err.statusCode || 500;
  const message = err.message || '服务器内部错误';
  
  // 开发环境下显示详细错误信息
  const response = {
    statusCode,
    message,
    // 只在非生产环境下显示stack信息
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  };
  
  // 处理不同类型的错误
  if (err.name === 'ValidationError') {
    // Mongoose验证错误
    const validationErrors = {};
    
    // 提取所有字段的验证错误信息
    Object.keys(err.errors).forEach(field => {
      validationErrors[field] = err.errors[field].message;
    });
    
    response.message = '验证失败';
    response.errors = validationErrors;
    response.statusCode = 400;
  } else if (err.code === 11000) {
    // MongoDB重复键错误
    const field = Object.keys(err.keyValue)[0];
    response.message = `${field} 已被使用，请尝试其他值`;
    response.statusCode = 400;
  }
  
  // 记录错误日志
  console.error('错误详情:', err);
  
  // 返回JSON格式的错误响应
  res.status(statusCode).json(response);
};

module.exports = { notFound, errorHandler, CustomError };