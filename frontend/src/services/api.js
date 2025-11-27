// API基础URL
const API_BASE_URL = 'http://localhost:5000/api';

// 通用请求函数
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // 获取存储的token
  const token = localStorage.getItem('token');
  
  // 默认选项
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  // 如果有token，添加到请求头
  if (token) {
    defaultOptions.headers['Authorization'] = `Bearer ${token}`;
  }
  
  // 合并选项
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, mergedOptions);
    
    // 检查响应状态
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `请求失败: ${response.status}`);
    }
    
    // 处理空响应
    if (response.status === 204) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
};

// 认证相关API
export const authAPI = {
  // 登录
  login: async (credentials) => {
    return request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  // 注册
  register: async (userData) => {
    return request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  // 获取当前用户信息
  getCurrentUser: async () => {
    return request('/users/me');
  },
};

// 项目相关API
export const projectAPI = {
  // 获取所有项目
  getAllProjects: async () => {
    return request('/projects');
  },
  
  // 创建新项目
  createProject: async (projectData) => {
    return request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },
  
  // 获取单个项目
  getProject: async (projectId) => {
    return request(`/projects/${projectId}`);
  },
  
  // 更新项目
  updateProject: async (projectId, projectData) => {
    return request(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  },
  
  // 删除项目
  deleteProject: async (projectId) => {
    return request(`/projects/${projectId}`, {
      method: 'DELETE',
    });
  },
};

// 博客相关API
export const blogAPI = {
  // 获取所有博客文章
  getAllPosts: async () => {
    return request('/blogs');
  },
  
  // 创建新文章
  createPost: async (postData) => {
    return request('/blogs', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },
  
  // 获取单个文章
  getPost: async (postId) => {
    return request(`/blogs/${postId}`);
  },
  
  // 更新文章
  updatePost: async (postId, postData) => {
    return request(`/blogs/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  },
  
  // 删除文章
  deletePost: async (postId) => {
    return request(`/blogs/${postId}`, {
      method: 'DELETE',
    });
  },
};

// 添加其他可能需要的API模块
export const commentAPI = {
  // 获取所有评论
  getAllComments: async () => {
    return request('/comments');
  },
  
  // 创建新评论
  createComment: async (commentData) => {
    return request('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  },
  
  // 获取单个评论
  getComment: async (commentId) => {
    return request(`/comments/${commentId}`);
  },
  
  // 更新评论
  updateComment: async (commentId, commentData) => {
    return request(`/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify(commentData),
    });
  },
  
  // 删除评论
  deleteComment: async (commentId) => {
    return request(`/comments/${commentId}`, {
      method: 'DELETE',
    });
  },
};

export const messageAPI = {
  // 获取所有消息
  getAllMessages: async () => {
    return request('/messages');
  },
  
  // 创建新消息
  createMessage: async (messageData) => {
    return request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },
  
  // 获取单个消息
  getMessage: async (messageId) => {
    return request(`/messages/${messageId}`);
  },
  
  // 更新消息
  updateMessage: async (messageId, messageData) => {
    return request(`/messages/${messageId}`, {
      method: 'PUT',
      body: JSON.stringify(messageData),
    });
  },
  
  // 删除消息
  deleteMessage: async (messageId) => {
    return request(`/messages/${messageId}`, {
      method: 'DELETE',
    });
  },
};

export default { authAPI, projectAPI, blogAPI, commentAPI, messageAPI };