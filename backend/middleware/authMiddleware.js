const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// 保护路由 - 验证用户是否已登录并有权限访问
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 从请求头中获取token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // 设置token为Bearer之后的值
    token = req.headers.authorization.split(' ')[1];
  }
  // 也可以从cookie中获取token（如果前端通过cookie发送）
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // 确保token存在
  if (!token) {
    return next(new ErrorResponse('未授权访问此路由', 401));
  }

  try {
    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 查找用户并将用户对象附加到请求上
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(new ErrorResponse('未授权访问此路由', 401));
  }
});

// 授权中间件 - 检查用户是否有特定角色
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(
        `用户角色 ${req.user.role} 无权访问此路由`, 
        403
      ));
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};