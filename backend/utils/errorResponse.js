// 自定义错误响应类
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    
    // 捕获错误栈
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;