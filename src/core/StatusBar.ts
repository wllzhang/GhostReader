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
import type { Application } from './Application';

/**
 * 统一的状态栏管理器
 * 负责创建和管理所有状态栏项
 */
export class StatusBar {
  // 状态栏项
  private contentItem!: StatusBarItem;
  private progressItem!: StatusBarItem;
  private prevLineItem!: StatusBarItem;
  private nextLineItem!: StatusBarItem;
  private jumpLineItem!: StatusBarItem;
  private codingModeItem!: StatusBarItem;
  private readingModeItem!: StatusBarItem;

  private currentBook?: BookData;
  private app?: Application;

  constructor(private context: ExtensionContext) {
    this.initialize();
  }

  /**
   * 设置应用实例引用
   */
  setApp(app: Application): void {
    this.app = app;
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
    this.updateContent('请选择要阅读的文本！');
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
   * 创建控制按钮（翻页、跳转）
   */
  private createControlItems(): void {
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
    // 切换到 Reading 模式（相当于 Start）
    this.context.subscriptions.push(
      commands.registerCommand(Commands.SwitchReadingMode, () => {
        commands.executeCommand('setContext', CustomWhenClauseContext.IsReadingMode, isReadingMode);
        this.readingModeItem.show();
        this.codingModeItem.hide();
        
        // 启动阅读功能
        if (this.app?.readingBook) {
          this.app.readingBook.start();
          this.showReadingControls();
        }
      })
    );

    // 切换到 Coding 模式（相当于 Stop）
    this.context.subscriptions.push(
      commands.registerCommand(Commands.SwitchCodingMode, () => {
        commands.executeCommand(
          'setContext',
          CustomWhenClauseContext.IsReadingMode,
          !isReadingMode
        );
        this.readingModeItem.hide();
        this.codingModeItem.show();
        
        // 暂停阅读功能
        if (this.app?.readingBook) {
          this.app.readingBook.pause();
          this.hideReadingControls();
        }
      })
    );
  }

  /**
   * 显示阅读控制按钮
   */
  showReadingControls(): void {
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
    this.contentItem.hide();
    this.prevLineItem.hide();
    this.nextLineItem.hide();
    this.jumpLineItem.hide();
    this.progressItem.hide();
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
   * 设置当前文本（用于 tooltip 显示）
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
    this.prevLineItem.dispose();
    this.nextLineItem.dispose();
    this.jumpLineItem.dispose();
    this.codingModeItem.dispose();
    this.readingModeItem.dispose();
  }
}
