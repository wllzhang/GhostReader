# 本地开发

本指南将帮助你设置 GhostReader 的本地开发环境。

## 环境要求

### 必需软件

- **Node.js** >= 20.x
- **npm** >= 10.x
- **VSCode** >= 1.95.0
- **Git**

### 推荐工具

- **VSCode 扩展：**
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features

## 快速开始

### 1. 克隆仓库

```bash
# 克隆仓库
git clone https://github.com/wllzhang/GhostReader.git

# 进入项目目录
cd GhostReader
```

如果你要贡献代码，应该先 Fork 仓库，然后克隆你的 Fork：

```bash
git clone https://github.com/YOUR_USERNAME/GhostReader.git
cd GhostReader
```

### 2. 安装依赖

```bash
npm install
```

这将安装所有必需的依赖包。

### 3. 编译项目

```bash
# 编译 TypeScript（类型检查）
npm run compile

# 构建扩展（生产模式）
npm run build
```

### 4. 启动开发模式

```bash
# 启动监听模式（自动重新构建）
npm run watch
```

## 调试扩展

### 方式一：使用 F5 调试

1. 在 VSCode 中打开项目
2. 按 `F5` 或点击 "Run" > "Start Debugging"
3. 将打开一个新的 VSCode 窗口（扩展开发主机）
4. 在新窗口中测试扩展功能

### 方式二：使用断点调试

1. 在源代码中设置断点
2. 按 `F5` 启动调试
3. 在扩展开发主机中触发相应功能
4. 调试器将在断点处暂停

**调试配置（`.vscode/launch.json`）：**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Run Extension",
      "type": "extensionHost",
      "request": "launch",
      "args": [
        "--extensionDevelopmentPath=${workspaceFolder}"
      ],
      "outFiles": [
        "${workspaceFolder}/dist/**/*.js"
      ],
      "preLaunchTask": "${defaultBuildTask}"
    }
  ]
}
```

### 查看输出

在扩展开发主机中：
1. 打开输出面板（`Ctrl+Shift+U` 或 `Cmd+Shift+U`）
2. 选择 "Extension Host"
3. 查看 console.log 输出

## 开发工作流

### 日常开发流程

```bash
# 1. 启动监听模式
npm run watch

# 2. 在另一个终端运行类型检查
npm run compile -- --watch

# 3. 按 F5 启动调试
# 4. 在扩展开发主机中测试
# 5. 修改代码后，使用 Developer: Reload Window 重载
```

### 代码检查

```bash
# 运行 ESLint
npm run lint

# 自动修复 lint 问题
npm run lint -- --fix

# 运行类型检查
npm run compile
```

### 代码格式化

```bash
# 格式化所有 TypeScript 文件
npm run format

# 检查格式
npm run format -- --check
```

## 项目结构详解

```
GhostReader/
├── .github/
│   └── workflows/       # GitHub Actions 工作流
│       ├── ci.yml       # 持续集成
│       └── publish.yml  # 自动发布
│
├── .vscode/
│   ├── launch.json      # 调试配置
│   └── tasks.json       # 任务配置
│
├── docs/                # 文档站点
│   ├── .vitepress/      # VitePress 配置
│   ├── guide/           # 使用指南
│   └── development/     # 开发文档
│
├── public/              # 静态资源
│   └── logo.svg         # 扩展图标
│
├── src/
│   ├── core/            # 核心功能模块
│   │   ├── Application.ts      # 主应用类
│   │   ├── Book.ts             # 书籍类
│   │   ├── BookManager.ts      # 书籍管理器
│   │   ├── BookTree.ts         # 书架树视图
│   │   ├── Parser.ts           # 文本解析器
│   │   ├── StatusBar.ts        # 状态栏控制
│   │   ├── barItems/           # 状态栏项
│   │   └── index.ts            # 核心模块入口
│   │
│   ├── utils/           # 工具函数
│   │   ├── config.ts    # 配置管理
│   │   ├── message.ts   # 消息提示
│   │   ├── storage.ts   # 数据存储
│   │   └── id.ts        # ID 生成
│   │
│   ├── types/           # TypeScript 类型定义
│   │   └── index.ts
│   │
│   ├── test/            # 测试文件
│   │   └── extension.test.ts
│   │
│   └── extension.ts     # 扩展入口
│
├── dist/                # 构建输出（自动生成）
│   ├── extension.js
│   └── extension.js.map
│
├── build.js             # esbuild 构建脚本
├── package.json         # 项目配置
├── tsconfig.json        # TypeScript 配置
└── README.md            # 项目说明
```

## 核心模块说明

### Application.ts

主应用类，负责：
- 初始化扩展
- 管理全局状态
- 协调各个模块

```typescript
export class Application {
  constructor(context: vscode.ExtensionContext) {
    // 初始化
  }
  
  // 核心方法
}
```

### BookManager.ts

书籍管理器，负责：
- 书籍的增删改查
- 书籍元数据管理
- 阅读进度保存

### StatusBar.ts

状态栏控制器，负责：
- 状态栏 UI 渲染
- 阅读内容显示
- 控制按钮管理

### Parser.ts

文本解析器，负责：
- 读取和解析 txt 文件
- 处理不同编码
- 分页处理

## 构建系统

### esbuild 配置

项目使用 esbuild 进行快速构建：

```javascript
// build.js
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  target: 'node20',
  sourcemap: true,
  minify: production,
  // ...
});
```

### 构建模式

```bash
# 开发模式（带 sourcemap）
npm run build

# 生产模式（压缩）
npm run build -- --production

# 监听模式
npm run watch
```

## 测试

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试
npm test -- --grep "BookManager"
```

### 编写测试

```typescript
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Sample test', () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(0, [1, 2, 3].indexOf(1));
  });
});
```

## 打包和安装

### 打包 VSIX

```bash
# 打包扩展
npm run package

# 输出：GhostReader-2.0.0.vsix
```

### 本地安装

```bash
# 安装 VSIX 文件
code --install-extension GhostReader-2.0.0.vsix

# 或在 VSCode 中
# Extensions > ... > Install from VSIX
```

### 卸载

```bash
code --uninstall-extension wllzhang.GhostReader
```

## 常见问题

### Q: 修改代码后没有生效？

A: 
1. 确保 watch 模式正在运行
2. 在扩展开发主机中运行 "Developer: Reload Window"
3. 或者重新按 F5 启动调试

### Q: 找不到模块错误？

A:
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
```

### Q: TypeScript 报错？

A:
```bash
# 重新编译
npm run compile

# 检查 tsconfig.json 配置
```

### Q: 调试断点不生效？

A:
1. 确保 sourcemap 已生成（`dist/extension.js.map`）
2. 检查 launch.json 中的 `outFiles` 配置
3. 重启调试会话

### Q: 扩展激活失败？

A:
1. 检查 `package.json` 中的 `activationEvents`
2. 查看输出面板的错误信息
3. 确保所有依赖已安装

## 开发技巧

### 1. 使用 VSCode API 文档

官方文档：https://code.visualstudio.com/api

常用 API：
- `vscode.window` - 窗口相关
- `vscode.workspace` - 工作区相关
- `vscode.commands` - 命令相关
- `vscode.extensions` - 扩展相关

### 2. 使用 Console 调试

```typescript
console.log('Debug info:', data);
console.error('Error:', error);
console.warn('Warning:', warning);
```

输出会显示在扩展开发主机的输出面板中。

### 3. 使用 VSCode 命令

```typescript
// 注册命令
vscode.commands.registerCommand('GhostReader.test', () => {
  vscode.window.showInformationMessage('Test command');
});

// 执行命令
vscode.commands.executeCommand('GhostReader.test');
```

### 4. 使用配置

```typescript
// 读取配置
const config = vscode.workspace.getConfiguration('ghostReader');
const lines = config.get<number>('displayLines', 1);

// 监听配置变化
vscode.workspace.onDidChangeConfiguration(e => {
  if (e.affectsConfiguration('ghostReader')) {
    // 配置已更改
  }
});
```

## 性能优化

### 1. 延迟加载

```typescript
// 只在需要时加载大型模块
const heavyModule = await import('./heavy-module');
```

### 2. 缓存

```typescript
// 缓存计算结果
private cache = new Map<string, any>();

getResult(key: string): any {
  if (!this.cache.has(key)) {
    this.cache.set(key, this.compute(key));
  }
  return this.cache.get(key);
}
```

### 3. 异步操作

```typescript
// 使用异步操作避免阻塞
async function loadBook(path: string): Promise<Book> {
  const content = await fs.promises.readFile(path, 'utf8');
  return parseBook(content);
}
```

## 资源

- [VSCode API 文档](https://code.visualstudio.com/api)
- [扩展开发指南](https://code.visualstudio.com/api/get-started/your-first-extension)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [esbuild 文档](https://esbuild.github.io/)

---

如有问题，欢迎在 [GitHub Issues](https://github.com/wllzhang/GhostReader/issues) 中提问！

