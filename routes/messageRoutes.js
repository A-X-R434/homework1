const express = require('express');
const router = express.Router();
const { createMessage } = require('../controllers/messageController');

// 公开路由 - 无需认证即可提交留言
router.post('/', createMessage);

module.exports = router;