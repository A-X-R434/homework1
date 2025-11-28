# 项目部署文档

## GitHub 仓库信息

- **GitHub 用户名**: `A-X-R434`
- **仓库名**: `homework1`
- **远程仓库 URL**: `https://github.com/A-X-R434/homework1.git`
- **主要分支**: main

## 错误消息解释

`net::ERR_ABORTED https://github.com/A-X-R434/homework1/hovercards/citation/sidebar_partial?tree_name=main` 错误说明：

- 这是 GitHub 界面上的一个资源加载错误，通常不会影响仓库的基本功能
- 这属于 GitHub 平台的内部资源加载问题，与您的代码或部署无关
- 此错误不会影响代码的推送、拉取或网站的实际部署

## GitHub 部署指南

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

## 通过 GitHub Pages 部署和访问网页

要使您的项目可以通过网页浏览器访问，需要通过 GitHub Pages 进行部署。以下是详细步骤：

### 1. 准备前端构建文件

1. 进入前端目录并构建项目：
   ```cmd
   cd frontend
   npm install
   npm run build
   ```

2. 确保构建输出在 `frontend/dist` 目录中

### 2. 配置 GitHub Pages

1. 访问您的 GitHub 仓库页面：https://github.com/A-X-R434/homework1
2. 点击顶部导航栏中的 "Settings"（设置）选项
3. 在左侧菜单中找到并点击 "Pages"
4. 在 "Build and deployment" 部分：
   - **Source**（来源）选择 "Deploy from a branch"（从分支部署）
   - **Branch**（分支）选择您要部署的分支（通常是 "main"）
   - **Folder**（文件夹）选择 "frontend/dist" 作为前端构建输出目录
5. 点击 "Save"（保存）按钮

## 访问部署的网页

配置完成后，GitHub Pages 会自动部署您的项目。部署完成后，您可以通过以下地址访问：

```
https://A-X-R434.github.io/homework1
```

注意：部署可能需要几分钟时间完成。您可以在 GitHub Pages 设置页面查看部署状态和访问链接。

## 本地运行指南

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

## 项目结构

- **后端**: 提供 API 服务和数据处理
- **前端**: React 单页应用
- **数据库模型**: MongoDB 数据结构定义
- **API 路由**: RESTful API 接口定义

## 注意事项

- 请确保已配置好 `.env` 文件（参考 `.env.example`）
- 项目需要 MongoDB 数据库支持
- 前端构建文件位于 `frontend/dist` 目录

## 环境配置说明

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
2. **GitHub Pages 部署失败**
   - 检查您的项目是否有有效的 index.html 文件
   - 确认选择了正确的分支和文件夹
   - 查看部署日志以获取详细错误信息
3. **数据库连接问题**：检查 MongoDB 服务是否已启动
4. **端口占用**：如端口 5000 被占用，可在 `.env` 文件中修改 PORT 值
5. **依赖安装失败**
   - 检查 Node.js 版本
   - 尝试清理 npm 缓存：`npm cache clean --force`
   - 重新安装依赖

祝您部署顺利！