// 超极简服务器配置 - 只提供简单HTML文件
const express = require('express');
const path = require('path');
const app = express();
const port = 5000;

// 添加请求日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] 收到请求: ${req.method} ${req.url} 来自IP: ${req.ip}`);
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// 根路径返回简单HTML文件
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'simple.html'));
});

// 启动服务器
app.listen(port, () => {
  console.log(`超极简服务器运行在 http://localhost:${port}`);
});