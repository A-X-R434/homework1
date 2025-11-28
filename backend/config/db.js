const mongoose = require('mongoose');

const connectDB = async () => {
  // 连接配置选项
  const options = {
    // 现代MongoDB驱动不再需要这些选项
    // useNewUrlParser: true, 
    // useUnifiedTopology: true,
    
    // 生产环境优化配置
    maxPoolSize: 10, // 最大连接数
    minPoolSize: 2,  // 最小连接数
    socketTimeoutMS: 45000, // 套接字超时
    serverSelectionTimeoutMS: 5000, // 服务器选择超时
    keepAliveInitialDelay: 300000, // 连接保活
  };

  try {
    console.log('正在连接到MongoDB数据库...');
    
    // 增加重试逻辑
    let attempts = 0;
    const maxAttempts = 3;
    let conn;

    while (attempts < maxAttempts) {
      try {
        conn = await mongoose.connect(process.env.MONGO_URI, options);
        break; // 连接成功，跳出循环
      } catch (retryError) {
        attempts++;
        console.error(`连接尝试 ${attempts} 失败: ${retryError.message}`);
        
        if (attempts < maxAttempts) {
          const delay = 2000 * attempts; // 指数退避
          console.log(`等待 ${delay}ms 后重试...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // 检查是否成功连接
    if (!conn) {
      throw new Error(`在 ${maxAttempts} 次尝试后仍无法连接到MongoDB`);
    }

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`数据库名称: ${conn.connection.name}`);
    
    // 添加连接事件监听
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB连接错误:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB连接断开');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB重新连接成功');
    });
    
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    
    // 在开发环境中退出进程，生产环境中可以更优雅地处理
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    
    // 在生产环境中抛出错误，让调用者处理
    throw error;
  }
};

module.exports = connectDB;