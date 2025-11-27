const Comment = require('../models/Comment');
const BlogPost = require('../models/BlogPost');
const { CustomError } = require('../middleware/errorHandler');

/**
 * 获取特定博客文章的所有评论
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const getCommentsByPostId = async (req, res, next) => {
  try {
    const { postId } = req.params;
    
    // 验证博客文章是否存在
    const blogPost = await BlogPost.findById(postId);
    if (!blogPost) {
      return next(new CustomError(404, `找不到ID为 ${postId} 的博客文章`));
    }
    
    // 查询该文章的所有评论，按创建时间排序，并填充作者信息
    const comments = await Comment.find({ post: postId })
      .populate('author', 'username')
      .sort({ createdAt: 1 });
    
    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    // 处理无效的MongoDB ID
    if (error.name === 'CastError') {
      return next(new CustomError(404, `找不到ID为 ${req.params.postId} 的博客文章`));
    }
    next(error);
  }
};

/**
 * 创建新评论
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { body } = req.body;
    
    // 验证博客文章是否存在
    const blogPost = await BlogPost.findById(postId);
    if (!blogPost) {
      return next(new CustomError(404, `找不到ID为 ${postId} 的博客文章`));
    }
    
    // 创建评论
    const comment = await Comment.create({
      body,
      author: req.user._id,
      post: postId
    });
    
    // 填充作者信息后返回
    const populatedComment = await comment.populate('author', 'username');
    
    res.status(201).json({
      success: true,
      data: populatedComment
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new CustomError(404, `找不到ID为 ${req.params.postId} 的博客文章`));
    }
    next(error);
  }
};

/**
 * 删除评论
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 查询评论
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return next(new CustomError(404, `找不到ID为 ${id} 的评论`));
    }
    
    // 检查是否为评论作者
    if (comment.author.toString() !== req.user._id.toString()) {
      return next(new CustomError(403, '没有权限删除此评论'));
    }
    
    // 删除评论
    await comment.deleteOne();
    
    res.status(200).json({
      success: true,
      message: '评论已成功删除'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new CustomError(404, `找不到ID为 ${req.params.id} 的评论`));
    }
    next(error);
  }
};

module.exports = { getCommentsByPostId, createComment, deleteComment };