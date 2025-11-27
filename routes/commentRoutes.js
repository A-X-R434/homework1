const express = require('express');
const router = express.Router({
  mergeParams: true // 允许访问父路由的参数
});
const { getComments, createComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

// 公开路由
router.get('/', getComments);

// 受保护路由
router.post('/', protect, createComment);

module.exports = router;