# 项目部署指南

## 环境要求

在部署项目前，请确保目标PC已安装以下软件：

- Node.js 14.x 或更高版本
- npm 或 yarn 包管理器
- MongoDB（本地安装或MongoDB Atlas账号）

## 安装步骤

### 1. 克隆项目代码

首先，将项目代码复制到目标PC上：

```bash
# 如果使用Git克隆
# git clone <repository-url>
# cd <project-folder>

# 或者直接复制项目文件夹到目标位置
```

### 2. 配置环境变量

进入后端目录，复制并配置环境变量文件：

```bash
cd backend
cp .env.example .env
```

编辑 `.env` 文件，设置以下关键配置：

```
# 服务器配置
PORT=5000

# MongoDB连接URI（本地或Atlas）
MONGO_URI=mongodb://localhost:27017/portfolio
# 或使用MongoDB Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>?retryWrites=true&w=majority

# JWT密钥（请使用强随机密钥）
JWT_SECRET=your_secure_jwt_secret_key_please_change

# 前端URL（生产环境中设置为本机IP或域名）
FRONTEND_URL=http://localhost:5000
```

### 3. 安装依赖

#### 安装后端依赖：

```bash
cd backend
npm install
```

#### 安装前端依赖（可选，如需要重新构建）：

```bash
cd ../frontend
npm install
```

### 4. 构建前端项目（如果需要）

如果前端代码未预构建，或需要更新：

```bash
cd frontend
npm run build
```

这将生成 `dist` 目录，包含前端生产环境文件。

## 启动项目

### 开发模式启动（用于调试）

1. 启动后端：

```bash
cd backend
npm run dev
```

2. 启动前端（在新终端）：

```bash
cd frontend
npm run dev
```

### 生产模式启动（推荐部署方式）

后端服务器将同时提供API和前端静态文件服务：

```bash
cd backend
npm run start:prod
```

## 访问应用

- **生产模式**：打开浏览器访问 `http://localhost:5000` 或 `http://<your-ip>:5000`
- **开发模式**：后端API在 `http://localhost:5000/api`，前端在 `http://localhost:5173`

## 跨PC访问设置

要允许其他PC访问此应用，请执行以下操作：

1. 确保您的防火墙允许Node.js访问端口5000

2. 修改后端 `.env` 文件中的 `FRONTEND_URL` 为您的本机IP地址：

```
FRONTEND_URL=http://<your-ip>:5000
```

3. 使用生产模式启动服务器：

```bash
npm run start:prod
```

4. 在其他PC上，使用浏览器访问：

```
http://<your-ip>:5000
```

## 常见问题排查

1. **端口被占用**：修改 `.env` 文件中的 `PORT` 为其他端口
2. **数据库连接失败**：检查 `MONGO_URI` 是否正确，MongoDB服务是否运行
3. **跨域错误**：确保 `FRONTEND_URL` 配置正确
4. **权限问题**：确保Node.js有读写文件的权限

## 项目结构说明

- `/frontend/dist` - 前端构建文件
- `/backend` - 后端API服务
- `/backend/server.js` - 主服务器文件，配置了生产环境静态文件服务

## 注意事项

- 生产环境中，请务必使用强密码和密钥
- 定期备份数据库
- 考虑使用PM2等进程管理工具确保服务稳定运行