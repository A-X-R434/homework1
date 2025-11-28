// 服务器配置 - 包含用户认证功能
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 5000;

// 中间件配置
app.use(cors());
app.use(express.json());

// 静态文件服务
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'dist');
console.log(`静态文件服务路径: ${frontendBuildPath}`);

// 添加请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  // 处理@vite/client请求，避免阻止页面加载
  if (req.url === '/@vite/client') {
    console.log('特殊处理 @vite/client 请求');
    return res.status(200).type('application/javascript').send('// Vite client placeholder - not needed in production');
  }
  next();
});

app.use(express.static(frontendBuildPath));

// 404 处理
app.use((req, res, next) => {
  console.log(`404 - ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Not Found' });
});

// 内存存储用户数据（简化版）
const users = [
  // 默认测试用户
  {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123' // 实际项目中应加密存储
  }
];

// 生成简单的token（实际项目中应使用JWT）
const generateToken = (userId) => {
  return `token_${userId}_${Date.now()}`;
};

// 验证token
const verifyToken = (token) => {
  if (!token || typeof token !== 'string') {
    return null;
  }
  
  const parts = token.split('_');
  if (parts.length < 3) {
    return null;
  }
  
  const userId = parseInt(parts[1]);
  return users.find(u => u.id === userId) || null;
};

// API路由

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ message: 'API服务运行正常', timestamp: new Date().toISOString() });
});

// 用户注册
app.post('/api/users/register', (req, res) => {
  const { username, email, password } = req.body;
  
  // 验证输入
  if (!username || !email || !password) {
    return res.status(400).json({ message: '缺少必要字段' });
  }
  
  // 检查用户名是否已存在
  if (users.some(u => u.username === username)) {
    return res.status(400).json({ message: '用户名已存在' });
  }
  
  // 检查邮箱是否已存在
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ message: '邮箱已被注册' });
  }
  
  // 创建新用户
  const newUser = {
    id: users.length + 1,
    username,
    email,
    password // 实际项目中应加密存储
  };
  
  users.push(newUser);
  
  res.status(201).json({ message: '注册成功' });
});

// 用户登录
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  
  // 验证输入
  if (!email || !password) {
    return res.status(400).json({ message: '缺少必要字段' });
  }
  
  // 查找用户
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: '邮箱或密码错误' });
  }
  
  // 生成token
  const token = generateToken(user.id);
  
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  });
});

// 获取当前用户信息
app.get('/api/users/me', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未授权' });
  }
  
  const token = authHeader.split(' ')[1];
  const user = verifyToken(token);
  
  if (!user) {
    return res.status(401).json({ message: '无效的token' });
  }
  
  res.json({
    id: user.id,
    username: user.username,
    email: user.email
  });
});

// 处理所有其他请求，返回index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
  console.log(`前端构建路径: ${frontendBuildPath}`);
});