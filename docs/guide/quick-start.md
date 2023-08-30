# Depazer 快速上手

## 线上体验

可以打开我们的 [Playground 线上站点](https://depazer.github.io/playground) 体验**依赖关系分析**的可视化功能。

## 使用Depazer CLI

::: tip
推荐 [Node.js](https://nodejs.org) 版本高于`v16.0`。
:::

使用你喜爱的包管理器安装`@depazer/cli`到**全局**。

::: code-group

```bash [npm]
npm install @depazer/cli -g
```

```bash [pnpm]
pnpm install @depazer/cli -g
```

```bash [yarn]
yarn global add @depazer/cli
```

:::

安装完成后即可使用`depazer`命令来使用了。

打开终端，将运行路径调整至项目的**根目录**，执行`depazer analyze`命令后，就会自动打开浏览器显示依赖包可视化前端页面。默认的本地地址为`localhost:4936`。

可以通过 [CLI 命令详情](./cli.md) 查看更多命令的使用方法。

## 使用Vite 插件

若你的开发环境基于`vite`,可以选择安装我们的`vite`插件`@depazer/vite`。

::: code-group

```bash [npm]
npm install @depazer/vite -D
```

```bash [pnpm]
pnpm install @depazer/vite -D
```

```bash [yarn]
yarn add @depazer/vite -D
```

:::

安装完插件后在`vite`配置文件中添加我们的插件。

```ts [vite.config.ts]
import { defineConfig } from 'vite'
import depazer from '@depazer/vite' // [!code focus]

export default defineConfig({
  plugins: [depazer()] // [!code focus]
})
```

`vite`启动**开发服务器**后，打开浏览器即可在`/__depazer`路径下浏览该项目的依赖包。

例: [http://localhost:5173/\_\_depazer](http://localhost:5173/__depazer)
