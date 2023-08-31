# Depazer 是什么？

**Depazer** 是一个简单易用的 NPM 依赖关系分析工具，它通过命令行运行，可以生成对应可视化图表，让你更直观地感受和把握指定项目的模块概况。

## 诞生背景

NodeJS 的包管理逻辑非常复杂，直观感受是常常会安装许多不明所以的包，例如，当某个项目仅声明了 `glob` 依赖时：

::: details 点击查看 package.json

```json{11}
{
  "name": "tmp3",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {},
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "glob": "^10.1.0" // [!code focus]
  }
}
```

:::

执行 `npm install` 后发现它会带来包括 `balanced-match` 在内的共计 7 个子包：

```sh
node_modules
  ├─ balanced-match
  ├─ brace-expansion
  ├─ fs.realpath
  ├─ glob
  ├─ lru-cache
  ├─ minimatch
  ├─ minipass
  └─ path-scurry
```

分析这些包的 `package.json`，可以发现它们之间形成了如下依赖关系：

<img src="./img/glob-dependency.png" alt="glob-dependency" class="depazer-img" style="border:none;box-shadow:none" />

<!-- ![glob dependency](./img/glob-dependency.png) -->

那么，随着项目变大、依赖变多之后，这种依赖关系会变得非常非常复杂，常常让我们看不清：

- 为什么会安装某个特定 package；
- 为什么某些 package 会安装多个版本；
- 子 package 之间形成了怎样的父子依赖关系；
- 是否存在循环依赖；
- 等等。

因此期望实现一个工具，用于从 `package.json` 出发，递归遍历所有 `node_modules` 中的 `package.json` ，生成模块依赖关系图。

## 技术栈

- 项目构建：[`PNPM`](https://pnpm.io/zh/workspaces)(Workspase)、[`Turborepo`](https://turbo.build/repo)
- CLI端：[`CAC`](https://github.com/cacjs/cac)、[`ESBuild`](https://esbuild.github.io/)
- WEB端：[`Vue3`](https://vuejs.org/)、[`Vite`](https://vitejs.dev/)、[`D3`](https://d3js.org/)、[`Pinia`](https://pinia.vuejs.org/)、[`Unocss`](https://unocss.dev/)
- 工程化：[`TypeScript`](https://www.typescriptlang.org/)、[`Vitest`](https://vitest.dev/)(单元测试)、[`ESLint`](https://eslint.org/)、[`Husky`](https://github.com/typicode/husky)、[`lint-staged`](https://github.com/okonet/lint-staged)
- 文档构建：[`VitePress`](https://vitepress.dev/)

## 功能清单

✅ 支持分析 **npm、yarn、pnpm、bun** 包的依赖关系

✅ 支持生成依赖关系图

✅ 支持循环依赖分析

✅ 支持参数传递

✅ 支持JSON文件生成

✅ 支持 Vite 插件

❌ 支持 npm 包在线查询分析

❌ 支持 monorepo 分析

## 兼容性 <Badge type="info" text="待测试" />

TO DO...
