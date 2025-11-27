const Project = require('../models/Project');

// @desc    获取所有项目
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).populate('user', 'username');
    res.status(200).json({
      status: 'success',
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    获取单个项目
// @route   GET /api/projects/:id
// @access  Public
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('user', 'username');
    
    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: '项目不存在'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    创建项目
// @route   POST /api/projects
// @access  Protected
const createProject = async (req, res) => {
  try {
    const { title, description, imageUrl, repoUrl, liveUrl } = req.body;
    
    const project = await Project.create({
      title,
      description,
      imageUrl,
      repoUrl,
      liveUrl,
      user: req.user._id
    });
    
    res.status(201).json({
      status: 'success',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    更新项目
// @route   PUT /api/projects/:id
// @access  Protected
const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: '项目不存在'
      });
    }
    
    // 检查是否是项目创建者
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        status: 'error',
        message: '没有权限修改此项目'
      });
    }
    
    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      status: 'success',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    删除项目
// @route   DELETE /api/projects/:id
// @access  Protected
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: '项目不存在'
      });
    }
    
    // 检查是否是项目创建者
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        status: 'error',
        message: '没有权限删除此项目'
      });
    }
    
    await project.deleteOne();
    
    res.status(200).json({
      status: 'success',
      message: '项目已删除'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};