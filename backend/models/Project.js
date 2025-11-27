const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '项目标题是必填项'],
    trim: true,
    minlength: [3, '项目标题至少需要3个字符']
  },
  description: {
    type: String,
    required: [true, '项目描述是必填项'],
    trim: true,
    minlength: [10, '项目描述至少需要10个字符']
  },
  imageUrl: {
    type: String,
    trim: true,
    default: ''
  },
  repoUrl: {
    type: String,
    trim: true,
    default: ''
  },
  liveUrl: {
    type: String,
    trim: true,
    default: ''
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '项目必须关联到用户']
  }
}, {
  timestamps: true // 自动创建createdAt和updatedAt字段
});

// 虚拟字段 - 获取完整的用户信息
ProjectSchema.virtual('author', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true
});

// 确保虚拟字段在转换为JSON时包含
ProjectSchema.set('toJSON', { virtuals: true });
ProjectSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Project', ProjectSchema);