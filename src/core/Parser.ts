import * as readline from 'readline';
import { createReadStream } from 'fs';

/**
 * 文本文件解析器
 * 用于读取和处理 txt 文件内容
 */
export class Parser {
  constructor(private readonly filePath: string) {}

  /**
   * 读取并解析文件内容
   * @returns 文件所有非空行的数组（保持原始行结构）
   */
  async parseFile(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const lines: string[] = [];
      const fileStream = createReadStream(this.filePath, { encoding: 'utf-8' });
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      rl.on('line', (line: string) => {
        if (line.trim()) {
          lines.push(line);
        }
      });

      rl.on('close', () => {
        resolve(lines);
      });

      rl.on('error', (err: Error) => {
        reject(err);
      });
    });
  }
}
