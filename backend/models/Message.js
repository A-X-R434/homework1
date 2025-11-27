const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '姓名是必填项'],
    trim: true,
    minlength: [1, '姓名不能为空']
  },
  email: {
    type: String,
    required: [true, '邮箱是必填项'],
    trim: true,
    lowercase: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      '请输入有效的邮箱地址'
    ]
  },
  message: {
    type: String,
    required: [true, '留言内容是必填项'],
    trim: true,
    minlength: [5, '留言内容至少需要5个字符']
  },
  // 可以添加状态字段，标记留言是否已处理
  status: {
    type: String,
    enum: ['unread', 'read', 'responded'],
    default: 'unread'
  }
}, {
  timestamps: true // 自动创建createdAt和updatedAt字段
});

module.exports = mongoose.model('Message', MessageSchema);