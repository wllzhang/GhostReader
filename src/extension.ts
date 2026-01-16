import * as vscode from 'vscode';
import message from './utils/message';
import { setup } from './core/index';

export function activate(context: vscode.ExtensionContext) {
  const app = setup(context);

  if (!app.readingBook) {
    message('请选择要阅读的书籍！');
  }
}

export function deactivate() {}
