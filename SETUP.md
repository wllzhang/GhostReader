# CI/CD 和文档部署设置指南

本文档说明如何配置 GhostReader 的 CI/CD 和文档自动部署。

## 📋 前置要求

1. GitHub 账号
2. VSCode Marketplace 发布者账号
3. Azure DevOps 账号（用于获取 PAT）

## 🚀 快速设置

### 1. 配置 VSCode Marketplace Token

#### 获取 Personal Access Token (PAT)

1. 访问 [Azure DevOps](https://dev.azure.com/)
2. 登录与 VSCode Marketplace 关联的账号
3. 点击右上角用户头像 > **Personal access tokens**
4. 点击 **+ New Token**
5. 配置 Token：
   ```
   Name: VSCode Marketplace Publishing
   Organization: All accessible organizations
   Expiration: 1 year (或自定义)
   Scopes: 
     ✅ Marketplace (Manage)
   ```
6. 点击 **Create** 并 **复制生成的 Token**

#### 添加到 GitHub Secrets

1. 访问你的 GitHub 仓库
2. 进入 **Settings** > **Secrets and variables** > **Actions**
3. 点击 **New repository secret**
4. 配置：
   ```
   Name: VSCE_PAT
   Value: [粘贴你的 Token]
   ```
5. 点击 **Add secret**

### 2. 配置 GitHub Pages

1. 进入仓库 **Settings** > **Pages**
2. **Source** 选择：**GitHub Actions**
3. 保存

### 3. 更新 VitePress 配置

编辑 `docs/.vitepress/config.ts`，修改 `base` 值为你的仓库名：

```typescript
export default defineConfig({
  // ...
  base: '/你的仓库名/',  // 如 '/GhostReader/'
  // ...
})
```

### 4. 安装依赖

```bash
npm install
```

## 📦 使用方法

### 自动发布到 VSCode Marketplace

当你推送版本标签时，会自动触发发布流程：

```bash
# 更新版本号（会自动创建 git commit 和 tag）
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0  
npm version major  # 1.0.0 -> 2.0.0

# 推送到 GitHub（触发自动发布）
git push origin main
git push origin --tags
```

**自动执行的步骤：**
1. ✅ 运行 linter 检查
2. ✅ 运行类型检查
3. ✅ 运行测试
4. ✅ 构建扩展
5. ✅ 打包 VSIX
6. ✅ 发布到 VSCode Marketplace
7. ✅ 创建 GitHub Release
8. ✅ 上传 VSIX 到 Release

### 查看发布状态

访问 GitHub Actions 页面查看：
```
https://github.com/你的用户名/GhostReader/actions
```

### 自动部署文档

文档会在以下情况自动部署：
- 推送到 `main` 或 `master` 分支
- 修改了 `docs/**` 或 `.vitepress/**` 目录

或手动触发：
1. 访问 **Actions** 页面
2. 选择 **Deploy Documentation** 工作流
3. 点击 **Run workflow**

部署后访问：
```
https://你的用户名.github.io/GhostReader/
```

### 本地预览文档

```bash
# 启动开发服务器
npm run docs:dev

# 构建文档
npm run docs:build

# 预览构建的文档
npm run docs:preview
```

## 🔧 CI/CD 工作流说明

### 1. CI 工作流 (`.github/workflows/ci.yml`)

**触发条件：**
- Push 到 `main`、`master` 或 `develop` 分支
- Pull Request 到上述分支

**执行内容：**
- 多平台测试（Ubuntu、Windows、macOS）
- Linter 检查
- 类型检查
- 单元测试
- 构建验证

### 2. 发布工作流 (`.github/workflows/publish.yml`)

**触发条件：**
- 推送以 `v` 开头的标签（如 `v1.0.0`）

**执行内容：**
- 完整的 CI 检查
- 发布到 VSCode Marketplace
- 创建 GitHub Release
- 上传 VSIX 文件

### 3. 文档部署工作流 (`.github/workflows/deploy-docs.yml`)

**触发条件：**
- Push 到 `main` 或 `master` 分支
- 修改了文档相关文件
- 手动触发

**执行内容：**
- 构建 VitePress 文档
- 部署到 GitHub Pages

## 📝 版本发布流程

### 标准发布流程

```bash
# 1. 确保在 main 分支且代码是最新的
git checkout main
git pull

# 2. 运行测试确保一切正常
npm test
npm run lint
npm run build

# 3. 更新版本号
npm version patch  # 或 minor/major

# 4. 推送代码和标签
git push origin main
git push origin --tags

# 5. 等待 GitHub Actions 自动发布
# 访问 https://github.com/你的用户名/GhostReader/actions 查看进度
```

### 预发布版本

```bash
# 创建预发布版本
npm version prerelease --preid=beta

# 手动发布到 Marketplace (预发布)
npm run publish -- --pre-release
```

## 🐛 故障排查

### 发布失败

**问题：** `EAUTH` 错误
**解决：** PAT Token 过期或无效，重新生成并更新 GitHub Secret

**问题：** `Extension validation failed`
**解决：** 检查 `package.json` 配置，确保所有必需字段正确

### 文档部署失败

**问题：** 404 Not Found
**解决：** 检查 `base` 配置是否正确，应该是 `/仓库名/`

**问题：** 样式丢失
**解决：** 确保所有资源路径使用相对路径或正确的 base 路径

### CI 测试失败

**问题：** 测试在某个平台失败
**解决：** 
```bash
# 本地运行测试
npm test

# 检查特定平台的兼容性
# 使用 continue-on-error: true 允许测试失败
```

## 📚 相关资源

- [VSCode Extension Publishing](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [VitePress 文档](https://vitepress.dev/)
- [Azure DevOps PAT](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate)

## ✅ 检查清单

在首次设置后，确认以下项目：

- [ ] VSCE_PAT Secret 已添加到 GitHub
- [ ] GitHub Pages 已启用
- [ ] VitePress base 配置正确
- [ ] 依赖已安装 (`npm install`)
- [ ] 本地文档可以运行 (`npm run docs:dev`)
- [ ] CI 工作流通过
- [ ] 成功发布一个测试版本

## 💡 最佳实践

1. **频繁的小更新** - 每 1-2 周发布一次更新
2. **完善的测试** - 发布前确保所有测试通过
3. **清晰的版本号** - 遵循语义化版本规范
4. **详细的 Release Notes** - 在 GitHub Release 中说明变更
5. **文档同步更新** - 功能变更时同步更新文档

## 🤝 需要帮助？

如果在设置过程中遇到问题：
- 查看 [GitHub Actions 运行日志](https://github.com/你的用户名/GhostReader/actions)
- 提交 [Issue](https://github.com/wllzhang/GhostReader/issues)
- 查看[发布流程文档](./docs/development/release.md)

---

**祝发布顺利！** 🎉

