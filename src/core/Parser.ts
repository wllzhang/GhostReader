import * as readline from 'readline';
import { createReadStream } from 'fs';

/**
 * 文本文件解析器
 * 用于读取和处理 txt 文件内容
 */
export class Parser {
  private readonly lineWidth: number = 45;

  constructor(private readonly filePath: string) {}

  /**
   * 读取并解析文件内容
   * @returns 解析后的内容数组，每个元素不超过 lineWidth 字符
   */
  async parseFile(): Promise<string[]> {
    const lines = await this.readLines();
    return this.splitByWidth(lines);
  }

  /**
   * 逐行读取文件
   * @returns 文件所有非空行的数组
   */
  private async readLines(): Promise<string[]> {
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

  /**
   * 按指定宽度分割长行
   * @param lines 原始行数组
   * @returns 分割后的行数组
   */
  private splitByWidth(lines: string[]): string[] {
    const results: string[] = [];

    for (const line of lines) {
      if (line.length <= this.lineWidth) {
        results.push(line);
      } else {
        const count = Math.ceil(line.length / this.lineWidth);
        for (let i = 0; i < count; i++) {
          const content = line.substring(i * this.lineWidth, (i + 1) * this.lineWidth);
          results.push(content);
        }
      }
    }

    return results;
  }
}
