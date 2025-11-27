// 极简服务器配置
const express = require('express');
const path = require('path');
const app = express();
const port = 5000;

// 配置CORS，允许所有来源
const cors = require('cors');
app.use(cors());

// 静态文件服务
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendBuildPath));

// API健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ message: 'API服务运行正常', timestamp: new Date().toISOString() });
});

// 处理所有其他请求，返回index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// 启动服务器
app.listen(port, () => {
  console.log(`极简服务器运行在 http://localhost:${port}`);
  console.log(`前端构建路径: ${frontendBuildPath}`);
});