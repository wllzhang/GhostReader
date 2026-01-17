import * as vscode from 'vscode';
import { Commands, type BookData } from '../types';

export class BookTreeItem extends vscode.TreeItem {
  constructor(
    public name: string,
    public override id: string,
    public url: string,
    public process: number = 0,
    public offset: number = 0
  ) {
    super(name, vscode.TreeItemCollapsibleState.None);

    this.name = name;
    this.id = id;
    this.url = url;
    this.label = `《${this.name}》`;
    this.process = process;
    this.offset = offset;
    this.tooltip = `${this.url}`;
    this.iconPath = new vscode.ThemeIcon('book');
    this.command = {
      title: this.name,
      command: Commands.OpenBook,
      arguments: [this],
    };
  }
}

export class BookTreeProvider implements vscode.TreeDataProvider<BookTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<BookTreeItem | undefined | void> =
    new vscode.EventEmitter<BookTreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<BookTreeItem | undefined | void> =
    this._onDidChangeTreeData.event;

  constructor(private getBooksCallback: () => BookData[]) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: BookTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(): vscode.ProviderResult<BookTreeItem[]> {
    const books = this.getBooksCallback();
    return books.map((book) => new BookTreeItem(book.name, book.id, book.url, book.process, book.offset ?? 0));
  }
}
