import api from './axiosConfig';

// 用户注册
export const registerUser = async (userData) => {
  return await api.post('/api/users/register', userData);
};

// 用户登录
export const loginUser = async (credentials) => {
  return await api.post('/api/users/login', credentials);
};

export default {
  registerUser,
  loginUser
};