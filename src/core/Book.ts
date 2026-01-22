import { Parser } from './Parser';
import message from '../utils/message';
import { Config } from '../utils/config';
import {
  substringByDisplayWidth,
  getPrevCharIndexByDisplayWidth,
  getLastSegmentCharIndex,
} from '../utils/display';
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
    // 初始化 offset
    if (this.book.offset === undefined) {
      this.book.offset = 0;
    }
    this.init();
  }

  /**
   * 初始化文本：解析文件并显示内容
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
      
      // 自动切换到 Reading 模式（会自动显示阅读控制按钮并启动阅读）
      commands.executeCommand(Commands.SwitchReadingMode);

      this.initialized = true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      message.error(errorMessage || '解析文本文件失败！');
      this.initialized = false;
    }
  }

  /**
   * 上一页（智能分页）
   * 需要考虑 displayLines，一次后退多个段
   * offset 现在表示字符索引，而不是显示宽度
   */
  prevLine(): void {
    if (!this.checkReadable()) {
      return;
    }

    const displayWidth = Config.getDisplayWidth();
    const displayLines = Config.getDisplayLines();
    let currentProcess = this.book.process;
    let currentOffset = this.book.offset || 0;

    // 后退 displayLines 个段
    for (let i = 0; i < displayLines; i++) {
      if (currentOffset > 0) {
        // 当前行还有前面的内容，按显示宽度回退
        const line = this.contents[currentProcess];
        currentOffset = getPrevCharIndexByDisplayWidth(line, currentOffset, displayWidth);
      } else if (currentProcess > 0) {
        // 跳到上一原始行的最后一个分段
        currentProcess--;
        const prevLine = this.contents[currentProcess];
        // 计算上一行最后一个分段的起始字符索引
        currentOffset = getLastSegmentCharIndex(prevLine, displayWidth);
      } else {
        // 已经到第一页了
        if (i === 0) {
          message('已经是第一页了');
          return;
        }
        break;
      }
    }

    this.book.process = currentProcess;
    this.book.offset = currentOffset;
    this.updateDisplay();
  }

  /**
   * 下一页（智能分页）
   * 需要考虑 displayLines，一次前进多个段
   * offset 现在表示字符索引，而不是显示宽度
   */
  nextLine(): void {
    if (!this.checkReadable()) {
      return;
    }

    const displayWidth = Config.getDisplayWidth();
    const displayLines = Config.getDisplayLines();
    let currentProcess = this.book.process;
    let currentOffset = this.book.offset || 0;
    
    // 前进 displayLines 个段
    for (let i = 0; i < displayLines; i++) {
      const line = this.contents[currentProcess];
      if (line === undefined) break;
      
      // 按显示宽度截取，获取下一个字符索引
      const { endCharIndex } = substringByDisplayWidth(line, currentOffset, displayWidth);
      
      if (endCharIndex >= line.length) {
        // 当前行已经读完，跳到下一行
        if (currentProcess < this.contents.length - 1) {
          currentProcess++;
          currentOffset = 0;
        } else {
          // 已经到最后了
          if (i === 0) {
            message('已经是最后一页了');
            return;
          }
          break;
        }
      } else {
        // 当前行还有剩余内容
        currentOffset = endCharIndex;
      }
    }

    this.book.process = currentProcess;
    this.book.offset = currentOffset;
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
   * offset 现在表示字符索引，按显示宽度截取内容
   */
  updateDisplay(): void {
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
      
      // 处理空行：空行也算一行，跳过到下一行
      if (line === undefined || line.length === 0) {
        linesCollected++;
        currentProcess++;
        currentOffset = 0;
        continue;
      }
      
      // 按显示宽度截取
      const { text: segment, endCharIndex } = substringByDisplayWidth(
        line,
        currentOffset,
        displayWidth
      );
      
      // 如果截取到内容，添加到显示文本中
      if (segment) {
        content += (content ? ' ' : '') + segment;
        linesCollected++;
      }
      
      // 检查是否需要继续到下一行
      if (endCharIndex >= line.length) {
        currentProcess++;
        currentOffset = 0;
      } else {
        currentOffset = endCharIndex;
        // 如果当前行还有剩余内容但已经收集够了，跳出循环
        if (linesCollected >= displayLines) {
          break;
        }
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
        // 切换到 Coding 模式（会自动暂停阅读并隐藏控制按钮）
        commands.executeCommand(Commands.SwitchCodingMode);
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
