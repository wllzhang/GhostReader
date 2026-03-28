# Changelog

All notable changes to GhostReader will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.5.3] - 2025-01-19

### Added

- ✨ 新增配置变化监听功能
  - 当用户修改 `displayLines`、`displayWidth` 或 `autoStopDelay` 配置时，自动更新当前阅读内容的显示
  - 无需重启扩展即可生效

### Changed

- ⚡ 优化代码质量和类型安全
  - 移除 `storage.ts` 中的 `any` 类型，改用泛型约束
  - 简化 `BookManager.loadBooks()` 的冗余检查逻辑
  - 优化 `StatusBar` 初始化逻辑，默认切换到 Coding 模式（避免在没有书籍时显示阅读控制）
  - 移除扩展激活时的提示消息，改善用户体验

### Fixed

- 🐛 修复 package.json 中的 linter 警告（移除不必要的 `activationEvents`）
- 🐛 改进空行处理逻辑，确保翻页时正确处理空行

## [2.5.1] - 2025-01-19

### Fixed

- 🐛 修复遇到空行时无法继续翻页的问题
  - 原因：`!line` 会将空字符串误判为到达末尾
  - 修复：改为 `line === undefined` 进行边界检查

## [2.5.0] - 2025-01-19

### Fixed

- 🐛 修复多行显示（`displayLines > 1`）时，翻页会出现重复内容的问题
- 🐛 修复中文字符显示宽度计算不正确的问题
  - 现在 `displayWidth` 按**显示宽度**计算，而非字符数
  - 中文、日文、韩文等全角字符计为 2 个宽度单位
  - 英文、数字等半角字符计为 1 个宽度单位
  - 例如：`displayWidth=50` 约显示 25 个中文字符或 50 个英文字符

### Changed

- ⚡ 优化翻页逻辑，`displayLines` 现在正确控制每次翻页跳过的段数

## [2.4.6] - 2024-12-xx

### Added

- ✨ 新增 `displayWidth` 配置项，控制状态栏每次显示的最大宽度
- ✨ 新增 `displayLines` 配置项，支持多行显示
- ✨ 新增 `autoStopDelay` 配置项，支持无操作后自动隐藏

### Changed

- 🔄 Reading/Coding 模式切换优化

## [2.4.0] - 2024-xx-xx

### Added

- ✨ 智能分页功能，长行自动拆分
- ✨ 进度保存功能，自动记住阅读位置

## [2.0.0] - 2024-xx-xx

### Added

- 🎉 全新架构重构
- ✨ 侧边栏书籍管理
- ✨ Reading/Coding 模式切换
- ✨ 快捷键翻页支持

## [1.0.0] - 2024-xx-xx

### Added

- 🎉 首次发布
- ✨ 基础状态栏阅读功能
- ✨ txt 文件导入支持

