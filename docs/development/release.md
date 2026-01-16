# 发布流程

本文档说明如何发布 GhostReader 的新版本。

## 发布前准备

### 1. 确保所有测试通过

```bash
# 运行 linter
npm run lint

# 运行类型检查
npm run compile

# 运行测试
npm test

# 构建扩展
npm run build
```

### 2. 更新版本号

根据变更类型选择合适的版本号：

- **Patch（修订号）** - Bug 修复：1.0.0 → 1.0.1
- **Minor（次版本号）** - 新功能（向后兼容）：1.0.0 → 1.1.0
- **Major（主版本号）** - 破坏性更改：1.0.0 → 2.0.0

```bash
# 补丁版本
npm version patch

# 次版本
npm version minor

# 主版本
npm version major
```

这将自动：
- 更新 `package.json` 中的版本号
- 创建一个 git commit
- 创建一个 git tag

### 3. 更新 CHANGELOG

如果有 `CHANGELOG.md` 文件，请更新它：

```markdown
## [2.0.1] - 2024-01-15

### Added
- 新增书签功能

### Fixed
- 修复翻页时的崩溃问题

### Changed
- 优化阅读性能
```

### 4. 提交更改

```bash
git add .
git commit -m "chore: release version 2.0.1"
```

## 自动发布（推荐）

### 使用 GitHub Actions 自动发布

项目已配置 GitHub Actions，当你推送版本标签时会自动发布。

#### 步骤：

1. **推送代码和标签**

```bash
# 推送到主分支
git push origin main

# 推送标签（这将触发发布）
git push origin v2.0.1
```

2. **GitHub Actions 将自动：**
   - ✅ 运行所有测试
   - ✅ 构建扩展
   - ✅ 打包 VSIX 文件
   - ✅ 发布到 VSCode Marketplace
   - ✅ 创建 GitHub Release
   - ✅ 上传 VSIX 到 Release

3. **监控发布进度**

访问 GitHub 仓库的 Actions 页面查看发布状态：
```
https://github.com/wllzhang/GhostReader/actions
```

### 配置要求

#### 1. VSCE_PAT Secret

需要在 GitHub 仓库设置中配置 `VSCE_PAT` secret：

**获取 Personal Access Token：**

1. 访问 [Azure DevOps](https://dev.azure.com/)
2. 登录你的账号（与 VSCode Marketplace 关联）
3. 点击右上角的用户设置 > Personal access tokens
4. 点击 "New Token"
5. 配置：
   - Name: `VSCode Marketplace`
   - Organization: `All accessible organizations`
   - Expiration: 选择一个合适的过期时间
   - Scopes: 选择 `Marketplace` > `Manage`
6. 点击 "Create" 并复制生成的 token

**添加到 GitHub：**

1. 访问你的 GitHub 仓库
2. 进入 Settings > Secrets and variables > Actions
3. 点击 "New repository secret"
4. Name: `VSCE_PAT`
5. Value: 粘贴你的 token
6. 点击 "Add secret"

#### 2. GitHub Pages

如果要自动部署文档到 GitHub Pages：

1. 进入仓库 Settings > Pages
2. Source: 选择 "GitHub Actions"
3. 保存

### 工作流配置

**发布工作流（`.github/workflows/publish.yml`）：**

```yaml
name: Publish Extension

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run compile
      - run: npm test
      - run: npm run build
      - run: npm run package
      - run: npm run publish
        env:
          VSCE_PAT: ${{ secrets.VSCE_PAT }}
      - uses: softprops/action-gh-release@v1
        with:
          files: '*.vsix'
```

## 手动发布

如果需要手动发布（不推荐，除非自动发布失败）：

### 1. 登录到 vsce

```bash
# 安装 vsce（如果还没有）
npm install -g @vscode/vsce

# 登录
vsce login wllzhang
```

输入你的 Personal Access Token。

### 2. 打包扩展

```bash
npm run package
```

这将生成 `GhostReader-2.0.1.vsix` 文件。

### 3. 发布到 Marketplace

```bash
npm run publish
# 或
vsce publish
```

### 4. 创建 GitHub Release

1. 访问 [GitHub Releases](https://github.com/wllzhang/GhostReader/releases)
2. 点击 "Draft a new release"
3. 选择刚才创建的标签
4. 填写 Release notes
5. 上传 VSIX 文件
6. 点击 "Publish release"

## 发布检查清单

在发布前确保：

- [ ] 所有测试通过
- [ ] 代码已通过 lint 检查
- [ ] 文档已更新
- [ ] 版本号已更新
- [ ] CHANGELOG 已更新
- [ ] 本地构建成功
- [ ] 扩展功能正常
- [ ] 没有未提交的更改

发布后确认：

- [ ] Marketplace 上版本已更新
- [ ] 可以正常安装
- [ ] GitHub Release 已创建
- [ ] 文档站点已更新

## 版本策略

### 语义化版本

遵循 [Semantic Versioning 2.0.0](https://semver.org/)：

**格式：** `MAJOR.MINOR.PATCH`

- **MAJOR（主版本）** - 不兼容的 API 更改
- **MINOR（次版本）** - 向后兼容的新功能
- **PATCH（修订版本）** - 向后兼容的 bug 修复

### 版本示例

```
1.0.0 - 初始稳定版本
1.0.1 - 修复 bug
1.1.0 - 新增书签功能
1.1.1 - 修复书签 bug
2.0.0 - 重构架构，不兼容 1.x 配置
```

### 预发布版本

用于测试的预发布版本：

```bash
# 创建 alpha 版本
npm version prerelease --preid=alpha
# 结果: 2.0.0-alpha.0

# 创建 beta 版本
npm version prerelease --preid=beta
# 结果: 2.0.0-beta.0

# 发布预发布版本
vsce publish --pre-release
```

## 发布频率

建议的发布频率：

- **Patch 版本** - 紧急 bug 修复，随时发布
- **Minor 版本** - 每 2-4 周，新功能积累
- **Major 版本** - 每 3-6 个月，重大更改

## 回滚

如果发布的版本有严重问题：

### 1. 从 Marketplace 取消发布

```bash
# 取消发布特定版本
vsce unpublish wllzhang.GhostReader@2.0.1
```

::: warning 警告
取消发布会影响已安装该版本的用户。建议发布修复版本而不是取消发布。
:::

### 2. 发布修复版本

```bash
# 修复问题
git checkout -b fix/critical-bug

# 修复代码
# ...

# 提交并发布新版本
git commit -am "fix: critical bug"
npm version patch
git push origin main
git push origin v2.0.2
```

## CI/CD 配置详解

### 持续集成（CI）

**`.github/workflows/ci.yml`** 在每次推送和 PR 时运行：

```yaml
name: CI

on:
  push:
    branches: [ main, master, develop ]
  pull_request:
    branches: [ main, master, develop ]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [20.x]
```

### 文档部署

**`.github/workflows/deploy-docs.yml`** 自动部署文档：

```yaml
name: Deploy Documentation

on:
  push:
    branches: [ main ]
    paths:
      - 'docs/**'
      - '.vitepress/**'
```

## 监控和分析

### Marketplace 统计

访问 [Visual Studio Marketplace](https://marketplace.visualstudio.com/manage/publishers/wllzhang) 查看：

- 安装量
- 评分
- 评论
- 趋势

### GitHub Insights

查看 GitHub 仓库的 Insights 标签：

- 下载量（Releases）
- Star 数量
- Fork 数量
- 贡献者

## 常见问题

### Q: 发布失败，显示 "EAUTH" 错误？

A: Personal Access Token 可能过期或无效。重新生成并更新 GitHub Secret。

### Q: 如何发布到 Open VSX Registry？

A: 
```bash
# 安装 ovsx
npm install -g ovsx

# 发布
ovsx publish GhostReader-2.0.1.vsix -p YOUR_ACCESS_TOKEN
```

### Q: 如何更新扩展图标？

A: 
1. 替换 `public/logo.svg`（或 logo.png）
2. 确保 `package.json` 中 `icon` 字段指向正确路径
3. 发布新版本

### Q: 如何添加发布说明？

A: 在 GitHub Release 中添加详细的更新日志和说明。

## 最佳实践

1. **频繁的小更新** - 比大而少的更新更好
2. **完善的测试** - 发布前充分测试
3. **清晰的文档** - 更新日志和文档同步
4. **用户反馈** - 关注 Issues 和评论
5. **版本规范** - 遵循语义化版本
6. **自动化** - 使用 CI/CD 减少人为错误

---

如有问题，查看 [GitHub Actions 文档](https://docs.github.com/en/actions) 或提交 [Issue](https://github.com/wllzhang/GhostReader/issues)。

