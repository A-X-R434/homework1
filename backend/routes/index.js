const express = require('express');
const router = express.Router();

// 导入各模块路由
const userRoutes = require('./userRoutes');
const projectRoutes = require('./projectRoutes');
const blogRoutes = require('./blogRoutes');
const commentRoutes = require('./commentRoutes');
const messageRoutes = require('./messageRoutes');

// 定义API路由前缀
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/blogs', blogRoutes);
router.use('/comments', commentRoutes);
router.use('/messages', messageRoutes);

// 根路由健康检查
router.get('/health', (req, res) => {
  res.status(200).json({
    message: 'API服务运行正常',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;