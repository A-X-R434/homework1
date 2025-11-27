const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');

// @desc    获取所有博客
// @route   GET /api/blog
// @access  Public
const getBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find({})
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      count: blogPosts.length,
      data: blogPosts
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    获取单个博客
// @route   GET /api/blog/:id
// @access  Public
const getBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id)
      .populate('author', 'username');
    
    if (!blogPost) {
      return res.status(404).json({
        status: 'error',
        message: '博客不存在'
      });
    }
    
    // 获取博客评论
    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      data: {
        blogPost,
        comments
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    创建博客
// @route   POST /api/blog
// @access  Protected
const createBlogPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    const blogPost = await BlogPost.create({
      title,
      content,
      author: req.user._id
    });
    
    res.status(201).json({
      status: 'success',
      data: blogPost
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    更新博客
// @route   PUT /api/blog/:id
// @access  Protected
const updateBlogPost = async (req, res) => {
  try {
    let blogPost = await BlogPost.findById(req.params.id);
    
    if (!blogPost) {
      return res.status(404).json({
        status: 'error',
        message: '博客不存在'
      });
    }
    
    // 检查是否是博客作者
    if (blogPost.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        status: 'error',
        message: '没有权限修改此博客'
      });
    }
    
    blogPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      status: 'success',
      data: blogPost
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    删除博客
// @route   DELETE /api/blog/:id
// @access  Protected
const deleteBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    
    if (!blogPost) {
      return res.status(404).json({
        status: 'error',
        message: '博客不存在'
      });
    }
    
    // 检查是否是博客作者
    if (blogPost.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        status: 'error',
        message: '没有权限删除此博客'
      });
    }
    
    // 先删除相关评论
    await Comment.deleteMany({ post: req.params.id });
    
    // 删除博客
    await blogPost.deleteOne();
    
    res.status(200).json({
      status: 'success',
      message: '博客已删除'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
};