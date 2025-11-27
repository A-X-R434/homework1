import api from './axiosConfig';

// 发送联系留言
export const sendMessage = async (messageData) => {
  return await api.post('/contact', messageData);
};

export default {
  sendMessage
};