/**
 * 文本数据类型
 */
export interface BookData {
  id: string;
  name: string;
  process: number;
  url: string;
}

/**
 * 命令枚举
 */
export enum Commands {
  OpenBook = 'GhostReader.openBook',
  DeleteBook = 'GhostReader.deleteEntry',
  ImportBook = 'GhostReader.import',
  RefreshBookList = 'GhostReader.refreshBookList',
  PrevLine = 'GhostReader.prev',
  NextLine = 'GhostReader.next',
  JumpLine = 'GhostReader.jump',
  SwitchReadingMode = 'GhostReader.switchReadingMode',
  SwitchCodingMode = 'GhostReader.switchCodingMode',
}

/**
 * 自定义上下文键
 */
export enum CustomWhenClauseContext {
  IsReadingMode = 'GhostReader.isReadingMode',
}

/**
 * 状态栏优先级
 */
export enum StatusBarPriority {
  ImportBook = 200,
  Process = 300,
  NextLine = 400,
  PrevLine = 500,
  JumpLine = 600,
  DisableKeyBind = 700,
  ActiveKeyBind = 800,
}

/**
 * 阅读模式常量
 */
export const isReadingMode = true;
