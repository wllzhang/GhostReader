/**
 * 显示宽度相关工具函数
 * 用于处理中英文混排时的字符宽度计算和分页
 */

/**
 * 计算字符的显示宽度
 * 全角字符（中文、日文、韩文等）宽度为 2，半角字符宽度为 1
 */
export function getCharWidth(char: string): number {
  const code = char.charCodeAt(0);
  // 常见全角字符范围：CJK、日文假名、韩文、全角标点等
  if (
    (code >= 0x4e00 && code <= 0x9fff) || // CJK 统一汉字
    (code >= 0x3400 && code <= 0x4dbf) || // CJK 扩展 A
    (code >= 0x3000 && code <= 0x303f) || // CJK 标点符号
    (code >= 0xff00 && code <= 0xffef) || // 全角 ASCII、半角假名
    (code >= 0x3040 && code <= 0x309f) || // 平假名
    (code >= 0x30a0 && code <= 0x30ff) || // 片假名
    (code >= 0xac00 && code <= 0xd7af) || // 韩文音节
    (code >= 0x2e80 && code <= 0x2eff) || // CJK 部首补充
    (code >= 0x2f00 && code <= 0x2fdf)    // 康熙部首
  ) {
    return 2;
  }
  return 1;
}

/**
 * 计算字符串的显示宽度
 */
export function getStringDisplayWidth(str: string): number {
  let width = 0;
  for (const char of str) {
    width += getCharWidth(char);
  }
  return width;
}

/**
 * 按显示宽度截取字符串
 * @param str 原始字符串
 * @param startCharIndex 起始字符索引
 * @param maxWidth 最大显示宽度
 * @returns { text: 截取的文本, endCharIndex: 下一个字符的索引位置 }
 */
export function substringByDisplayWidth(
  str: string,
  startCharIndex: number,
  maxWidth: number
): { text: string; endCharIndex: number } {
  let currentWidth = 0;
  let result = '';
  let i = startCharIndex;

  while (i < str.length && currentWidth < maxWidth) {
    const char = str[i];
    const charWidth = getCharWidth(char);
    
    // 如果加上这个字符会超过宽度限制，停止
    if (currentWidth + charWidth > maxWidth) {
      break;
    }
    
    result += char;
    currentWidth += charWidth;
    i++;
  }

  return { text: result, endCharIndex: i };
}

/**
 * 计算从字符索引开始，往前跳过指定显示宽度后的字符索引
 */
export function getPrevCharIndexByDisplayWidth(
  str: string,
  currentCharIndex: number,
  displayWidth: number
): number {
  let width = 0;
  let i = currentCharIndex;
  
  while (i > 0 && width < displayWidth) {
    i--;
    width += getCharWidth(str[i]);
  }
  
  return i;
}

/**
 * 计算字符串按显示宽度分成多少段
 */
export function getSegmentCount(str: string, displayWidth: number): number {
  const totalWidth = getStringDisplayWidth(str);
  return Math.ceil(totalWidth / displayWidth);
}

/**
 * 计算字符串最后一个分段的起始字符索引
 */
export function getLastSegmentCharIndex(str: string, displayWidth: number): number {
  const segments = getSegmentCount(str, displayWidth);
  if (segments <= 1) {
    return 0;
  }
  
  // 从头开始，跳过 (segments - 1) 个段
  let charIndex = 0;
  for (let seg = 0; seg < segments - 1; seg++) {
    const { endCharIndex } = substringByDisplayWidth(str, charIndex, displayWidth);
    charIndex = endCharIndex;
  }
  
  return charIndex;
}

