import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  ignoreDeadLinks: 'localhostLinks',

  title: 'Depazer',
  description: 'JavaScript 依赖包可视化分析工具',
  head: [['link', { rel: 'icon', href: '/logo.svg' }]],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: { src: '/logo.svg', width: 32, height: 32 },
    nav: [
      { text: '指南', link: '/guide/introduction', activeMatch: '/guide/' },
      { text: '在线体验', link: 'https://depazer.github.io/playground' }
    ],

    search: {
      provider: 'local'
    },

    sidebar: [
      {
        text: '入门',
        base: '/guide',
        items: [
          { text: '项目简介', link: '/introduction' },
          { text: '快速开始', link: '/quick-start' }
        ]
      },
      {
        text: '操作手册',
        base: '/guide',
        items: [
          {
            text: 'WEB 可视化操作',
            link: '/web'
          },
          {
            text: 'CLI 命令详情',
            link: '/cli'
          }
        ]
      },
      {
        text: '贡献指南',
        base: '/guide',
        items: [
          { text: '依赖json文件说明', link: '/contributing-json' },
          { text: '项目概述', link: '/contributing' },
          { text: 'server', link: '/contributing-server' },
          { text: 'cli', link: '/contributing-cli' },
          { text: 'web', link: '/contributing-web' },
          { text: 'core', link: '/contributing-core' }
        ]
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/depazer/depazer' }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present Depazer'
    }
  }
})
