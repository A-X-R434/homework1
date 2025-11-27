const Project = require('../models/Project');
const { CustomError } = require('../middleware/errorHandler');

/**
 * 获取所有项目
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const getProjects = async (req, res, next) => {
  try {
    // 查询所有项目，并填充作者信息
    const projects = await Project.find({}).populate('author', 'username');
    
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取单个项目
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const getProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 查询项目并填充作者信息
    const project = await Project.findById(id).populate('author', 'username');
    
    if (!project) {
      return next(new CustomError(404, `找不到ID为 ${id} 的项目`));
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    // 处理无效的MongoDB ID
    if (error.name === 'CastError') {
      return next(new CustomError(404, `找不到ID为 ${req.params.id} 的项目`));
    }
    next(error);
  }
};

/**
 * 创建新项目
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const createProject = async (req, res, next) => {
  try {
    // 从请求体获取数据
    const projectData = req.body;
    
    // 设置作者为当前登录用户
    projectData.user = req.user._id;
    
    // 创建项目
    const project = await Project.create(projectData);
    
    // 填充作者信息后返回
    const populatedProject = await project.populate('author', 'username');
    
    res.status(201).json({
      success: true,
      data: populatedProject
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新项目
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const projectData = req.body;
    
    // 查询项目
    let project = await Project.findById(id);
    
    if (!project) {
      return next(new CustomError(404, `找不到ID为 ${id} 的项目`));
    }
    
    // 检查是否为项目创建者
    if (project.user.toString() !== req.user._id.toString()) {
      return next(new CustomError(403, '没有权限修改此项目'));
    }
    
    // 更新项目
    project = await Project.findByIdAndUpdate(id, projectData, {
      new: true, // 返回更新后的数据
      runValidators: true // 运行验证器
    });
    
    // 填充作者信息后返回
    const populatedProject = await project.populate('author', 'username');
    
    res.status(200).json({
      success: true,
      data: populatedProject
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new CustomError(404, `找不到ID为 ${req.params.id} 的项目`));
    }
    next(error);
  }
};

/**
 * 删除项目
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 查询项目
    const project = await Project.findById(id);
    
    if (!project) {
      return next(new CustomError(404, `找不到ID为 ${id} 的项目`));
    }
    
    // 检查是否为项目创建者
    if (project.user.toString() !== req.user._id.toString()) {
      return next(new CustomError(403, '没有权限删除此项目'));
    }
    
    // 删除项目
    await project.deleteOne();
    
    res.status(200).json({
      success: true,
      message: '项目已成功删除'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new CustomError(404, `找不到ID为 ${req.params.id} 的项目`));
    }
    next(error);
  }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };