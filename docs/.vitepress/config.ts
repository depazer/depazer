import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Depazer',
  description: 'JavaScript 依赖包可视化分析工具',
  head: [['link', { rel: 'icon', href: '/logo.svg' }]],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: { src: '/logo.svg', width: 20, height: 18 },
    nav: [
      { text: '指南', link: '/guide/introduction', activeMatch: '/guide/' },
      { text: '在线体验', link: 'https://depazer.github.io/playground' }
    ],

    sidebar: [
      {
        text: '开始',
        items: [
          { text: '简介', link: '/guide/introduction' },
          { text: '快速开始', link: '/guide/quick-start' }
        ]
      },
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
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
