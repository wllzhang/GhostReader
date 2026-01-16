import { ExtensionContext } from 'vscode';
import { BookManager } from './BookManager';
import { StatusBar } from './StatusBar';
import { Book } from './Book';
import { setupStorage } from '../utils/storage';
import type { BookData } from '../types';

/**
 * 应用主类（单例模式）
 * 负责管理整个扩展的核心功能
 */
export class Application {
  private static instance: Application;

  public readonly context: ExtensionContext;
  public readonly bookManager: BookManager;
  public readonly statusBar: StatusBar;
  public readingBook?: Book;

  private constructor(context: ExtensionContext) {
    this.context = context;

    // 初始化存储
    setupStorage(context);

    // 初始化状态栏
    this.statusBar = new StatusBar(context);

    // 初始化文本管理器
    this.bookManager = new BookManager(this);
  }

  /**
   * 获取应用实例
   */
  static getInstance(context?: ExtensionContext): Application {
    if (!Application.instance) {
      if (!context) {
        throw new Error('ExtensionContext is required for first initialization');
      }
      Application.instance = new Application(context);
    }
    return Application.instance;
  }

  /**
   * 设置当前阅读的文本
   */
  setReadingBook(book: Book | undefined): void {
    // 清理旧文本实例
    if (this.readingBook) {
      this.readingBook.dispose();
    }
    
    this.readingBook = book;
    const bookData: BookData | undefined = book ? book.book : undefined;
    this.statusBar.setCurrentBook(bookData);
  }

  /**
   * 销毁应用
   */
  dispose(): void {
    if (this.readingBook) {
      this.readingBook.dispose();
    }
    this.statusBar.dispose();
  }
}
