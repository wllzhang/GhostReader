import { Parser } from './Parser';
import message from '../utils/message';
import { Config } from '../utils/config';
import { commands } from 'vscode';
import { Commands } from '../types';
import type { Application } from './Application';
import type { BookData } from '../types';

/**
 * 文本类
 * 负责单个文本的加载、阅读和翻页
 */
export class Book {
  public book: BookData;
  public contents: string[] = [];
  public isReading: boolean = true;
  private initialized: boolean = false;
  private autoStopTimer?: NodeJS.Timeout;

  constructor(
    book: BookData,
    private app: Application
  ) {
    this.book = book;
    this.init();
  }

  /**
   * 初始化文本：解析文件并显示内容
   */
  private async init(): Promise<void> {
    try {
      const parser = new Parser(this.book.url);
      this.contents = await parser.parseFile();

      // 兼容分段算法导致的文件最大值改变
      this.book.process = Math.min(this.book.process, this.contents.length - 1);

      message(`Switch to 《${this.book.name}》!`);

      // 使用 updateDisplay 来应用配置
      this.updateDisplay();
      
      // 自动显示阅读控制按钮并切换到 Reading 模式
      this.app.statusBar.showReadingControls();
      commands.executeCommand(Commands.SwitchReadingMode);

      this.initialized = true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      message.error(errorMessage || '解析文本文件失败！');
      this.initialized = false;
    }
  }

  /**
   * 上一行
   */
  prevLine(): void {
    if (!this.checkReadable()) {
      return;
    }

    if (this.book.process < 1) {
      message('已经是第一页了');
      return;
    }

    this.book.process--;
    this.updateDisplay();
  }

  /**
   * 下一行
   */
  nextLine(): void {
    if (!this.checkReadable()) {
      return;
    }

    if (this.book.process >= this.contents.length - 1) {
      message('已经是最后一页了');
      return;
    }

    this.book.process++;
    this.updateDisplay();
  }

  /**
   * 跳转到指定行
   */
  jumpLine(process: number): void {
    if (!this.checkReadable()) {
      return;
    }

    if (process < 0 || process >= this.contents.length) {
      message('无效的页码！');
      return;
    }

    this.book.process = process;
    this.updateDisplay();
  }

  /**
   * 更新显示
   */
  private updateDisplay(): void {
    // 清除之前的自动停止定时器
    this.clearAutoStopTimer();

    // 获取要显示的行数
    const displayLines = Config.getDisplayLines();
    const startIndex = this.book.process;
    const endIndex = Math.min(startIndex + displayLines, this.contents.length);
    
    // 合并多行内容
    const lines = this.contents.slice(startIndex, endIndex);
    const content = lines.join(' ');
    
    this.app.statusBar.updateContent(content);
    this.app.statusBar.updateProgress(this.book.process, this.contents.length, this.book);
    this.app.bookManager.updateBookProgress(this.book.id, this.book.process);

    // 设置自动停止定时器
    this.startAutoStopTimer();
  }

  /**
   * 启动自动停止定时器
   */
  private startAutoStopTimer(): void {
    const delay = Config.getAutoStopDelay();
    
    // 如果延迟为0，则不启动定时器
    if (delay <= 0) {
      return;
    }

    this.autoStopTimer = setTimeout(() => {
      if (this.isReading) {
        this.pause();
        this.app.statusBar.hideReadingControls();
        message('已自动停止阅读');
      }
    }, delay * 1000); // 转换为毫秒
  }

  /**
   * 清除自动停止定时器
   */
  private clearAutoStopTimer(): void {
    if (this.autoStopTimer) {
      clearTimeout(this.autoStopTimer);
      this.autoStopTimer = undefined;
    }
  }

  /**
   * 检查是否可读
   */
  private checkReadable(): boolean {
    if (!this.isReading) {
      return false;
    }

    if (!this.initialized) {
      message.warn(`《${this.book.name}》Initializing failed!`);
      return false;
    }

    return true;
  }

  /**
   * 暂停阅读
   */
  pause(): void {
    this.isReading = false;
    this.clearAutoStopTimer();
  }

  /**
   * 开始阅读
   */
  start(): void {
    this.isReading = true;
    this.updateDisplay();
  }

  /**
   * 销毁文本实例
   */
  dispose(): void {
    this.clearAutoStopTimer();
  }
}
