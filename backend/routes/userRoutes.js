const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// 注册路由
router.post('/register', registerUser);

// 登录路由
router.post('/login', loginUser);

// 获取当前用户信息（需要认证）
router.get('/me', protect, getMe);

module.exports = router;