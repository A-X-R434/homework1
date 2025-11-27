const BlogPost = require('../models/BlogPost');
const { CustomError } = require('../middleware/errorHandler');

/**
 * 获取所有博客文章
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const getBlogPosts = async (req, res, next) => {
  try {
    // 查询所有博客文章，按创建时间倒序排列，并填充作者信息
    const blogPosts = await BlogPost.find({})
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: blogPosts.length,
      data: blogPosts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取单个博客文章
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const getBlogPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 查询博客文章并填充作者信息
    const blogPost = await BlogPost.findById(id).populate('author', 'username');
    
    if (!blogPost) {
      return next(new CustomError(404, `找不到ID为 ${id} 的博客文章`));
    }
    
    res.status(200).json({
      success: true,
      data: blogPost
    });
  } catch (error) {
    // 处理无效的MongoDB ID
    if (error.name === 'CastError') {
      return next(new CustomError(404, `找不到ID为 ${req.params.id} 的博客文章`));
    }
    next(error);
  }
};

/**
 * 创建新博客文章
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const createBlogPost = async (req, res, next) => {
  try {
    // 从请求体获取数据
    const { title, content, tags } = req.body;
    
    // 创建博客文章，设置作者为当前登录用户
    const blogPost = await BlogPost.create({
      title,
      content,
      tags: tags || [],
      author: req.user._id
    });
    
    // 填充作者信息后返回
    const populatedBlogPost = await blogPost.populate('author', 'username');
    
    res.status(201).json({
      success: true,
      data: populatedBlogPost
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新博客文章
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const updateBlogPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    
    // 查询博客文章
    let blogPost = await BlogPost.findById(id);
    
    if (!blogPost) {
      return next(new CustomError(404, `找不到ID为 ${id} 的博客文章`));
    }
    
    // 检查是否为文章作者
    if (blogPost.author.toString() !== req.user._id.toString()) {
      return next(new CustomError(403, '没有权限修改此博客文章'));
    }
    
    // 更新博客文章
    blogPost = await BlogPost.findByIdAndUpdate(
      id, 
      { title, content, tags: tags || [] }, 
      {
        new: true, // 返回更新后的数据
        runValidators: true // 运行验证器
      }
    );
    
    // 填充作者信息后返回
    const populatedBlogPost = await blogPost.populate('author', 'username');
    
    res.status(200).json({
      success: true,
      data: populatedBlogPost
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new CustomError(404, `找不到ID为 ${req.params.id} 的博客文章`));
    }
    next(error);
  }
};

/**
 * 删除博客文章
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const deleteBlogPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 查询博客文章
    const blogPost = await BlogPost.findById(id);
    
    if (!blogPost) {
      return next(new CustomError(404, `找不到ID为 ${id} 的博客文章`));
    }
    
    // 检查是否为文章作者
    if (blogPost.author.toString() !== req.user._id.toString()) {
      return next(new CustomError(403, '没有权限删除此博客文章'));
    }
    
    // 删除博客文章
    await blogPost.deleteOne();
    
    res.status(200).json({
      success: true,
      message: '博客文章已成功删除'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new CustomError(404, `找不到ID为 ${req.params.id} 的博客文章`));
    }
    next(error);
  }
};

module.exports = { getBlogPosts, getBlogPost, createBlogPost, updateBlogPost, deleteBlogPost };