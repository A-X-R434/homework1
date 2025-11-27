const Comment = require('../models/Comment');
const BlogPost = require('../models/BlogPost');

// @desc    获取博客的所有评论
// @route   GET /api/blog/:postId/comments
// @access  Public
const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    
    // 检查博客是否存在
    const blogPost = await BlogPost.findById(postId);
    if (!blogPost) {
      return res.status(404).json({
        status: 'error',
        message: '博客不存在'
      });
    }
    
    const comments = await Comment.find({ post: postId })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      count: comments.length,
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    创建评论
// @route   POST /api/blog/:postId/comments
// @access  Protected
const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { body } = req.body;
    
    // 检查博客是否存在
    const blogPost = await BlogPost.findById(postId);
    if (!blogPost) {
      return res.status(404).json({
        status: 'error',
        message: '博客不存在'
      });
    }
    
    const comment = await Comment.create({
      body,
      author: req.user._id,
      post: postId
    });
    
    // 填充作者信息
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username');
    
    res.status(201).json({
      status: 'success',
      data: populatedComment
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getComments,
  createComment
};