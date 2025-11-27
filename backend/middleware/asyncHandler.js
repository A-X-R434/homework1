// 异步错误处理中间件
// 用于包装异步路由处理器，捕获所有错误并传递给错误处理中间件

const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;