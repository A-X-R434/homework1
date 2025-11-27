import api from './axiosConfig';

// 获取所有博客
export const getBlogPosts = async () => {
  return await api.get('/blog');
};

// 获取单个博客
export const getBlogPost = async (id) => {
  return await api.get(`/blog/${id}`);
};

// 创建博客
export const createBlogPost = async (blogData) => {
  return await api.post('/blog', blogData);
};

// 更新博客
export const updateBlogPost = async (id, blogData) => {
  return await api.put(`/blog/${id}`, blogData);
};

// 删除博客
export const deleteBlogPost = async (id) => {
  return await api.delete(`/blog/${id}`);
};

// 获取博客评论
export const getBlogComments = async (postId) => {
  return await api.get(`/blog/${postId}/comments`);
};

// 创建评论
export const createComment = async (postId, commentData) => {
  return await api.post(`/blog/${postId}/comments`, commentData);
};

export default {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogComments,
  createComment
};