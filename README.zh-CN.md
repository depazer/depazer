# Depazer

<p align="center">👁️‍🗨️<b>一个 JavaScript 依赖可视化分析工具</b></p>

<p align="center"><img width="50%" alt="snapshot" src="https://github.com/depazer/depazer/assets/86412303/858660fa-2635-440a-a2df-8a598cfdd057" /></p>

<p align="center">
<a href="https://depazer.github.io/depazer">🧑‍💻 开发文档(zh-CN)</a> |
<a href="/README.md">🌐 README (en-US)</a> |
<a href="https://depazer.github.io/playground">👀 Web Online</a>
</p>

<p align="center">
<a href="https://www.npmjs.com/%40depazer/cli" target="_blank"><img src="https://img.shields.io/npm/v/%40depazer/cli" alt="NPM Version" /></a>
<img alt="LICENSE" src="https://img.shields.io/github/license/depazer/depazer">
<a href="https://codecov.io/gh/depazer/depazer" > 
 <img src="https://codecov.io/gh/depazer/depazer/branch/main/graph/badge.svg?token=IOMUECCGVD"/> 
 </a>
<a href="https://github.com/depazer/depazer/actions/workflows/ci.yaml"><img src="https://github.com/depazer/depazer/actions/workflows/ci.yaml/badge.svg" alt="unit-test" /></a>
<a href="https://depazer.github.io/depazer/"><img src="https://github.com/depazer/depazer/actions/workflows/deploy.yml/badge.svg" /></a>
</p>

## 快速开始

### 安装

```bash
npm i -g @depazer/cli
```

### 使用

```bash
Usage:
  $ depazer

Commands:
  analyze  alias: a  Analyze package dependencies


For more info, run any command with the `--help` flag:
  $ depazer analyze --help
  $ depazer --help

Options:
  -h, --help     Display this message
  -v, --version  Display version number
```

### Analyze 命令

```bash
Usage:
  $ depazer analyze

Options:
  -p, --port <number>         Port of analyzer server (default: 4936)
  -j, --jsonFile [file name]  Generate json file for analysis
  -h, --help                  Display this message
```

## 开源协议

[MIT](./LICENSE) License &copy; 2023-PRESENT [depazer](https://github.com/depazer)
