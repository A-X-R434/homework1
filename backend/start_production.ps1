# 设置生产环境变量
$env:NODE_ENV = 'production'

# 输出当前环境信息
Write-Host "启动生产环境服务器..."
Write-Host "环境: $env:NODE_ENV"

# 启动服务器
node server.js