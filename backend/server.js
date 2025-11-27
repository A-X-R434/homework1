const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const path = require('path');

// 加载环境变量
dotenv.config();

// 连接数据库
connectDB();

const app = express();

// 简单CORS配置
app.use(cors({
  origin: "*",
  credentials: true
}));

// 简单请求日志中间件
app.use((req, res, next) => {
  console.log(`收到请求: ${req.method} ${req.originalUrl}`);
  next();
});

// 解析请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 集成路由 - 添加/api前缀
app.use('/api', routes);

// 生产环境：提供前端静态文件
const nodeEnv = process.env.NODE_ENV;
const isProduction = nodeEnv && nodeEnv.trim() === 'production';
console.log(`当前环境: '${nodeEnv}', 是否生产环境: ${isProduction}`);

if (isProduction) {
  // 设置前端构建目录路径
  const frontendBuildPath = path.join(__dirname, '../frontend/dist');
  const fs = require('fs');
  
  // 确保路径存在
  console.log(`前端构建路径: ${frontendBuildPath}`);
  console.log(`路径存在: ${fs.existsSync(frontendBuildPath)}`);
  console.log(`index.html存在: ${fs.existsSync(path.join(frontendBuildPath, 'index.html'))}`);
  
  // 提供静态文件服务
  app.use(express.static(frontendBuildPath));
  
  // 所有非API路由都返回index.html，支持前端路由
  app.get('*', (req, res, next) => {
    console.log(`处理请求: ${req.path}`);
    
    // 如果请求路径以/api开头，继续下一个中间件（通常是API路由或404）
    if (req.path.startsWith('/api')) {
      console.log(`跳过API路径: ${req.path}`);
      return next();
    }
    
    // 尝试直接提供静态文件
    const staticFilePath = path.join(frontendBuildPath, req.path);
    console.log(`尝试静态文件: ${staticFilePath}`);
    
    if (fs.existsSync(staticFilePath) && !fs.lstatSync(staticFilePath).isDirectory()) {
      console.log(`提供静态文件: ${req.path}`);
      return res.sendFile(staticFilePath);
    }
    
    // 其他所有请求都返回index.html
    console.log(`返回index.html给路径: ${req.path}`);
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
} else {
  // 开发环境：可选的静态文件服务
  // app.use(express.static('public'));
}

// 错误处理中间件
app.use(notFound);
app.use(errorHandler);

// 获取端口
const PORT = process.env.PORT || 5000;

// 启动服务器 - 监听0.0.0.0以便其他PC访问
app.listen(PORT, '0.0.0.0', () => {
  const serverIP = '172.20.10.3'; // 使用已获取的本机IP
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`其他PC可通过 http://${serverIP}:${PORT} 访问`);
  console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API 健康检查: http://localhost:${PORT}/api/health`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`前端服务: http://localhost:${PORT}`);
    console.log(`其他PC可通过 http://${serverIP}:${PORT} 访问前端应用`);
  }
});

// 处理未捕获的异常
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
  process.exit(1);
});

// 处理未处理的Promise拒绝
process.on('unhandledRejection', (err) => {
  console.error('未处理的Promise拒绝:', err);
  process.exit(1);
});