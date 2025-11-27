import api from './axiosConfig';

// 发送消息
export const sendMessage = async (messageData) => {
  return await api.post('/api/messages', messageData);
};

export default {
  sendMessage
};