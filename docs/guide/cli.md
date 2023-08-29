# CLI 命令详情

:::warning
在开始之前，你需要先全局安装 [depazer](./quick-start.md#%E4%BD%BF%E7%94%A8depazer-cli)
:::

depazer 目前支持三个命令 analyze、--help、--version，欢迎大家提 [PR](https://github.com/depazer/depazer/pulls) 贡献 🥳

## analyze

**analyze 命令用作分析依赖关系**，是 `depazer` 的核心命令 🤩，**它有一个别名 a**

:::warning
在分析前，需要保证分析的目录下有 `package.json` 文件以及对应包管理器的 `lock 文件`(例如 pnpm-lock.yaml)和 `node_modules` 文件夹
:::

### 基本用法

```bash
# 两个命令一样的效果 在下面的例子中都采用别名 a 做演示
# 命令执行后，会启动本地服务器，打开浏览器，即可查看分析结果
depazer analyze
depazer a
```

### 生成 JSON 文件

> 生成 JSON 文件不会启动本地服务器

```bash
# 会生成两个JSON文件到分析目录下，分别是 flat.json 和 analyzer.json
depazer a -j

# 生成文件名为 test 的JSON文件
depazer a -j test.json
```

### 传递参数用法

```bash

# 默认递归深度是Infinity
depazer a

# 指定递归深度为 5
depazer a -d 5
depazer a --depth 5

# 默认不分析 devDependencies 依赖，只会分析 dependencies 依赖
depazer a

# 分析dependencies
depazer a --dev

# 服务器默认端口 4936
depazer a

# 指定服务器端口 8080
# 如果遇到端口占用，会默认+1，直到找到可用端口
depazer a -p 8080
depazer a --port 8080

# 自动打开默认浏览器
depazer a -o
depazer a --open
```

上面的参数同样可以组合在一起使用

```bash
# 分析当前目录依赖关系
# 递归深度为 5，分析 devDependencies和dependencies 依赖，服务器端口为 8080，并且自动打开默认浏览器
depazer a -d 5 --dev -p 8080 -o

# 分析当前目录依赖关系，生成 JSON 文件 (-p 不可以和 -j 连用)
# 递归深度为 5，分析 devDependencies和dependencies 依赖
depazer a -j -d 5 --dev
```

### 指定分析目录

```bash
# 分析当前目录依赖关系
depazer a

# 分析当前目录下的上一层soundCode下的 core 目录
depazer a ../soundCode/core

# 分析上一层目录，并且指定递归深度为 5
depazer a ../ -d 5
```

## --help

`--help` 用于查看命令帮助信息，别名`-h`

```bash
# 查看 depazer 命令帮助信息
depazer --help
depazer -h

# 查看 analyze 命令帮助信息
depazer a --help
depazer a -h
```

## --version

`--version` 用于查看工具的版本，别名`-v`

```bash
# 查看 depazer 版本
depazer --version
depazer -v
```
