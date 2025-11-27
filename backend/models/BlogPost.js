const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '博客标题是必填项'],
    trim: true,
    minlength: [5, '博客标题至少需要5个字符']
  },
  content: {
    type: String,
    required: [true, '博客内容是必填项'],
    trim: true,
    minlength: [50, '博客内容至少需要50个字符']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '博客必须关联到作者']
  },
  // 可以添加标签、分类等额外字段
  tags: {
    type: [String],
    default: []
  },
  // 记录评论数
  commentCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // 自动创建createdAt和updatedAt字段
});

// 虚拟字段 - 自动计算评论数
BlogPostSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post'
});

// 确保虚拟字段在转换为JSON时包含
BlogPostSchema.set('toJSON', { virtuals: true });
BlogPostSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('BlogPost', BlogPostSchema);