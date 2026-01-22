import { window, commands } from 'vscode';
import path from 'path';
import { BookTreeProvider, BookTreeItem } from './BookTree';
import { Book } from './Book';
import message from '../utils/message';
import { getStorage, setStorage } from '../utils/storage';
import { generateId } from '../utils/id';
import type { Application } from './Application';
import type { BookData } from '../types';
import { Commands } from '../types';

/**
 * 文本管理器
 * 负责阅读列表的增删改查和树视图更新
 */
export class BookManager {
  private books: BookData[];
  private treeProvider: BookTreeProvider;

  constructor(private app: Application) {
    this.books = this.loadBooks();
    this.treeProvider = new BookTreeProvider(() => this.books);
    this.initTreeView();
    this.registerCommands();
  }

  /**
   * 从存储加载文本列表
   */
  private loadBooks(): BookData[] {
    const stored = getStorage<BookData[]>('books');
    if (!stored) {
      setStorage('books', []);
      return [];
    }
    return stored;
  }

  /**
   * 初始化树视图
   */
  private initTreeView(): void {
    this.treeProvider.refresh();
    window.registerTreeDataProvider('bookList', this.treeProvider);
  }

  /**
   * 注册命令
   */
  private registerCommands(): void {
    this.app.context.subscriptions.push(
      commands.registerCommand(Commands.OpenBook, (event: BookTreeItem) => {
        this.openBook(event);
      })
    );

    this.app.context.subscriptions.push(
      commands.registerCommand(Commands.DeleteBook, (event: BookTreeItem) => {
        this.deleteBook(event.id);
      })
    );

    this.app.context.subscriptions.push(
      commands.registerCommand(Commands.ImportBook, () => {
        this.addBook();
      })
    );

    this.app.context.subscriptions.push(
      commands.registerCommand(Commands.RefreshBookList, () => {
        this.refreshTreeView();
        message('阅读列表已刷新！');
      })
    );
  }

  /**
   * 打开文本
   */
  private openBook(bookItem: BookTreeItem): void {
    const { id, name, process, offset, url } = bookItem;
    const book = new Book({ id, name, process, offset, url }, this.app);
    this.app.setReadingBook(book);
  }

  /**
   * 刷新树视图
   */
  private refreshTreeView(): void {
    this.treeProvider.refresh();
  }

  /**
   * 删除文本
   */
  deleteBook(id: string): void {
    this.books = this.books.filter((book) => book.id !== id);
    this.saveBooks();
    this.refreshTreeView();
    message('删除成功！');
  }

  /**
   * 更新阅读进度
   */
  updateBookProgress(id: string, process: number, offset?: number): void {
    const book = this.books.find((b) => b.id === id);
    if (book) {
      book.process = process;
      book.offset = offset ?? 0;
      this.saveBooks();
      this.refreshTreeView();
    }
  }

  /**
   * 添加文本
   */
  async addBook(): Promise<void> {
    const files = await window.showOpenDialog({
      title: '选择文本文件',
      filters: {
        file: ['txt'],
      },
    });

    if (files && files.length > 0) {
      const file = files[0];
      const book: BookData = {
        name: path.parse(file.path).base,
        id: generateId(),
        process: 0,
        url: file.fsPath,
      };

      this.books.push(book);
      this.saveBooks();
      this.refreshTreeView();
      message(`Added book: ${book.name}`);
    }
  }

  /**
   * 保存文本列表到存储
   */
  private saveBooks(): void {
    setStorage('books', this.books);
  }

  /**
   * 获取所有文本
   */
  getBooks(): BookData[] {
    return this.books;
  }
}
