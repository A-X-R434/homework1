const express = require('express');
const router = express.Router();
const { getCommentsByPostId, createComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// 公开路由 - 获取特定博客文章的所有评论
router.get('/post/:postId', getCommentsByPostId);

// 需要认证的路由
router.post('/post/:postId', protect, createComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;