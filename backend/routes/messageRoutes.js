const express = require('express');
const router = express.Router();
const { getMessages, getMessage, createMessage, updateMessageStatus, deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// 公开路由 - 提交留言
router.post('/', createMessage);

// 需要认证的路由（管理员功能）
router.get('/', protect, getMessages);
router.get('/:id', protect, getMessage);
router.put('/:id', protect, updateMessageStatus);
router.delete('/:id', protect, deleteMessage);

module.exports = router;