const Message = require('../models/Message');

// @desc    接收联系留言
// @route   POST /api/contact
// @access  Public
const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    const newMessage = await Message.create({
      name,
      email,
      message
    });
    
    res.status(201).json({
      status: 'success',
      message: '留言已成功发送',
      data: newMessage
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = { createMessage };