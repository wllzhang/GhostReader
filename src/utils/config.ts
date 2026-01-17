import { workspace } from 'vscode';

/**
 * 配置管理工具
 */
export class Config {
  private static readonly SECTION = 'ghostReader';

  /**
   * 获取每次显示的行数
   */
  static getDisplayLines(): number {
    return workspace.getConfiguration(this.SECTION).get('displayLines', 1);
  }

  /**
   * 获取自动停止延迟时间（秒）
   */
  static getAutoStopDelay(): number {
    return workspace.getConfiguration(this.SECTION).get('autoStopDelay', 0);
  }

  /**
   * 获取状态栏显示的最大字符数
   */
  static getDisplayWidth(): number {
    return workspace.getConfiguration(this.SECTION).get('displayWidth', 45);
  }

  /**
   * 监听配置变化
   */
  static onDidChange(callback: () => void) {
    return workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(this.SECTION)) {
        callback();
      }
    });
  }
}

