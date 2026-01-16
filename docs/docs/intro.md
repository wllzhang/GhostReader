---
sidebar_position: 1
---

# Ghost READER 简介

Ghost READER 是一款 VS Code 插件，让你可以在状态栏阅读文本。

## 功能特性

- **状态栏阅读** - 内容显示在状态栏，低调不影响工作
- **翻页控制** - 支持上一行/下一行快捷键翻页
- **跳转功能** - 可以跳转到指定页码
- **阅读模式切换** - Reading 和 Coding 模式随时切换，一键控制阅读状态和快捷键

## 快速开始

### 安装

在 VS Code 扩展市场搜索 "GhostReader" 并安装。

![安装插件](/install.png)

### 导入文本

1. 点击活动栏中的 Ghost READER 图标
2. 点击阅读列表标题栏的 "+" 按钮导入 TXT 文件

### 开始阅读

1. 点击阅读列表中的文本，会自动切换到 Reading 模式并开始阅读
2. 使用 `Ctrl+Left` / `Ctrl+Right` 翻页（Mac: `Cmd+Left` / `Cmd+Right`）
3. 点击状态栏的 Coding 按钮可停止阅读并隐藏内容

## 配置选项

| 选项                        | 描述                                        | 默认值 |
| --------------------------- | ------------------------------------------- | ------ |
| `ghostReader.displayLines`  | 每次在状态栏显示的行数                      | 1      |
| `ghostReader.autoStopDelay` | 停留在当前行多少秒后自动停止（0为永不停止） | 0      |
