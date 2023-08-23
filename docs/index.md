---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'Depazer'
  text: 'JavaScript 依赖包可视化分析工具'
  tagline: 简单易用的依赖包分析 CLI
  actions:
    - theme: brand
      text: 查看文档
      link: /guide/introduction.html
    - theme: alt
      text: 在线体验
      link: https://depazer.github.io/playground
  image:
    src: /logo.svg
    alt: depazer

features:
  - icon: 🦾
    title: 支持主流包管理器
    details: 同时支持NPM、YARN、PNPM、BUN的本地依赖分析。
  - icon: 🖨️
    title: 输出依赖信息
    details: 可输出依赖信息JSON文件，进行自定义分析。
  - icon: <svg xmlns="http://www.w3.org/2000/svg" width="30" viewBox="0 0 256 256.32"><defs><linearGradient id="a" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"/><stop offset="100%" stop-color="#BD34FE"/></linearGradient><linearGradient id="b" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"/><stop offset="8.333%" stop-color="#FFDD35"/><stop offset="100%" stop-color="#FFA800"/></linearGradient></defs><path fill="url(#a)" d="M255.153 37.938 134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"/><path fill="url(#b)" d="M185.432.063 96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028 72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"/></svg>
    title: Vite插件
    details: 提供@depazer/vite插件，支持直接在 Vite devServer 上预览项目依赖包关系。
  - icon: 🧑‍💻
    title: 便捷分析
    details: 全局安装CLI应用可随时分析项目依赖包信息。
  - icon: 👁️‍🗨️
    title: 可视化分析
    details: 可开启浏览器可视化查看依赖包的信息。
  - icon: 🎠
    title: 在线分析
    details: 支持使用NPM注册表模拟模块依赖关系。
---

<style>
.image-src[alt="depazer"] {
    max-width: 160px;
    max-height: 160px;
}

@media (min-width: 640px) {
.image-src[alt="depazer"] {
    max-width: 200px;
    max-height: 200px;
}
}

@media (min-width: 960px) {
.image-src[alt="depazer"] {
    max-width: 340px;
    max-height: 340px;
}
}
</style>
