const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// 注册路由
router.post('/register', registerUser);

// 登录路由
router.post('/login', loginUser);

module.exports = router;