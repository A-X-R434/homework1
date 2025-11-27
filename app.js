const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// 配置环境变量
dotenv.config();

// 连接数据库
connectDB();

// 初始化应用
const app = express();

// 安全中间件
app.use(helmet());

// 跨域中间件
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// 数据解析中间件
app.use(express.json());

// 路由定义
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/blog', require('./routes/blogRoutes'));
app.use('/api/blog/:postId/comments', require('./routes/commentRoutes'));
app.use('/api/contact', require('./routes/messageRoutes'));

// 错误处理中间件
app.use(errorHandler);

module.exports = app;