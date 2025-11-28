const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { setupSecurity, validateEnv } = require('./middleware/security');
const path = require('path');
const os = require('os');
const helmet = require('helmet');
const morgan = require('morgan');

// 加载环境变量
dotenv.config();

// 验证必要的环境变量
if (!validateEnv()) {
  process.exit(1);
}

// 连接数据库
connectDB();

const app = express();

// 设置通用安全中间件
setupSecurity(app);

// 环境特定安全配置
if (process.env.NODE_ENV === 'production') {
  // 使用helmet增强安全头 - 生产环境完整配置
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://trusted-cdn.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https:", "http://localhost:5000"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"]
      }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));
  
  // 生产环境CORS配置 - 限制特定域名
  const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
    process.env.ALLOWED_ORIGINS.split(',') : 
    [];
  
  app.use(cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204
  }));
  
  // 生产环境日志 - 更简洁的格式
  app.use(morgan('combined'));
} else {
  // 开发环境配置 - 简化的helmet配置
  app.use(helmet({
    contentSecurityPolicy: false, // 开发环境禁用CSP以便调试
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));
  
  app.use(cors({
    origin: "*",
    credentials: true
  }));
  
  app.use(morgan('dev'));
}

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
  
  if (fs.existsSync(frontendBuildPath)) {
    // 提供静态文件服务 - 生产环境配置
    app.use(express.static(frontendBuildPath, {
      maxAge: '1d', // 静态文件缓存1天
      etag: true
    }));
    
    // 所有非API路由都返回index.html，支持前端路由
    app.get('*', (req, res, next) => {
      // 如果请求路径以/api开头，继续下一个中间件
      if (req.path.startsWith('/api')) {
        return next();
      }
      
      // 其他所有请求都返回index.html
      res.sendFile(path.join(frontendBuildPath, 'index.html'));
    });
  } else {
    console.error('错误: 前端构建目录不存在!');
  }
} else {
  // 开发环境：提供public目录的静态文件服务
  const publicPath = path.join(__dirname, 'public');
  const fs = require('fs');
  
  // 确保public目录存在
  if (fs.existsSync(publicPath)) {
    console.log(`提供静态文件服务: ${publicPath}`);
    app.use(express.static(publicPath));
    
    // 所有非API路由都返回index.html，支持前端路由
    app.get('*', (req, res, next) => {
      // 如果请求路径以/api开头，继续下一个中间件
      if (req.path.startsWith('/api')) {
        return next();
      }
      
      // 尝试直接提供静态文件
      const staticFilePath = path.join(publicPath, req.path);
      
      if (fs.existsSync(staticFilePath) && !fs.lstatSync(staticFilePath).isDirectory()) {
        return res.sendFile(staticFilePath);
      }
      
      // 其他所有请求都返回index.html
      const indexPath = path.join(publicPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        next(); // 如果index.html不存在，继续下一个中间件（通常是404）
      }
    });
  } else {
    console.log('public目录不存在，未提供静态文件服务');
  }
}

// 错误处理中间件
app.use(notFound);
app.use(errorHandler);

// 获取端口
const PORT = process.env.PORT || 5000;

// 启动服务器 - 监听0.0.0.0以便其他PC访问
const HOST = '0.0.0.0'; // 监听所有网络接口
app.listen(PORT, HOST, () => {
  const networkInterfaces = os.networkInterfaces();
  let ipAddress = 'localhost';
  
  // 获取本地网络IP地址
  Object.keys(networkInterfaces).forEach(interfaceName => {
    networkInterfaces[interfaceName].forEach(iface => {
      if (iface.family === 'IPv4' && !iface.internal) {
        ipAddress = iface.address;
      }
    });
  });
  
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`其他PC可通过 http://${ipAddress}:${PORT} 访问`);
  console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API 健康检查: http://localhost:${PORT}/api/health`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`前端服务: http://localhost:${PORT}`);
    console.log(`其他PC可通过 http://${ipAddress}:${PORT} 访问前端应用`);
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