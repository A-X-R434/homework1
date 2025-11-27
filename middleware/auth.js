const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({
        status: 'error',
        message: '认证失败，请重新登录'
      });
    }
  }

  if (!token) {
    res.status(401).json({
      status: 'error',
      message: '认证失败，未提供token'
    });
  }
};

module.exports = { protect };