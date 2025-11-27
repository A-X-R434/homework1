import api from './axiosConfig';

// 用户注册
export const registerUser = async (userData) => {
  return await api.post('/users/register', userData);
};

// 用户登录
export const loginUser = async (credentials) => {
  return await api.post('/users/login', credentials);
};

export default {
  registerUser,
  loginUser
};