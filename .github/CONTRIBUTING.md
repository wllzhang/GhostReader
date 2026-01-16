# 贡献指南

感谢你考虑为 GhostReader 做出贡献！🎉

## 📋 目录

- [开发环境设置](#开发环境设置)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [Pull Request 流程](#pull-request-流程)

## 🛠️ 开发环境设置

### 前置要求

- Node.js 16.x 或更高版本
- npm 或 yarn
- VS Code

### 克隆并安装

```bash
# 克隆仓库
git clone https://github.com/wllzhang/GhostReader.git
cd GhostReader

# 安装依赖
npm install

# 启动开发模式
npm run watch
```

### 在 VS Code 中调试

1. 按 `F5` 或点击 "Run and Debug"
2. 选择 "Run Extension"
3. 这会打开一个新的 VS Code 窗口，扩展已加载

## 🔄 开发流程

### 1. Fork 项目

点击 GitHub 页面右上角的 "Fork" 按钮

### 2. 创建分支

```bash
# 创建功能分支
git checkout -b feature/your-feature-name

# 或创建修复分支
git checkout -b fix/your-bug-fix
```

### 3. 开发和测试

```bash
# 开发模式（自动重新编译）
npm run watch

# 运行测试
npm test

# 构建
npm run build
```

### 4. 提交代码

```bash
git add .
git commit -m "feat: 添加新功能描述"
git push origin feature/your-feature-name
```

## 📝 代码规范

### TypeScript 编码规范

- 使用 TypeScript 严格模式
- 为所有公共 API 添加类型注解
- 遵循 ESLint 配置规则
- 使用有意义的变量和函数名

```typescript
// ✅ 好的示例
export function parseBookContent(content: string, lineCount: number): string[] {
  return content.split('\n').slice(0, lineCount);
}

// ❌ 不好的示例
export function parse(c: any, n: any) {
  return c.split('\n').slice(0, n);
}
```

### 文件组织

- `src/core/` - 核心功能类
- `src/utils/` - 工具函数
- `src/types/` - TypeScript 类型定义
- `src/test/` - 测试文件

### 命名约定

- **类名**: PascalCase (如 `BookManager`)
- **函数名**: camelCase (如 `parseContent`)
- **常量**: UPPER_SNAKE_CASE (如 `MAX_DISPLAY_LINES`)
- **接口**: PascalCase，以 `I` 开头可选 (如 `BookInfo` 或 `IBookInfo`)

## 💬 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型 (type)

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档变更
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 重构（既不是新增功能，也不是修复 bug）
- `perf`: 性能优化
- `test`: 增加测试
- `chore`: 构建过程或辅助工具的变动

### 示例

```bash
feat(parser): 添加 UTF-16 编码支持
fix(statusbar): 修复翻页按钮在某些情况下不显示的问题
docs(readme): 更新安装说明
```

## 🚀 Pull Request 流程

### 1. 提交 PR 前检查

- [ ] 代码已通过 ESLint 检查
- [ ] 所有测试通过
- [ ] 添加了必要的注释和文档
- [ ] 更新了 README（如果需要）
- [ ] 遵循了提交规范

### 2. PR 描述模板

```markdown
## 变更类型

- [ ] 新功能
- [ ] Bug 修复
- [ ] 文档更新
- [ ] 代码重构
- [ ] 性能优化

## 描述

简要描述这个 PR 的目的和内容

## 相关 Issue

关闭 #issue_number

## 测试

描述你是如何测试这些变更的

## 截图（如果适用）

添加截图帮助说明

## 检查清单

- [ ] 代码遵循项目规范
- [ ] 已添加/更新测试
- [ ] 所有测试通过
- [ ] 已更新相关文档
```

### 3. Code Review

- 维护者会审查你的代码
- 可能会要求修改
- 修改后会自动更新 PR

### 4. 合并

- PR 被批准后会被合并到主分支
- 你的贡献会出现在下一个版本中

## 🐛 报告 Bug

使用 [GitHub Issues](https://github.com/wllzhang/GhostReader/issues) 报告 bug，请包含：

- 详细的问题描述
- 复现步骤
- 期望行为
- 实际行为
- 环境信息（VS Code 版本、操作系统等）
- 截图或错误日志

## 💡 功能建议

我们欢迎新功能建议！请：

1. 先检查 [Issues](https://github.com/wllzhang/GhostReader/issues) 是否已有类似建议
2. 创建新 Issue，描述功能需求和使用场景
3. 等待维护者反馈

## 📖 文档贡献

文档同样重要！你可以：

- 改进 README
- 完善 API 文档
- 添加使用示例
- 修正拼写错误

文档源码在 `docs/` 目录下。

## 🤝 行为准则

请阅读并遵守我们的 [行为准则](CODE_OF_CONDUCT.md)。

## ❓ 需要帮助？

- 查看 [文档](https://wllzhang.github.io/GhostReader/)
- 在 [Discussions](https://github.com/wllzhang/GhostReader/discussions) 提问
- 查看 [支持文档](SUPPORT.md)

---

再次感谢你的贡献！🙏
