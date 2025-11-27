const express = require('express');
const router = express.Router();
const { getBlogPosts, getBlogPost, createBlogPost, updateBlogPost, deleteBlogPost } = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

// 公开路由
router.get('/', getBlogPosts);
router.get('/:id', getBlogPost);

// 需要认证的路由
router.post('/', protect, createBlogPost);
router.put('/:id', protect, updateBlogPost);
router.delete('/:id', protect, deleteBlogPost);

module.exports = router;