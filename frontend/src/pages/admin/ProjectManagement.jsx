import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import { getProjects, createProject, updateProject, deleteProject } from '../../api/projectApi';
import '../../styles/admin/ProjectManagement.css';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    repoUrl: '',
    liveUrl: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  // 获取项目列表
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getProjects();
      setProjects(response.data);
    } catch (err) {
      setError(err);
      console.error('获取项目列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 处理表单输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 表单验证
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '请输入项目标题';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = '请输入项目描述';
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理创建项目
  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      await createProject(formData);
      
      // 重置表单
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        repoUrl: '',
        liveUrl: ''
      });
      
      setShowCreateForm(false);
      fetchProjects();
    } catch (err) {
      console.error('创建项目失败:', err);
      alert('创建项目失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 开始编辑项目
  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl || '',
      repoUrl: project.repoUrl || '',
      liveUrl: project.liveUrl || ''
    });
  };

  // 处理更新项目
  const handleUpdateProject = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      await updateProject(editingProject._id, formData);
      
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        repoUrl: '',
        liveUrl: ''
      });
      
      fetchProjects();
    } catch (err) {
      console.error('更新项目失败:', err);
      alert('更新项目失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 处理删除项目
  const handleDelete = async (projectId) => {
    if (window.confirm('确定要删除这个项目吗？')) {
      try {
        await deleteProject(projectId);
        fetchProjects();
      } catch (err) {
        console.error('删除项目失败:', err);
        alert('删除项目失败，请重试');
      }
    }
  };

  if (loading) {
    return <Loading message="加载项目列表中..." />;
  }

  if (error) {
    return (
      <Error 
        error={error} 
        onRetry={fetchProjects} 
      />
    );
  }

  return (
    <div className="project-management">
      <div className="page-header">
        <h1>项目管理</h1>
        <button 
          className="create-btn" 
          onClick={() => {
            setShowCreateForm(true);
            setEditingProject(null);
          }}
        >
          创建新项目
        </button>
      </div>

      {/* 创建/编辑表单 */}
      {(showCreateForm || editingProject) && (
        <div className="project-form-container">
          <form 
            onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
            className="project-form"
          >
            <h2>{editingProject ? '编辑项目' : '创建新项目'}</h2>
            
            <div className="form-group">
              <label htmlFor="title">项目标题 *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="请输入项目标题"
                disabled={submitting}
              />
              {formErrors.title && <span className="error">{formErrors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">项目描述 *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="请输入项目描述"
                rows={4}
                disabled={submitting}
              />
              {formErrors.description && <span className="error">{formErrors.description}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="imageUrl">项目图片URL（可选）</label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="请输入项目图片URL"
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="repoUrl">代码仓库URL（可选）</label>
              <input
                type="text"
                id="repoUrl"
                name="repoUrl"
                value={formData.repoUrl}
                onChange={handleChange}
                placeholder="请输入GitHub等代码仓库URL"
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="liveUrl">在线演示URL（可选）</label>
              <input
                type="text"
                id="liveUrl"
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleChange}
                placeholder="请输入项目在线演示URL"
                disabled={submitting}
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? '提交中...' : (editingProject ? '更新项目' : '创建项目')}
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingProject(null);
                  setFormData({
                    title: '',
                    description: '',
                    imageUrl: '',
                    repoUrl: '',
                    liveUrl: ''
                  });
                  setFormErrors({});
                }}
                disabled={submitting}
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 项目列表 */}
      <div className="project-list">
        <h2>项目列表</h2>
        {projects.length === 0 ? (
          <p className="no-projects">暂无项目，请创建新项目</p>
        ) : (
          <div className="projects-grid">
            {projects.map(project => (
              <div key={project._id} className="project-card">
                <h3>{project.title}</h3>
                <p className="description">{project.description}</p>
                
                <div className="project-links">
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                      代码仓库
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      在线演示
                    </a>
                  )}
                </div>
                
                <div className="project-actions">
                  <button 
                    className="edit-btn" 
                    onClick={() => handleEdit(project)}
                  >
                    编辑
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDelete(project._id)}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManagement;