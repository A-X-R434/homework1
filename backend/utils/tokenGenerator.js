const jwt = require('jsonwebtoken');

/**
 * 生成JWT Token
 * @param {string} userId - 用户ID
 * @returns {string} - 生成的JWT token
 */
const generateToken = (userId) => {
  // 检查必要的环境变量是否存在
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET 环境变量未设置');
  }
  
  // 创建payload，包含用户ID
  const payload = {
    id: userId
  };
  
  // 生成token，设置过期时间为30天
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d' // 30天后过期
  });
  
  return token;
};

module.exports = generateToken;