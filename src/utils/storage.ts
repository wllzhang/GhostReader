import { Memento, ExtensionContext } from 'vscode';

let storage: Memento;

/**
 * 初始化存储系统
 */
export function setupStorage(context: ExtensionContext): void {
  storage = context.globalState;
  context.globalState.setKeysForSync([]);
}

/**
 * 获取存储的值
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getStorage<T = any>(key: string): T | undefined {
  return storage.get<T>(key);
}

/**
 * 设置存储的值
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setStorage<T = any>(key: string, value: T): void {
  storage.update(key, value);
}

/**
 * 删除存储的值
 */
export function removeStorage(key: string): void {
  storage.update(key, undefined);
}
