# 贡献指南

感谢你考虑为 GhostReader 做出贡献！我们欢迎各种形式的贡献。

## 贡献方式

### 报告问题

如果你发现了 bug 或有功能建议：

1. 在 [GitHub Issues](https://github.com/wllzhang/GhostReader/issues) 中搜索是否已有类似问题
2. 如果没有，创建一个新的 Issue
3. 使用清晰的标题和详细的描述
4. 如果是 bug，请提供复现步骤

**Bug 报告应包含：**
- VSCode 版本
- 操作系统
- GhostReader 版本
- 复现步骤
- 预期行为
- 实际行为
- 截图（如果适用）

### 提出功能建议

1. 在 Issues 中创建功能请求
2. 清楚地描述功能及其用途
3. 解释为什么这个功能对用户有价值
4. 如果可能，提供示例或原型

### 提交代码

我们欢迎你通过 Pull Request 贡献代码。

## 开发流程

### 1. Fork 并克隆仓库

```bash
# Fork 仓库到你的 GitHub 账号
# 然后克隆你的 fork

git clone https://github.com/YOUR_USERNAME/GhostReader.git
cd GhostReader
```

### 2. 创建分支

```bash
# 创建一个描述性的分支名
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

**分支命名规范：**
- `feature/*` - 新功能
- `fix/*` - Bug 修复
- `docs/*` - 文档更新
- `refactor/*` - 代码重构
- `test/*` - 测试相关

### 3. 设置开发环境

```bash
# 安装依赖
npm install

# 运行类型检查
npm run compile

# 启动监听模式
npm run watch
```

### 4. 进行开发

- 遵循现有的代码风格
- 编写清晰的注释
- 确保类型安全
- 添加必要的测试

### 5. 测试你的更改

```bash
# 运行 linter
npm run lint

# 运行类型检查
npm run compile

# 运行测试
npm test

# 构建扩展
npm run build

# 打包测试
npm run package
```

### 6. 提交更改

```bash
# 添加更改
git add .

# 提交（使用有意义的提交信息）
git commit -m "feat: add new feature"
```

**提交信息规范：**

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型（type）：**
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

**示例：**
```bash
git commit -m "feat: add bookmark feature"
git commit -m "fix: resolve reading mode toggle issue"
git commit -m "docs: update configuration guide"
```

### 7. 推送到 GitHub

```bash
git push origin feature/your-feature-name
```

### 8. 创建 Pull Request

1. 访问你的 fork 在 GitHub 上的页面
2. 点击 "New Pull Request"
3. 填写 PR 描述，说明：
   - 更改的内容
   - 为什么需要这些更改
   - 如何测试这些更改
   - 相关的 Issue 编号（如果有）

4. 等待代码审查

## 代码规范

### TypeScript 风格指南

```typescript
// ✅ 好的示例
export class BookManager {
  private books: Book[] = [];

  public addBook(book: Book): void {
    this.books.push(book);
  }

  public getBook(id: string): Book | undefined {
    return this.books.find(book => book.id === id);
  }
}

// ❌ 不好的示例
export class BookManager {
  books: any;

  addBook(book) {
    this.books.push(book);
  }
}
```

**规范要点：**
- 使用 TypeScript 的类型系统
- 明确的访问修饰符
- 有意义的变量和函数命名
- 适当的注释

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 类 | PascalCase | `BookManager` |
| 接口 | PascalCase | `IBook` |
| 函数 | camelCase | `addBook()` |
| 变量 | camelCase | `currentBook` |
| 常量 | UPPER_SNAKE_CASE | `MAX_BOOKS` |
| 文件 | kebab-case | `book-manager.ts` |

### 代码格式化

项目使用 Prettier 进行代码格式化：

```bash
# 格式化代码
npm run format

# 自动修复 lint 问题
npm run lint
```

**配置文件：**
- `.prettierrc` - Prettier 配置
- `.eslintrc` - ESLint 配置

## 项目结构

```
GhostReader/
├── src/
│   ├── core/           # 核心功能
│   │   ├── Application.ts
│   │   ├── Book.ts
│   │   ├── BookManager.ts
│   │   └── ...
│   ├── utils/          # 工具函数
│   ├── types/          # 类型定义
│   └── extension.ts    # 入口文件
├── docs/               # 文档
├── public/             # 静态资源
└── dist/               # 构建输出
```

## 测试

### 编写测试

测试文件应放在 `src/test/` 目录下：

```typescript
import * as assert from 'assert';
import { BookManager } from '../core/BookManager';

suite('BookManager Test Suite', () => {
  test('should add book', () => {
    const manager = new BookManager();
    const book = { id: '1', title: 'Test' };
    manager.addBook(book);
    assert.strictEqual(manager.getBook('1'), book);
  });
});
```

### 运行测试

```bash
npm test
```

## 文档

### 更新文档

如果你的更改影响了用户使用方式，请更新相关文档：

- `README.md` - 主要文档
- `docs/` - 详细文档
- 代码注释

### 文档规范

- 使用简洁清晰的语言
- 提供代码示例
- 添加截图（如果适用）
- 保持中英文一致

## 发布流程

维护者发布新版本的流程：

### 1. 更新版本号

```bash
# 更新 package.json 中的版本号
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

### 2. 创建标签

```bash
git tag -a v1.0.1 -m "Release version 1.0.1"
git push origin v1.0.1
```

### 3. 自动发布

推送标签后，GitHub Actions 会自动：
- 运行测试
- 构建扩展
- 发布到 VSCode Marketplace
- 创建 GitHub Release

## Pull Request 检查清单

在提交 PR 前，请确保：

- [ ] 代码遵循项目的代码风格
- [ ] 所有测试通过
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 提交信息遵循规范
- [ ] PR 描述清晰完整
- [ ] 没有合并冲突

## 获取帮助

如果你在贡献过程中遇到问题：

- 查看[开发文档](./local-development.md)
- 在 Issue 中提问
- 联系维护者

## 行为准则

参与贡献时，请遵守以下准则：

- 尊重所有贡献者
- 接受建设性的批评
- 专注于对项目最有利的事情
- 对社区成员表现出同理心

## 许可证

贡献的代码将在 [MIT License](../../LICENSE) 下发布。

---

再次感谢你的贡献！每一个贡献都让 GhostReader 变得更好。 🎉

