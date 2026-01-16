# 配置选项

GhostReader 提供了灵活的配置选项，让你可以根据自己的需求定制阅读体验。

## 访问设置

有两种方式打开 GhostReader 的配置：

### 方式一：通过设置界面

1. 打开 VSCode 设置（`Ctrl+,` 或 `Cmd+,`）
2. 在搜索框输入 "GhostReader"
3. 修改对应的配置项

![Configuration](../docs/args.png)

### 方式二：通过 settings.json

1. 打开命令面板（`Ctrl+Shift+P` 或 `Cmd+Shift+P`）
2. 输入 "Preferences: Open User Settings (JSON)"
3. 添加或修改配置

```json
{
  "ghostReader.displayLines": 1,
  "ghostReader.autoStopDelay": 0
}
```

---

## 配置项详解

### 显示行数

**配置键：** `ghostReader.displayLines`

**类型：** `number`

**默认值：** `1`

**取值范围：** `1-10`

**说明：**
设置每次在状态栏显示的行数。增加此值可以一次看到更多内容。

**示例：**

```json
{
  "ghostReader.displayLines": 3
}
```

**使用场景：**

| 行数 | 适用场景 |
|------|---------|
| 1 | 简短句子、最大隐蔽性 |
| 2-3 | 平衡阅读体验和隐蔽性 |
| 4-5 | 诗歌、对话场景 |
| 6-10 | 快速阅读、大屏幕 |

::: tip 提示
显示行数越多，内容越明显。如果需要更高的隐蔽性，建议保持默认值 1。
:::

---

### 自动停止延迟

**配置键：** `ghostReader.autoStopDelay`

**类型：** `number`

**默认值：** `0`

**取值范围：** `0` 或任意正整数（单位：秒）

**说明：**
设置停留在当前行多少秒后自动停止阅读。设置为 0 表示永不自动停止。

**示例：**

```json
{
  "ghostReader.autoStopDelay": 30
}
```

**使用场景：**

| 延迟时间 | 适用场景 |
|---------|---------|
| 0 | 不需要自动停止 |
| 15-30 秒 | 一般办公环境 |
| 60-120 秒 | 较为宽松的环境 |
| 300+ 秒 | 个人开发环境 |

::: warning 注意
自动停止后会自动切换回 Coding mode，需要重新激活 Reading mode 才能继续使用快捷键。
:::

**工作原理：**
当你在指定时间内没有进行翻页操作时，GhostReader 会：
1. 隐藏状态栏的阅读内容
2. 自动切换到 Coding mode
3. 保存当前阅读进度

---

## 配置示例

### 示例一：隐蔽摸鱼配置

适合需要高度隐蔽的办公环境。

```json
{
  "ghostReader.displayLines": 1,
  "ghostReader.autoStopDelay": 20
}
```

**特点：**
- 单行显示，不易被发现
- 20 秒自动停止，安全性高

---

### 示例二：舒适阅读配置

适合相对宽松的环境，追求更好的阅读体验。

```json
{
  "ghostReader.displayLines": 3,
  "ghostReader.autoStopDelay": 0
}
```

**特点：**
- 多行显示，阅读体验更好
- 不自动停止，专注阅读

---

### 示例三：平衡配置

平衡隐蔽性和阅读体验。

```json
{
  "ghostReader.displayLines": 2,
  "ghostReader.autoStopDelay": 60
}
```

**特点：**
- 双行显示，适中
- 1 分钟自动停止，较为安全

---

## 快捷键配置

### 查看当前快捷键

1. 打开键盘快捷键设置（`Ctrl+K Ctrl+S` 或 `Cmd+K Cmd+S`）
2. 搜索 "GhostReader"
3. 查看所有相关快捷键

### 默认快捷键

| 命令 | Windows/Linux | macOS | 条件 |
|------|---------------|-------|------|
| 上一页 | `Ctrl+Left` | `Cmd+Left` | Reading mode |
| 下一页 | `Ctrl+Right` | `Cmd+Right` | Reading mode |

### 自定义快捷键

**方式一：通过界面设置**

1. 在快捷键设置中找到对应命令
2. 点击编辑图标
3. 按下新的快捷键组合
4. 按回车保存

**方式二：通过 keybindings.json**

```json
[
  {
    "key": "ctrl+alt+left",
    "command": "GhostReader.prev",
    "when": "GhostReader.isReadingMode == true"
  },
  {
    "key": "ctrl+alt+right",
    "command": "GhostReader.next",
    "when": "GhostReader.isReadingMode == true"
  }
]
```

**可配置的命令：**

| 命令 ID | 说明 |
|---------|-----|
| `GhostReader.prev` | 上一页 |
| `GhostReader.next` | 下一页 |
| `GhostReader.jump` | 跳转到页码 |
| `GhostReader.switchReadingMode` | 切换到阅读模式 |
| `GhostReader.switchCodingMode` | 切换到编码模式 |
| `GhostReader.import` | 导入书籍 |
| `GhostReader.deleteEntry` | 删除书籍 |
| `GhostReader.refreshBookList` | 刷新书架 |

::: tip 提示
设置快捷键时，建议选择不会与其他常用操作冲突的组合键。
:::

---

## 工作区配置

如果你想为不同的工作区设置不同的配置，可以使用工作区设置。

**操作步骤：**

1. 打开命令面板
2. 输入 "Preferences: Open Workspace Settings (JSON)"
3. 添加工作区特定的配置

**示例：**

```json
{
  "ghostReader.displayLines": 5,
  "ghostReader.autoStopDelay": 0
}
```

::: info 说明
工作区设置的优先级高于用户设置。
:::

---

## 重置配置

如果配置出现问题，可以重置为默认值。

**操作步骤：**

1. 打开 VSCode 设置
2. 搜索 "GhostReader"
3. 点击每个配置项右侧的 **重置** 图标
4. 或者删除 `settings.json` 中的相关配置

---

## 配置建议

### 根据屏幕尺寸调整

| 屏幕尺寸 | 建议显示行数 |
|----------|-------------|
| 13-14 寸 | 1-2 行 |
| 15-16 寸 | 2-3 行 |
| 17+ 寸或外接显示器 | 3-5 行 |

### 根据办公环境调整

| 环境类型 | 建议配置 |
|----------|----------|
| 开放式办公区 | displayLines: 1, autoStopDelay: 15-30 |
| 隔间/小办公室 | displayLines: 2, autoStopDelay: 30-60 |
| 独立办公室 | displayLines: 3-5, autoStopDelay: 0 |
| 远程办公/家里 | displayLines: 5+, autoStopDelay: 0 |

---

## 常见问题

### Q: 修改配置后没有生效？

A: 尝试以下步骤：
1. 重新打开书籍
2. 重载 VSCode 窗口（`Developer: Reload Window`）
3. 检查配置语法是否正确

### Q: 配置文件在哪里？

A: 
- **用户设置**：`%APPDATA%\Code\User\settings.json` (Windows)
- **用户设置**：`~/Library/Application Support/Code/User/settings.json` (macOS)
- **用户设置**：`~/.config/Code/User/settings.json` (Linux)
- **工作区设置**：`.vscode/settings.json`（项目根目录）

### Q: 如何导出我的配置？

A: 
1. 打开 `settings.json`
2. 复制 GhostReader 相关的配置
3. 保存到其他地方

---

## 反馈

如果你有配置相关的问题或建议，欢迎提交 [Issue](https://github.com/wllzhang/GhostReader/issues)。

