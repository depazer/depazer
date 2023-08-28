# depazer 是什么？

**depazer** 是一个用于分析 NPM 包的依赖关系的命令行工具，并且可以生成对应依赖关系图

## 技术栈

**depazer** 采用 `pnpm + monorepo` 架构搭建，利用 [Turborepo](https://turbo.build/repo) 做项目构建工具，[CLI](https://github.com/depazer/depazer/tree/main/packages/cli) 端采用 [cac](https://github.com/cacjs/cac) + [ESBuild](https://esbuild.github.io/) 搭建，[WEB](https://github.com/depazer/depazer/tree/main/packages/web) 端采用 [Vue3](https://vuejs.org/) + [Vite](https://vitejs.dev/) + [D3](https://d3js.org/) 搭建，CSS 框架采用 [Unocss](https://unocss.dev/)，测试框架采用 [Vitest](https://vitest.dev/)

## 功能

<p>✅ 支持分析 <strong>npm、yarn、pnpm、bun</strong> 包的依赖关系</p>
<p>✅ 支持生成依赖关系图</p>
<p>✅ 支持循环依赖分析</p>
<p>✅ 支持参数传递</p>
<p>✅ 支持JSON文件生成</p>
<p>✅ 支持 Vite 插件</p>
<p>❌ 支持 npm 包在线查询分析</p>
<p>❌ 支持 monorepo 分析</p>

## 兼容性
