# 项目部署指南

## GitHub 部署指南

### 项目信息
- **GitHub 用户名**: `A-X-R434`
- **仓库名**: `homework1`
- **远程仓库 URL**: `https://github.com/A-X-R434/homework1.git`

### 部署步骤

由于网络环境限制，自动化部署无法直接推送到 GitHub，请按照以下步骤手动完成部署：

1. **打开命令提示符（CMD）**

2. **切换到项目目录**
   ```cmd
   cd C:\Users\anxir\Documents\trae_projects\homework
   ```

3. **检查 Git 状态**
   ```cmd
   git status
   ```

4. **推送到 GitHub**（执行此命令会自动打开浏览器进行 GitHub 认证）
   ```cmd
   git push -u origin main
   ```

5. **完成 GitHub 认证**
   浏览器打开后，按照提示登录 GitHub 账号并授权访问您的仓库。

6. **验证部署**
   认证成功后，代码将自动上传到 GitHub。您可以访问 `https://github.com/A-X-R434/homework1` 验证代码是否成功部署。

### 本地运行指南

部署完成后，您可以在本地运行项目：

1. **安装依赖**
   ```cmd
   npm install
   ```

2. **启动服务器**
   ```cmd
   start_production.bat
   ```

3. **访问应用**
   打开浏览器访问 `http://localhost:5000`

### 项目结构

- **后端**: 提供 API 服务和数据处理
- **前端**: React 单页应用
- **数据库模型**: MongoDB 数据结构定义
- **API 路由**: RESTful API 接口定义

### 注意事项

- 请确保已配置好 `.env` 文件（参考 `.env.example`）
- 项目需要 MongoDB 数据库支持
- 前端构建文件位于 `frontend/dist` 目录

### 环境配置说明

如需在本地开发或自定义配置，请参考以下步骤：

1. **配置环境变量**
   复制 `.env.example` 文件创建 `.env` 文件：
   ```cmd
   cd backend
   copy .env.example .env
   ```

2. **编辑 `.env` 文件**，设置关键配置：
   ```
   # 服务器配置
   PORT=5000
   
   # MongoDB连接URI
   MONGO_URI=mongodb://localhost:27017/portfolio
   
   # JWT密钥
   JWT_SECRET=your_secure_jwt_secret_key_please_change
   
   # 前端URL
   FRONTEND_URL=http://localhost:5000
   ```

3. **如需重新构建前端**：
   ```cmd
   cd frontend
   npm install
   npm run build
   ```

## 故障排除

如果在部署或运行过程中遇到问题：

1. **Git 认证失败**：确保已登录 GitHub 并授权访问
2. **数据库连接问题**：检查 MongoDB 服务是否已启动
3. **端口占用**：如端口 5000 被占用，可在 `.env` 文件中修改 PORT 值

祝您部署顺利！