/**
 * 书籍数据类型
 */
export interface BookData {
  id: string;
  name: string;
  process: number;
  /** 当前行内的字符偏移（用于智能分页） */
  offset?: number;
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
  Start = 'GhostReader.start',
  Stop = 'GhostReader.stop',
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
  Start = 400,
  Stop = 500,
  NextLine = 600,
  PrevLine = 700,
  JumpLine = 800,
  DisableKeyBind = 900,
  ActiveKeyBind = 1000,
}

/**
 * 阅读模式常量
 */
export const isReadingMode = true;
