import api from './axiosConfig';

// 获取所有项目
export const getAllProjects = async () => {
  return await api.get('/api/projects');
};

// 获取单个项目详情
export const getProjectById = async (id) => {
  return await api.get(`/api/projects/${id}`);
};

// 创建新项目
export const createProject = async (projectData) => {
  return await api.post('/api/projects', projectData);
};

// 更新项目
export const updateProject = async (id, projectData) => {
  return await api.put(`/api/projects/${id}`, projectData);
};

// 删除项目
export const deleteProject = async (id) => {
  return await api.delete(`/api/projects/${id}`);
};

export default {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};