import { Chalk } from 'chalk'

export const chalk = new Chalk({ level: 1 })

type Logger = (message: string, tag?: string) => void

export const noteLogger: Logger = function (message, tag = 'NOTE') {
  console.log(chalk.bgCyan.white(` ${tag} `), chalk.cyan(message))
}

export const errorLogger: Logger = function (message, tag = 'ERROR') {
  console.log(chalk.bgRed.white(` ${tag} `), chalk.red(message))
}

export const successLogger: Logger = function (message, tag = 'SUCCESS') {
  console.log(chalk.bgGreen.white(` ${tag} `), chalk.green(message))
}

export const warnLogger: Logger = function (message, tag = 'WARN') {
  console.log(chalk.bgYellow.white(` ${tag} `), chalk.yellow(message))
}
