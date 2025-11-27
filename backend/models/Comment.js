const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: [true, '评论内容是必填项'],
    trim: true,
    minlength: [1, '评论内容不能为空']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '评论必须关联到作者']
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogPost',
    required: [true, '评论必须关联到博客文章']
  }
}, {
  timestamps: true // 自动创建createdAt和updatedAt字段
});

// 评论创建后更新博客的评论数
CommentSchema.post('save', async function(doc, next) {
  try {
    // 更新关联的博客文章的评论数
    await mongoose.model('BlogPost').findByIdAndUpdate(
      doc.post,
      { $inc: { commentCount: 1 } },
      { new: true, useFindAndModify: false }
    );
    next();
  } catch (error) {
    next(error);
  }
});

// 评论删除后更新博客的评论数
CommentSchema.post('remove', async function(doc, next) {
  try {
    // 更新关联的博客文章的评论数
    await mongoose.model('BlogPost').findByIdAndUpdate(
      doc.post,
      { $inc: { commentCount: -1 } },
      { new: true, useFindAndModify: false }
    );
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Comment', CommentSchema);