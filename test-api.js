const http = require('http');

// 使用简单的英文字符串避免编码问题
const blogData = {
  title: 'Test Blog Post',
  content: 'This is a test blog post content. It must be at least 50 characters long to meet validation requirements. Let me add more content to ensure it meets the length criteria.',
  tags: ['test', 'development']
};

// 转换为JSON字符串
const data = JSON.stringify(blogData);

// 请求选项
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/blogs',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MjgyMGU2OTc5ODMxMWYwYTdlMDRiOSIsImlhdCI6MTc2NDI2NDk3OCwiZXhwIjoxNzY2ODU2OTc4fQ.Z1XgIJX3to2YzdNi8euVG9NPeKv1oILH6V3Ia3ZUDp8'
  }
};

// 发送请求
const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log('响应头:', res.headers);
  
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('响应体:', responseData);
  });
});

req.on('error', (e) => {
  console.error(`请求错误: ${e.message}`);
});

// 写入数据到请求体
req.write(data);
req.end();