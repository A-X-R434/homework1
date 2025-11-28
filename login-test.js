const http = require('http');

// 登录测试数据
const loginData = {
  email: 'test@example.com', // 确保使用正确的email登录格式
  password: 'password123'    // 假设的测试密码
};

// 转换为JSON字符串
const data = JSON.stringify(loginData);

// 请求选项
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/users/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
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
    try {
      const result = JSON.parse(responseData);
      console.log('登录响应:', result);
      if (result.token) {
        console.log('\n=== 有效Token（请复制用于后续测试）===');
        console.log(result.token);
        console.log('==================================');
      }
    } catch (e) {
      console.log('响应体:', responseData);
      console.log('解析错误:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error(`请求错误: ${e.message}`);
});

// 写入数据到请求体
req.write(data);
req.end();