# 部署指南

本文档提供了如何将Portfolio应用部署到生产环境的详细步骤。

## 准备工作

### 1. 环境要求

- Node.js 16.x 或更高版本
- npm 或 yarn
- MongoDB Atlas 账户（或其他MongoDB实例）
- 生产服务器（推荐使用云服务商如AWS、Azure、阿里云等）

### 2. 配置MongoDB Atlas

1. 访问 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 并注册账户
2. 创建一个新的集群
3. 设置数据库用户和密码
4. 配置网络访问（允许你的服务器IP地址）
5. 获取连接字符串

### 3. 配置环境变量

复制并修改生产环境配置文件：

```bash
cp .env.production .env
```

编辑`.env`文件，填入你的配置：

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority&maxPoolSize=10&minPoolSize=2&serverSelectionTimeoutMS=5000
JWT_SECRET=your_strong_jwt_secret_key_here
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
LOG_LEVEL=info
SERVER_HOST=0.0.0.0
```

## 部署步骤

### 选项 1: 使用部署脚本（推荐）

```bash
# 确保脚本有执行权限
chmod +x scripts/deploy.js

# 运行部署脚本
node scripts/deploy.js
```

### 选项 2: 手动部署

1. **安装依赖**

```bash
npm install --production
```

2. **构建前端应用**

```bash
cd ../frontend
npm install
npm run build
cd ../backend
```

3. **启动应用**

使用Node.js直接运行（仅用于测试）：

```bash
NODE_ENV=production node server.js
```

### 选项 3: 使用PM2进行生产环境管理（推荐）

PM2是一个生产进程管理器，提供自动重启、日志管理等功能。

```bash
# 安装PM2
npm install -g pm2

# 使用PM2启动应用
pm run start:prod
```

## 生产环境优化

### 1. 配置反向代理

推荐使用Nginx作为反向代理：

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. 启用HTTPS

使用Let's Encrypt获取免费SSL证书：

```bash
# 安装Certbot
apt-get update
apt-get install certbot python3-certbot-nginx

# 获取并配置SSL证书
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 3. 设置自动重启

使用PM2的开机自启动功能：

```bash
# 生成启动脚本
pm run setup:prod
```

## 监控与维护

### 日志管理

```bash
# 查看应用日志
pm run logs:prod

# 实时监控应用状态
pm run monit:prod
```

### 常见问题排查

1. **数据库连接问题**
   - 检查MongoDB Atlas连接字符串是否正确
   - 确保IP地址已添加到MongoDB Atlas白名单
   - 验证数据库用户名和密码

2. **CORS错误**
   - 确保ALLOWED_ORIGINS环境变量包含正确的前端域名

3. **端口占用**
   - 更改PORT环境变量或停止占用该端口的进程

## 安全建议

1. 定期更新依赖包
2. 定期更改JWT密钥
3. 使用强密码和定期轮换
4. 限制服务器开放的端口
5. 定期备份数据库

---

如需进一步的帮助，请参考相关文档或联系技术支持。