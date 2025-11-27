const Message = require('../models/Message');
const { CustomError } = require('../middleware/errorHandler');

/**
 * 获取所有留言（仅管理员）
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const getMessages = async (req, res, next) => {
  try {
    // 查询所有留言，按创建时间倒序排列
    const messages = await Message.find({})
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取单个留言详情
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const getMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 查询留言
    const message = await Message.findById(id);
    
    if (!message) {
      return next(new CustomError(404, `找不到ID为 ${id} 的留言`));
    }
    
    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    // 处理无效的MongoDB ID
    if (error.name === 'CastError') {
      return next(new CustomError(404, `找不到ID为 ${req.params.id} 的留言`));
    }
    next(error);
  }
};

/**
 * 创建新留言
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const createMessage = async (req, res, next) => {
  try {
    // 从请求体获取数据
    const { name, email, subject, message } = req.body;
    
    // 创建留言
    const newMessage = await Message.create({
      name,
      email,
      subject,
      message
    });
    
    res.status(201).json({
      success: true,
      message: '留言成功提交！',
      data: newMessage
    });
  } catch (error) {
    // 处理验证错误
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return next(new CustomError(400, messages.join(', ')));
    }
    next(error);
  }
};

/**
 * 更新留言状态
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const updateMessageStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // 验证状态值
    if (!['pending', 'read', 'replied'].includes(status)) {
      return next(new CustomError(400, '无效的状态值，状态必须是 pending、read 或 replied 之一'));
    }
    
    // 更新留言状态
    const message = await Message.findByIdAndUpdate(
      id,
      { status },
      {
        new: true, // 返回更新后的数据
        runValidators: true // 运行验证器
      }
    );
    
    if (!message) {
      return next(new CustomError(404, `找不到ID为 ${id} 的留言`));
    }
    
    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new CustomError(404, `找不到ID为 ${req.params.id} 的留言`));
    }
    next(error);
  }
};

/**
 * 删除留言
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 查询留言
    const message = await Message.findById(id);
    
    if (!message) {
      return next(new CustomError(404, `找不到ID为 ${id} 的留言`));
    }
    
    // 删除留言
    await message.deleteOne();
    
    res.status(200).json({
      success: true,
      message: '留言已成功删除'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new CustomError(404, `找不到ID为 ${req.params.id} 的留言`));
    }
    next(error);
  }
};

module.exports = { getMessages, getMessage, createMessage, updateMessageStatus, deleteMessage };