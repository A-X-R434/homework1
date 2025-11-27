import React, { useState, useEffect } from 'react';
import { projectAPI } from '../../services/api';
import { FaPlus, FaTimes, FaEdit, FaTrashAlt } from 'react-icons/fa';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'active',
    deadline: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch projects list
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectAPI.getAllProjects();
        // 从响应对象中提取data属性，因为后端返回的格式是{success: true, count: x, data: [...projects]}
        setProjects(response.data || []);
      } catch (err) {
        setError('Failed to fetch projects list');
        console.error('Fetch projects error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle create project form submission
  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    if (!newProject.name || !newProject.description) {
      setError('Please enter project name and description');
      return;
    }

    try {
      setLoading(true);
      const response = await projectAPI.createProject(newProject);
      // 从响应对象中提取data属性，因为后端返回的格式是{success: true, data: project}
      const createdProject = response.data;
      setProjects([createdProject, ...projects]);
      setNewProject({ name: '', description: '', status: 'active', deadline: '' });
      setShowCreateForm(false);
      setError('');
    } catch (err) {
      setError('Failed to create project');
      console.error('Create project error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit project
  const handleEditProject = async (id) => {
    try {
      setLoading(true);
      // 这里可以实现编辑功能，例如打开编辑表单
      console.log('Edit project:', id);
    } catch (err) {
      setError('Failed to edit project');
      console.error('Edit project error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete project
  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        setLoading(true);
        await projectAPI.deleteProject(id);
        setProjects(projects.filter(project => project.id !== id));
      } catch (err) {
        setError('Failed to delete project');
        console.error('Delete project error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Project Management</h1>
        <button 
          className="create-project-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? (
            <>
              <FaTimes /> Cancel
            </>
          ) : (
            <>
              <FaPlus /> Create New Project
            </>
          )}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {showCreateForm && (
        <div className="create-project-form">
          <h2>Create New Project</h2>
          <form onSubmit={handleCreateProject}>
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Project Description</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                rows="4"
                required
              />
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input
                type="date"
                value={newProject.deadline}
                onChange={(e) => setNewProject({...newProject, deadline: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Project Status</label>
              <select
                value={newProject.status}
                onChange={(e) => setNewProject({...newProject, status: e.target.value})}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Save Project'}
            </button>
          </form>
        </div>
      )}

      <div className="projects-list">
          <h2>Projects List</h2>
          {loading && projects.length === 0 ? (
            <div className="loading">Loading...</div>
          ) : projects.length === 0 ? (
            <p className="no-projects">No projects available</p>
          ) : (
            <div className="projects-grid">
              {projects.map(project => (
              <div key={project.id} className={`project-card project-${project.status}`}>
                  <div className="project-header">
                    <h3>{project.name || project.title}</h3>
                  <span className={`status-badge status-${project.status}`}>
                    {project.status === 'active' ? 'Active' : 
                     project.status === 'completed' ? 'Completed' : 'Archived'}
                  </span>
                </div>
                <p>{project.description}</p>
                <div className="project-meta">
                  <span>创建于: {project.createdAt}</span>
                  <span>更新于: {project.updatedAt}</span>
                </div>
                <div className="project-actions">
                    <button>
                      <FaTasks /> View Details
                    </button>
                    <button onClick={() => handleEditProject(project.id)}>
                      <FaEdit /> Edit
                    </button>
                    <button onClick={() => handleDeleteProject(project.id)}>
                      <FaTrashAlt /> Delete
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

export default Projects;