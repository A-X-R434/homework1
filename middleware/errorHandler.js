// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // 处理MongoDB验证错误
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      status: 'error',
      message: messages.join(', ')
    });
  }

  // 处理MongoDB唯一键错误
  if (err.code === 11000) {
    return res.status(400).json({
      status: 'error',
      message: '该邮箱或用户名已被注册'
    });
  }

  // 默认错误处理
  res.status(500).json({
    status: 'error',
    message: '服务器内部错误'
  });
};

module.exports = errorHandler;