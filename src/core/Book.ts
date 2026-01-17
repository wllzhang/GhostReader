import { Parser } from './Parser';
import message from '../utils/message';
import { Config } from '../utils/config';
import { commands } from 'vscode';
import { Commands } from '../types';
import type { Application } from './Application';
import type { BookData } from '../types';

/**
 * 书籍类
 * 负责单本书籍的加载、阅读和翻页
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
    // 初始化 offset
    if (this.book.offset === undefined) {
      this.book.offset = 0;
    }
    this.init();
  }

  /**
   * 初始化书籍：解析文件并显示内容
   */
  private async init(): Promise<void> {
    try {
      const parser = new Parser(this.book.url);
      this.contents = await parser.parseFile();

      // 兼容：确保 process 不超过总行数
      this.book.process = Math.min(this.book.process, this.contents.length - 1);
      // 确保 offset 有效
      this.book.offset = this.book.offset || 0;

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
   * 获取当前行内容
   */
  private getCurrentLine(): string {
    return this.contents[this.book.process] || '';
  }

  /**
   * 获取当前行剩余字符数
   */
  private getRemainingLength(): number {
    const line = this.getCurrentLine();
    const offset = this.book.offset || 0;
    return Math.max(0, line.length - offset);
  }

  /**
   * 上一页（智能分页）
   */
  prevLine(): void {
    if (!this.checkReadable()) {
      return;
    }

    const displayWidth = Config.getDisplayWidth();
    const offset = this.book.offset || 0;

    if (offset > 0) {
      // 当前行还有前面的内容，回退 offset
      this.book.offset = Math.max(0, offset - displayWidth);
    } else if (this.book.process > 0) {
      // 跳到上一原始行的最后一个分段
      this.book.process--;
      const prevLine = this.getCurrentLine();
      // 计算上一行最后一个分段的起始 offset
      if (prevLine.length > displayWidth) {
        const segments = Math.ceil(prevLine.length / displayWidth);
        this.book.offset = (segments - 1) * displayWidth;
      } else {
        this.book.offset = 0;
      }
    } else {
      message('已经是第一页了');
      return;
    }

    this.updateDisplay();
  }

  /**
   * 下一页（智能分页）
   */
  nextLine(): void {
    if (!this.checkReadable()) {
      return;
    }

    const displayWidth = Config.getDisplayWidth();
    const offset = this.book.offset || 0;
    const remaining = this.getRemainingLength();

    if (remaining > displayWidth) {
      // 当前行还有剩余内容，增加 offset
      this.book.offset = offset + displayWidth;
    } else if (this.book.process < this.contents.length - 1) {
      // 跳到下一原始行
      this.book.process++;
      this.book.offset = 0;
    } else {
      message('已经是最后一页了');
      return;
    }

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
    this.book.offset = 0; // 跳转时重置 offset
    this.updateDisplay();
  }

  /**
   * 更新显示（智能分页）
   */
  private updateDisplay(): void {
    // 清除之前的自动停止定时器
    this.clearAutoStopTimer();

    const displayWidth = Config.getDisplayWidth();
    const displayLines = Config.getDisplayLines();
    const offset = this.book.offset || 0;
    
    // 收集要显示的内容
    let content = '';
    let currentProcess = this.book.process;
    let currentOffset = offset;
    let linesCollected = 0;

    while (linesCollected < displayLines && currentProcess < this.contents.length) {
      const line = this.contents[currentProcess];
      const segment = line.substring(currentOffset, currentOffset + displayWidth);
      
      if (segment) {
        content += (content ? ' ' : '') + segment;
        linesCollected++;
      }
      
      // 检查是否需要继续到下一行
      if (currentOffset + displayWidth >= line.length) {
        currentProcess++;
        currentOffset = 0;
      } else {
        currentOffset += displayWidth;
      }
    }
    
    this.app.statusBar.updateContent(content);
    this.app.statusBar.updateProgress(this.book.process, this.contents.length, this.book);
    this.app.bookManager.updateBookProgress(this.book.id, this.book.process, this.book.offset);

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
   * 销毁书籍实例
   */
  dispose(): void {
    this.clearAutoStopTimer();
  }
}
