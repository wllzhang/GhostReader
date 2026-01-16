# 快速开始

欢迎使用 GhostReader！本指南将帮助你快速上手使用。

## 安装

### 方式一：从 VSCode 市场安装（推荐）

1. 打开 VSCode
2. 按 `Ctrl+P` (Windows/Linux) 或 `Cmd+P` (Mac)
3. 输入以下命令并回车：

```bash
ext install wllzhang.GhostReader
```

或者在扩展面板搜索 "GhostReader" 并安装。

### 方式二：从 VSIX 文件安装

如果你已经下载了 `.vsix` 文件，可以使用以下命令安装：

```bash
code --install-extension GhostReader-2.0.0.vsix
```

## 第一次使用

### 1. 找到扩展入口

安装成功后，你会在 VSCode 左侧活动栏看到 GhostReader 的图标：

![Install](../docs/install.png)

点击图标打开书架视图。

### 2. 导入书籍

1. 点击书架视图顶部的 **➕ 按钮**
2. 在文件选择器中选择一个 `.txt` 格式的小说文件
3. 等待导入完成

::: tip 提示
建议使用 UTF-8 编码的 txt 文件以获得最佳阅读体验。
:::

### 3. 开始阅读

在书架中点击已导入的书籍，即可开始阅读。阅读内容会显示在 VSCode 底部的状态栏中。

### 4. 切换阅读模式

在状态栏中可以看到两个模式按钮：

- **📖 Reading mode** - 启用阅读快捷键
- **💻 Coding mode** - 禁用阅读快捷键（默认）

点击 **Reading mode** 激活快捷键模式。

![Status Bar](../docs/status.png)

### 5. 使用快捷键翻页

在 Reading mode 下，可以使用以下快捷键：

| 操作 | Windows/Linux | macOS |
|------|---------------|-------|
| 上一页 | `Ctrl+Left` | `Cmd+Left` |
| 下一页 | `Ctrl+Right` | `Cmd+Right` |

![Quick Keys](../docs/quickkey.png)

::: warning 注意
必须先切换到 **Reading mode** 才能使用快捷键！否则快捷键会与编码时的操作冲突。
:::

## 基本操作

### 翻页

- **快捷键翻页**：在 Reading mode 下使用 `Ctrl+Left/Right` (或 `Cmd+Left/Right`)
- **按钮翻页**：点击状态栏的 `◀` 和 `▶` 按钮

### 跳转到指定页码

1. 点击状态栏的 **跳转** 按钮
2. 在弹出的输入框中输入页码
3. 按回车确认

### 暂停/继续阅读

点击状态栏的 **⏸** (暂停) 或 **▶** (播放) 按钮。

::: tip 提示
暂停阅读后会自动切换回 Coding mode，避免影响正常编码工作。
:::

### 管理书架

- **删除书籍**：在书架中右键点击书籍，选择删除
- **刷新书架**：点击书架视图顶部的 **🔄 刷新** 按钮

## 下一步

- 了解更多[功能介绍](./features.md)
- 查看[配置选项](./configuration.md)
- 探索[开发指南](../development/contributing.md)

## 常见问题

### Q: 为什么导入书籍后看不到内容？

A: 请检查：
1. 文件是否为 `.txt` 格式
2. 文件编码是否为 UTF-8
3. 文件是否有内容

### Q: 快捷键不起作用？

A: 请确保：
1. 已经切换到 **Reading mode**
2. 快捷键没有与其他扩展冲突
3. VSCode 窗口处于激活状态

### Q: 如何设置自动隐藏阅读内容？

A: 在 VSCode 设置中搜索 `ghostReader.autoStopDelay`，设置秒数即可。详见[配置选项](./configuration.md)。

