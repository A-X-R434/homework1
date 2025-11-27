# 个人作品集后端服务

这是一个基于Node.js和Express的后端服务，为个人作品集网站提供API支持，包括项目管理、博客管理、评论系统和联系留言功能。

## 技术栈

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT 认证
- bcrypt 密码加密

## 功能特性

- 用户认证系统
- 项目管理 (CRUD 操作)
- 博客文章管理
- 评论系统
- 联系留言管理
- 错误处理和日志记录

## 安装和配置

### 1. 克隆项目

```bash
git clone <repository-url>
cd backend
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 文件为 `.env` 并配置相应的值：

```bash
cp .env.example .env
```

编辑 `.env` 文件，设置以下环境变量：

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
```

### 4. 启动服务

开发模式：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

## API 端点

### 用户认证

- `POST /api/users/register` - 用户注册
- `POST /api/users/login` - 用户登录
- `GET /api/users/me` - 获取当前用户信息（需要认证）

### 项目管理

- `GET /api/projects` - 获取所有项目
- `GET /api/projects/:id` - 获取单个项目详情
- `POST /api/projects` - 创建新项目（需要认证）
- `PUT /api/projects/:id` - 更新项目（需要认证）
- `DELETE /api/projects/:id` - 删除项目（需要认证）

### 博客管理

- `GET /api/blogs` - 获取所有博客文章
- `GET /api/blogs/:id` - 获取单个博客文章详情
- `POST /api/blogs` - 创建新博客文章（需要认证）
- `PUT /api/blogs/:id` - 更新博客文章（需要认证）
- `DELETE /api/blogs/:id` - 删除博客文章（需要认证）

### 评论系统

- `GET /api/comments/post/:postId` - 获取指定博客文章的所有评论
- `POST /api/comments/post/:postId` - 创建新评论（需要认证）
- `DELETE /api/comments/:id` - 删除评论（需要认证）

### 留言管理

- `POST /api/messages` - 提交留言
- `GET /api/messages` - 获取所有留言（需要认证）
- `GET /api/messages/:id` - 获取单个留言详情（需要认证）
- `PUT /api/messages/:id` - 更新留言状态（需要认证）
- `DELETE /api/messages/:id` - 删除留言（需要认证）

### 健康检查

- `GET /api/health` - API 健康检查

## 数据库模型

### 用户 (User)
- `username`: 用户名
- `email`: 邮箱
- `password`: 密码（加密存储）

### 项目 (Project)
- `title`: 项目标题
- `description`: 项目描述
- `image`: 项目图片URL
- `link`: 项目链接
- `github`: GitHub仓库链接
- `author`: 作者ID
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

### 博客文章 (BlogPost)
- `title`: 文章标题
- `content`: 文章内容
- `tags`: 标签数组
- `author`: 作者ID
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

### 评论 (Comment)
- `body`: 评论内容
- `author`: 作者ID
- `post`: 博客文章ID
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

### 留言 (Message)
- `name`: 发送者姓名
- `email`: 发送者邮箱
- `subject`: 留言主题
- `message`: 留言内容
- `status`: 状态（pending, read, replied）
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

## 错误处理

API 使用标准的 HTTP 状态码和统一的错误响应格式：

```json
{
  "success": false,
  "error": "错误消息",
  "stack": "仅在开发环境中显示"
}
```

## 安全措施

- JWT 认证保护敏感路由
- 密码加密存储
- 输入验证和消毒
- CORS 配置
- 错误处理和异常捕获

## 开发

### 运行测试

```bash
npm test
```

### 项目结构

```
backend/
  ├── config/         # 配置文件
  ├── controllers/    # 控制器
  ├── middleware/     # 中间件
  ├── models/         # 数据模型
  ├── routes/         # API 路由
  ├── utils/          # 工具函数
  ├── .env            # 环境变量
  ├── .env.example    # 环境变量示例
  ├── index.js        # 应用入口
  ├── package.json
  └── README.md       # 项目文档
```

## 部署

### Heroku

1. 创建 Heroku 应用
2. 配置环境变量
3. 部署代码

### Vercel

1. 连接 GitHub 仓库
2. 配置环境变量
3. 部署项目

## 许可证

MIT