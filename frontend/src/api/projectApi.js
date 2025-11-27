import api from './axiosConfig';

// 获取所有项目
export const getProjects = async () => {
  return await api.get('/projects');
};

// 获取单个项目
export const getProject = async (id) => {
  return await api.get(`/projects/${id}`);
};

// 创建项目
export const createProject = async (projectData) => {
  return await api.post('/projects', projectData);
};

// 更新项目
export const updateProject = async (id, projectData) => {
  return await api.put(`/projects/${id}`, projectData);
};

// 删除项目
export const deleteProject = async (id) => {
  return await api.delete(`/projects/${id}`);
};

export default {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};