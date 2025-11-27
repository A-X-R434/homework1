const User = require('../models/User');
const generateToken = require('../utils/tokenGenerator');
const { CustomError } = require('../middleware/errorHandler');

/**
 * 用户注册
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    // 验证请求数据
    if (!username || !email || !password) {
      return next(new CustomError(400, '所有字段都是必填项'));
    }
    
    // 检查用户名是否已存在
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return next(new CustomError(400, '用户名已被使用'));
    }
    
    // 检查邮箱是否已存在
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return next(new CustomError(400, '邮箱已被注册'));
    }
    
    // 创建新用户
    const user = await User.create({
      username,
      email,
      password
    });
    
    // 生成token
    const token = generateToken(user._id);
    
    // 返回成功响应
    res.status(201).json({
      success: true,
      user,
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 用户登录
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // 验证请求数据
    if (!email || !password) {
      return next(new CustomError(400, '邮箱和密码都是必填项'));
    }
    
    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return next(new CustomError(401, '用户不存在或密码错误'));
    }
    
    // 验证密码
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new CustomError(401, '用户不存在或密码错误'));
    }
    
    // 生成token
    const token = generateToken(user._id);
    
    // 返回成功响应
    res.status(200).json({
      success: true,
      user,
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取当前登录用户信息
 * @param {Object} req - 请求对象（已通过认证中间件）
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const getMe = async (req, res, next) => {
  try {
    // req.user 已在认证中间件中设置
    const user = req.user;
    
    if (!user) {
      return next(new CustomError(404, '未找到用户信息'));
    }
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getMe };