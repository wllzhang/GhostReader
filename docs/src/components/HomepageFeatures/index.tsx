import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
  emoji: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: '低调阅读',
    emoji: '👻',
    description: <>内容显示在状态栏，不占用编辑器空间，老板路过也看不出来。</>,
  },
  {
    title: '快捷键翻页',
    emoji: '⌨️',
    description: <>使用快捷键轻松翻页，支持 Reading/Coding 模式切换，避免快捷键冲突。</>,
  },
  {
    title: '书架管理',
    emoji: '📚',
    description: <>导入 TXT 文件到书架，自动记录阅读进度，随时继续上次阅读。</>,
  },
];

function Feature({ title, emoji, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <span style={{ fontSize: '4rem' }}>{emoji}</span>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
