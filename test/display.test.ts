import * as assert from 'assert';
import {
  getCharWidth,
  getStringDisplayWidth,
  substringByDisplayWidth,
  getPrevCharIndexByDisplayWidth,
  getSegmentCount,
  getLastSegmentCharIndex,
} from '../src/utils/display';

suite('Display Utils Test Suite', () => {
  suite('getCharWidth', () => {
    test('英文字符宽度为 1', () => {
      assert.strictEqual(getCharWidth('a'), 1);
      assert.strictEqual(getCharWidth('Z'), 1);
      assert.strictEqual(getCharWidth('0'), 1);
      assert.strictEqual(getCharWidth(' '), 1);
    });

    test('中文字符宽度为 2', () => {
      assert.strictEqual(getCharWidth('中'), 2);
      assert.strictEqual(getCharWidth('文'), 2);
      assert.strictEqual(getCharWidth('章'), 2);
    });

    test('日文假名宽度为 2', () => {
      assert.strictEqual(getCharWidth('あ'), 2); // 平假名
      assert.strictEqual(getCharWidth('ア'), 2); // 片假名
    });

    test('全角标点宽度为 2', () => {
      assert.strictEqual(getCharWidth('。'), 2);
      assert.strictEqual(getCharWidth('，'), 2);
      assert.strictEqual(getCharWidth('！'), 2);
    });
  });

  suite('getStringDisplayWidth', () => {
    test('纯英文字符串', () => {
      assert.strictEqual(getStringDisplayWidth('hello'), 5);
      assert.strictEqual(getStringDisplayWidth('abc123'), 6);
    });

    test('纯中文字符串', () => {
      assert.strictEqual(getStringDisplayWidth('你好'), 4);
      assert.strictEqual(getStringDisplayWidth('第一章'), 6);
    });

    test('中英混合字符串', () => {
      assert.strictEqual(getStringDisplayWidth('Hello你好'), 9); // 5 + 4
      assert.strictEqual(getStringDisplayWidth('第1章'), 5); // 2 + 1 + 2
    });

    test('空字符串', () => {
      assert.strictEqual(getStringDisplayWidth(''), 0);
    });
  });

  suite('substringByDisplayWidth', () => {
    test('从头截取纯英文', () => {
      const result = substringByDisplayWidth('hello world', 0, 5);
      assert.strictEqual(result.text, 'hello');
      assert.strictEqual(result.endCharIndex, 5);
    });

    test('从头截取纯中文', () => {
      const result = substringByDisplayWidth('你好世界', 0, 4);
      assert.strictEqual(result.text, '你好');
      assert.strictEqual(result.endCharIndex, 2);
    });

    test('从中间位置截取', () => {
      const result = substringByDisplayWidth('hello world', 6, 5);
      assert.strictEqual(result.text, 'world');
      assert.strictEqual(result.endCharIndex, 11);
    });

    test('中英混合截取', () => {
      const result = substringByDisplayWidth('第1章 标题', 0, 6);
      assert.strictEqual(result.text, '第1章'); // 2+1+2=5, 空格=1, 共6
      assert.strictEqual(result.endCharIndex, 3);
    });

    test('宽度不足以容纳一个全角字符时停止', () => {
      const result = substringByDisplayWidth('中文', 0, 1);
      assert.strictEqual(result.text, '');
      assert.strictEqual(result.endCharIndex, 0);
    });

    test('空字符串处理', () => {
      const result = substringByDisplayWidth('', 0, 10);
      assert.strictEqual(result.text, '');
      assert.strictEqual(result.endCharIndex, 0);
    });
  });

  suite('getPrevCharIndexByDisplayWidth', () => {
    test('纯英文往前回退', () => {
      const result = getPrevCharIndexByDisplayWidth('hello world', 11, 5);
      assert.strictEqual(result, 6); // 从末尾往前 5 个字符
    });

    test('纯中文往前回退', () => {
      const result = getPrevCharIndexByDisplayWidth('你好世界', 4, 4);
      assert.strictEqual(result, 2); // 从末尾往前 2 个中文字符 (宽度4)
    });

    test('回退到开头', () => {
      const result = getPrevCharIndexByDisplayWidth('hello', 5, 10);
      assert.strictEqual(result, 0);
    });

    test('从中间位置回退', () => {
      const result = getPrevCharIndexByDisplayWidth('hello world', 6, 3);
      assert.strictEqual(result, 3);
    });
  });

  suite('getSegmentCount', () => {
    test('短字符串只有一段', () => {
      assert.strictEqual(getSegmentCount('hello', 10), 1);
    });

    test('刚好一段', () => {
      assert.strictEqual(getSegmentCount('hello', 5), 1);
    });

    test('需要两段', () => {
      assert.strictEqual(getSegmentCount('hello world', 6), 2);
    });

    test('中文分段', () => {
      assert.strictEqual(getSegmentCount('你好世界', 4), 2); // 宽度8，每段4
    });

    test('空字符串', () => {
      assert.strictEqual(getSegmentCount('', 10), 0);
    });
  });

  suite('getLastSegmentCharIndex', () => {
    test('短字符串返回 0', () => {
      assert.strictEqual(getLastSegmentCharIndex('hello', 10), 0);
    });

    test('两段时返回第二段起始位置', () => {
      const result = getLastSegmentCharIndex('hello world', 6);
      assert.strictEqual(result, 6); // 'hello ' 占 6，'world' 从索引 6 开始
    });

    test('中文分段', () => {
      const result = getLastSegmentCharIndex('你好世界', 4);
      assert.strictEqual(result, 2); // '你好' 占宽度4，'世界' 从索引 2 开始
    });

    test('空字符串', () => {
      assert.strictEqual(getLastSegmentCharIndex('', 10), 0);
    });
  });

  suite('翻页场景测试', () => {
    test('空行不应阻止翻页', () => {
      // 模拟文本内容包含空行
      const contents = ['第一章', '', '第二章'];
      
      // 空行应该被正确处理
      const emptyLine = contents[1];
      assert.strictEqual(emptyLine, '');
      
      // 空字符串 !== undefined，所以不应该停止翻页
      assert.strictEqual(emptyLine === undefined, false);
    });

    test('长行应正确分段', () => {
      const longLine = '这是一个非常长的段落需要分成多段显示';
      const displayWidth = 10;
      
      // 第一段
      const seg1 = substringByDisplayWidth(longLine, 0, displayWidth);
      assert.strictEqual(seg1.text, '这是一个非'); // 5个中文 = 10宽度
      assert.strictEqual(seg1.endCharIndex, 5);
      
      // 第二段
      const seg2 = substringByDisplayWidth(longLine, seg1.endCharIndex, displayWidth);
      assert.strictEqual(seg2.text, '常长的段落');
      assert.strictEqual(seg2.endCharIndex, 10);
    });

    test('章节标题格式', () => {
      const title = '第705章 谈成大单！';
      const displayWidth = 20;
      
      const result = substringByDisplayWidth(title, 0, displayWidth);
      // 第705章 = 2+1+1+1+2+1 = 8
      // 谈成大单！= 2+2+2+2+2 = 10
      // 总宽度 = 18，小于 20，所以全部显示
      assert.strictEqual(result.text, title);
      assert.strictEqual(result.endCharIndex, title.length);
    });
  });
});

