const app = require('./app');

// 获取端口号
const PORT = process.env.PORT || 5000;

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 错误处理
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // 关闭服务器
  process.exit(1);
});