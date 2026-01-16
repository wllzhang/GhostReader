import {
  window,
  StatusBarAlignment,
  StatusBarItem,
  ExtensionContext,
  commands,
  MarkdownString,
} from 'vscode';
import {
  Commands,
  CustomWhenClauseContext,
  isReadingMode,
  StatusBarPriority,
  type BookData,
} from '../types';

/**
 * 统一的状态栏管理器
 * 负责创建和管理所有状态栏项
 */
export class StatusBar {
  // 状态栏项
  private contentItem!: StatusBarItem;
  private progressItem!: StatusBarItem;
  private startItem!: StatusBarItem;
  private stopItem!: StatusBarItem;
  private prevLineItem!: StatusBarItem;
  private nextLineItem!: StatusBarItem;
  private jumpLineItem!: StatusBarItem;
  private codingModeItem!: StatusBarItem;
  private readingModeItem!: StatusBarItem;

  private currentBook?: BookData;

  constructor(private context: ExtensionContext) {
    this.initialize();
  }

  /**
   * 初始化所有状态栏项和命令
   */
  private initialize(): void {
    this.createContentItem();
    this.createProgressItem();
    this.createControlItems();
    this.createModeItems();
    this.registerCommands();

    // 默认为 Reading 模式
    commands.executeCommand(Commands.SwitchReadingMode);
  }

  /**
   * 创建内容显示项
   */
  private createContentItem(): void {
    this.contentItem = window.createStatusBarItem();
    this.contentItem.show();
    this.context.subscriptions.push(this.contentItem);
    this.updateContent('请选择要阅读的书籍！');
  }

  /**
   * 创建进度显示项
   */
  private createProgressItem(): void {
    this.progressItem = window.createStatusBarItem(
      StatusBarAlignment.Right,
      StatusBarPriority.Process
    );
    this.progressItem.text = '';
    this.progressItem.show();
    this.context.subscriptions.push(this.progressItem);
  }

  /**
   * 创建控制按钮（开始、停止、翻页、跳转）
   */
  private createControlItems(): void {
    // 开始按钮
    this.startItem = window.createStatusBarItem(StatusBarAlignment.Right, StatusBarPriority.Start);
    this.startItem.command = Commands.Start;
    this.startItem.text = '$(run)';
    this.startItem.tooltip = 'Start';
    this.context.subscriptions.push(this.startItem);

    // 停止按钮
    this.stopItem = window.createStatusBarItem(StatusBarAlignment.Right, StatusBarPriority.Stop);
    this.stopItem.command = Commands.Stop;
    this.stopItem.text = '$(stop-circle)';
    this.stopItem.tooltip = 'Stop';
    this.context.subscriptions.push(this.stopItem);

    // 下一行按钮
    this.nextLineItem = window.createStatusBarItem(
      StatusBarAlignment.Right,
      StatusBarPriority.NextLine
    );
    this.nextLineItem.command = Commands.NextLine;
    this.nextLineItem.text = '$(chevron-right)';
    this.nextLineItem.tooltip = 'Next Line';
    this.context.subscriptions.push(this.nextLineItem);

    // 上一行按钮
    this.prevLineItem = window.createStatusBarItem(
      StatusBarAlignment.Right,
      StatusBarPriority.PrevLine
    );
    this.prevLineItem.command = Commands.PrevLine;
    this.prevLineItem.text = '$(chevron-left)';
    this.prevLineItem.tooltip = 'Previous Line';
    this.context.subscriptions.push(this.prevLineItem);
    // 跳转按钮
    this.jumpLineItem = window.createStatusBarItem(
      StatusBarAlignment.Right,
      StatusBarPriority.JumpLine
    );
    this.jumpLineItem.command = Commands.JumpLine;
    this.jumpLineItem.text = '$(fold)';
    this.jumpLineItem.tooltip = 'Jump to Line';
    this.context.subscriptions.push(this.jumpLineItem);
  }

  /**
   * 创建模式切换项（Reading/Coding）
   */
  private createModeItems(): void {
    // Coding 模式
    this.codingModeItem = window.createStatusBarItem(
      StatusBarAlignment.Right,
      StatusBarPriority.ActiveKeyBind
    );
    this.codingModeItem.command = Commands.SwitchReadingMode;
    this.codingModeItem.text = '$(code) Coding';
    this.codingModeItem.tooltip = 'To Reading mode';
    this.codingModeItem.show();
    this.context.subscriptions.push(this.codingModeItem);

    // Reading 模式
    this.readingModeItem = window.createStatusBarItem(
      StatusBarAlignment.Right,
      StatusBarPriority.DisableKeyBind
    );
    this.readingModeItem.command = Commands.SwitchCodingMode;
    this.readingModeItem.text = '$(vr) Reading';
    this.readingModeItem.tooltip = 'To Coding mode';
    this.readingModeItem.show();
    this.context.subscriptions.push(this.readingModeItem);
  }

  /**
   * 注册所有命令
   */
  private registerCommands(): void {
    // 模式切换命令
    this.context.subscriptions.push(
      commands.registerCommand(Commands.SwitchReadingMode, () => {
        commands.executeCommand('setContext', CustomWhenClauseContext.IsReadingMode, isReadingMode);
        this.readingModeItem.show();
        this.codingModeItem.hide();
      })
    );

    this.context.subscriptions.push(
      commands.registerCommand(Commands.SwitchCodingMode, () => {
        commands.executeCommand(
          'setContext',
          CustomWhenClauseContext.IsReadingMode,
          !isReadingMode
        );
        this.readingModeItem.hide();
        this.codingModeItem.show();
      })
    );
  }

  /**
   * 显示阅读控制按钮
   */
  showReadingControls(): void {
    this.startItem.hide();
    this.stopItem.show();
    this.contentItem.show();
    this.prevLineItem.show();
    this.nextLineItem.show();
    this.jumpLineItem.show();
    this.progressItem.show();
  }

  /**
   * 隐藏阅读控制按钮
   */
  hideReadingControls(): void {
    this.stopItem.hide();
    this.startItem.show();
    this.contentItem.hide();
    this.prevLineItem.hide();
    this.nextLineItem.hide();
    this.jumpLineItem.hide();
    this.progressItem.hide();

    // 自动切换到 Coding 模式
    commands.executeCommand(Commands.SwitchCodingMode);
  }

  /**
   * 更新内容显示
   */
  updateContent(content: string): void {
    this.contentItem.text = content;

    // 创建 Markdown tooltip，使用技巧让 hover 不隐藏
    const mk = `
  |      |
  | :--- |
  | []() ${content} |
  `;
    const tooltip = new MarkdownString(mk, true);
    tooltip.supportHtml = true;
    tooltip.isTrusted = true;

    if (this.currentBook) {
      tooltip.appendMarkdown(`\n\n---\n\n《${this.currentBook.name}》`);
    }

    this.contentItem.tooltip = tooltip;
  }

  /**
   * 更新进度显示
   */
  updateProgress(current: number, total: number, book: BookData): void {
    this.currentBook = book;
    this.progressItem.text = `${current || 0}/${total}`;
    const percent = `${((current / total) * 100).toFixed(2)}%`;
    this.progressItem.tooltip = `《${book.name}》${percent}`;
  }

  /**
   * 设置当前书籍（用于 tooltip 显示）
   */
  setCurrentBook(book: BookData | undefined): void {
    this.currentBook = book;
  }

  /**
   * 销毁所有状态栏项
   */
  dispose(): void {
    this.contentItem.dispose();
    this.progressItem.dispose();
    this.startItem.dispose();
    this.stopItem.dispose();
    this.prevLineItem.dispose();
    this.nextLineItem.dispose();
    this.jumpLineItem.dispose();
    this.codingModeItem.dispose();
    this.readingModeItem.dispose();
  }
}
