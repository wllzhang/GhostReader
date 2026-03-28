import * as vscode from 'vscode';
import { setup } from './core/index';

export function activate(context: vscode.ExtensionContext) {
  setup(context);
  // 不再显示提示消息，让用户自然使用扩展
}

export function deactivate() {}
