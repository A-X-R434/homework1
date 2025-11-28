#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== 开始部署应用 ===');

try {
  // 检查Node.js版本
  const nodeVersion = execSync('node -v').toString().trim();
  console.log(`Node.js版本: ${nodeVersion}`);

  // 安装依赖
  console.log('安装后端依赖...');
  execSync('npm install --production', { stdio: 'inherit' });

  // 检查.env.production文件是否存在
  const envPath = path.join(__dirname, '../.env.production');
  if (!fs.existsSync(envPath)) {
    console.error('错误: .env.production文件不存在');
    console.log('请复制.env.production文件并配置必要的环境变量');
    process.exit(1);
  }

  // 构建前端
  console.log('构建前端应用...');
  const frontendPath = path.join(__dirname, '../../frontend');
  if (fs.existsSync(frontendPath)) {
    // 切换到前端目录构建
    execSync('cd ../frontend && npm install && npm run build', { stdio: 'inherit' });
    console.log('前端构建完成');
  } else {
    console.warn('警告: 前端目录不存在，请确保前端应用已构建');
  }

  console.log('=== 部署准备完成 ===');
  console.log('请确保MongoDB Atlas连接配置正确');
  console.log('生产环境启动命令: NODE_ENV=production node server.js');
  console.log('或者使用PM2进行生产环境管理: pm2 start server.js --name "portfolio-backend"');

} catch (error) {
  console.error('部署过程中出错:', error.message);
  process.exit(1);
}