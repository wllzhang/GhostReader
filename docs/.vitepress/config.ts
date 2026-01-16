import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'GhostReader',
  description: '在 VSCode 状态栏优雅阅读小说的摸鱼神器',
  
  lang: 'zh-CN',
  
  base: '/GhostReader/',
  
  head: [
    ['link', { rel: 'icon', href: '/GhostReader/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#5f67ee' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:title', content: 'GhostReader | VSCode 状态栏阅读器' }],
    ['meta', { property: 'og:site_name', content: 'GhostReader' }],
    ['meta', { property: 'og:url', content: 'https://wllzhang.github.io/GhostReader/' }],
  ],
  
  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: '配置', link: '/guide/configuration' },
      { text: '开发', link: '/development/contributing' },
      { 
        text: 'v2.0.0',
        items: [
          { text: '更新日志', link: 'https://github.com/wllzhang/GhostReader/releases' },
          { text: '贡献指南', link: '/development/contributing' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始使用',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '功能介绍', link: '/guide/features' },
            { text: '配置选项', link: '/guide/configuration' },
          ]
        }
      ],
      '/development/': [
        {
          text: '开发指南',
          items: [
            { text: '贡献指南', link: '/development/contributing' },
            { text: '本地开发', link: '/development/local-development' },
            { text: '发布流程', link: '/development/release' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wllzhang/GhostReader' }
    ],

    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2024-present wllzhang'
    },

    editLink: {
      pattern: 'https://github.com/wllzhang/GhostReader/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outline: {
      label: '页面导航',
      level: [2, 3]
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    }
  },

  markdown: {
    lineNumbers: true
  }
})

