# GitHub Pages 部署指南

## 部署状态
✅ 前端构建文件已成功推送到 GitHub 仓库！

## 配置步骤

### 1. 已完成的工作
- ✅ 安装了前端依赖
- ✅ 成功构建了前端项目，生成了 `frontend/dist` 目录
- ✅ 修改了 `.gitignore` 文件，允许添加构建文件
- ✅ 使用 `git add -f` 命令强制添加了构建文件
- ✅ 提交并推送了构建文件到 GitHub 仓库

### 2. 您需要在 GitHub 网站上完成的配置

请按照以下步骤在 GitHub 网站上操作：

1. 访问您的 GitHub 仓库：[https://github.com/A-X-R434/homework1](https://github.com/A-X-R434/homework1)

2. 点击顶部导航栏中的 **Settings** 选项卡

3. 在左侧菜单中，向下滚动并选择 **Pages**

4. 在 **Source**（来源）部分：
   - 确保选择 **Deploy from a branch**（从分支部署）
   - 在 **Branch**（分支）下拉菜单中，选择 `main`
   - **关键步骤**：在文件夹选择下拉菜单中，输入 `frontend/dist`（必须输入完整路径）
   - 点击 **Save**（保存）按钮

5. GitHub 将开始自动部署您的网站

6. 部署完成后，您将在页面顶部看到类似这样的消息：
   > ✅ Your site is live at https://A-X-R434.github.io/homework1/

## 访问您的网站
部署完成后，您可以通过以下网址访问您的网站：

**https://A-X-R434.github.io/homework1**

## 常见问题与解决方案

### 1. 部署需要多长时间？
- 通常需要 1-2 分钟，但有时可能需要 5 分钟或更长时间。

### 2. 如果看不到网站或出现错误？
- 检查 GitHub Pages 配置页面，确认是否有错误信息
- 确保您输入的文件夹路径正确：`frontend/dist`
- 刷新浏览器或清除缓存后再试
- 等待几分钟后再检查，有时部署需要一些时间

### 3. 如何更新网站内容？
1. 在本地修改前端代码
2. 运行 `cd frontend && npm run build` 重新构建项目
3. 使用 `git add -f frontend/dist && git commit -m "Update frontend build" && git push` 推送更新
4. GitHub 将自动更新您的网站

## 注意事项

- 确保您的仓库是公开的（public），否则 GitHub Pages 可能无法访问
- 如果您修改了路由配置，可能需要额外配置以支持单页应用（SPA）路由
- 对于 API 调用，您需要确保后端服务是可公开访问的，或者使用相对路径

## 本地测试
在部署到 GitHub Pages 之前，您可以在本地使用以下命令测试构建的网站：

```bash
cd frontend
npm run preview
```

然后在浏览器中访问 http://localhost:4173 预览您的网站。

---

如果您有任何问题或需要进一步的帮助，请参考 [GitHub Pages 官方文档](https://docs.github.com/zh/pages)。