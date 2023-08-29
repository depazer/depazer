# @depazer/cli

<p align="center">👁️‍🗨️<b>A visual dependency analysis tool for JavaScript</b></p>

<p align="center"><img width="50%" alt="snapshot" src="https://github.com/depazer/depazer/assets/86412303/858660fa-2635-440a-a2df-8a598cfdd057" /></p>

<p align="center">
<a href="https://depazer.github.io/depazer">🧑‍💻 Document(zh-CN)</a>
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

## Getting Start

### Install

```bash
npm i -g @depazer/cli
```

### Usage

```bash
Usage:
  $ depazer

Commands:
  analyze [root]  alias: a  Analyze package dependencies (root default .)


For more info, run any command with the `--help` flag:
  $ depazer analyze --help
  $ depazer --help

Options:
  -h, --help     Display this message
  -v, --version  Display version number
```

### Analyze

```bash
Usage:
  $ depazer analyze [root]

Options:
  -p, --port <number>         Port of analyzer server (default: 4936)
  -j, --jsonFile [file name]  Generate json file for analysis
  -d, --depth <number>        Depth of analysis (default: Infinity)
  --dev                       Include devDependencies (default: false)
  -h, --help                  Display this message
```

## License

[MIT](./LICENSE) License &copy; 2023-PRESENT [depazer](https://github.com/depazer)
