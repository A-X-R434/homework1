#!/usr/bin/env node

const { exec, spawn } = require('child_process');
const http = require('http');
const path = require('path');

console.log('=== 测试生产环境配置 ===');

// 启动服务器实例
let serverProcess;

try {
  // 先检查环境配置文件
  console.log('检查.env.production配置...');
  
  // 启动生产环境服务器（限制运行时间为30秒）
  console.log('启动生产环境服务器...');
  
  // 使用spawn并设置环境变量
  const env = { ...process.env, NODE_ENV: 'production' };
  serverProcess = spawn('node', ['server.js'], {
    env: env,
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe'
  });
  
  serverProcess.stdout.on('data', (data) => {
    console.log(`服务器输出: ${data}`);
    
    // 检查是否启动成功
    if (data.includes('Server running')) {
      console.log('✅ 服务器启动成功');
      
      // 给服务器一点时间完全启动
      setTimeout(() => {
        testServerHealth();
      }, 3000);
    }
  });
  
  serverProcess.stderr.on('data', (data) => {
    console.error(`服务器错误: ${data}`);
    
    // 检查常见错误
    if (data.includes('MongoError')) {
      console.error('❌ MongoDB连接错误');
      console.log('请检查MongoDB Atlas连接字符串配置');
    } else if (data.includes('port')) {
      console.error('❌ 端口占用错误');
      console.log('请检查端口5000是否被占用');
    }
    
    cleanup();
  });
  
  // 设置超时
  setTimeout(() => {
    console.error('❌ 服务器启动超时');
    cleanup();
  }, 30000);
  
} catch (error) {
  console.error('测试过程中出错:', error);
  cleanup();
}

// 测试服务器健康状态
function testServerHealth() {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    console.log(`状态码: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('响应数据:', data);
      console.log('✅ 生产环境测试完成');
      console.log('\n注意事项:');
      console.log('1. 生产环境部署请确保MongoDB Atlas配置正确');
      console.log('2. 建议使用PM2进行进程管理');
      console.log('3. 生产环境请配置Nginx反向代理和HTTPS');
      
      cleanup();
    });
  });
  
  req.on('error', (e) => {
    console.error(`请求错误: ${e.message}`);
    console.log('❌ 健康检查失败，但服务器可能仍在运行');
    console.log('请手动测试服务器功能');
    cleanup();
  });
  
  req.end();
}

// 清理函数
function cleanup() {
  console.log('清理测试环境...');
  if (serverProcess) {
    serverProcess.kill('SIGINT');
  }
  console.log('=== 测试结束 ===');
}