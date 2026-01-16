import { ExtensionContext, commands } from 'vscode';
import { Application } from './Application';
import { Commands } from '../types';
import message from '../utils/message';

/**
 * 设置并初始化应用
 */
export function setup(context: ExtensionContext): Application {
  const app = Application.getInstance(context);

  // 注册阅读控制命令
  registerReadingCommands(app);

  return app;
}

/**
 * 注册阅读相关命令
 */
function registerReadingCommands(app: Application): void {
  // 上一行
  app.context.subscriptions.push(
    commands.registerCommand(Commands.PrevLine, () => {
      if (app.readingBook) {
        app.readingBook.prevLine();
      } else {
        message('请先选择一本书！');
      }
    })
  );

  // 下一行
  app.context.subscriptions.push(
    commands.registerCommand(Commands.NextLine, () => {
      if (app.readingBook) {
        app.readingBook.nextLine();
      } else {
        message('请先选择一本书！');
      }
    })
  );

  // 跳转
  app.context.subscriptions.push(
    commands.registerCommand(Commands.JumpLine, async () => {
      if (!app.readingBook) {
        message('请先选择一本书！');
        return;
      }

      const input = await message.input('输入页码：', app.readingBook.book.process.toString());
      if (input) {
        const lineNumber = parseInt(input, 10);
        if (!isNaN(lineNumber)) {
          app.readingBook.jumpLine(lineNumber);
        } else {
          message.error('无效的页码！');
        }
      }
    })
  );

  // 开始阅读
  app.context.subscriptions.push(
    commands.registerCommand(Commands.Start, () => {
      if (app.readingBook) {
        app.readingBook.start();
        app.statusBar.showReadingControls();
        // 自动切换到 Reading 模式
        commands.executeCommand(Commands.SwitchReadingMode);
      } else {
        message('请先选择一本书！');
      }
    })
  );

  // 停止阅读
  app.context.subscriptions.push(
    commands.registerCommand(Commands.Stop, () => {
      if (app.readingBook) {
        app.readingBook.pause();
        app.statusBar.hideReadingControls();
      }
    })
  );
}
