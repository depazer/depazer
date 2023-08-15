/** @todo chalk */

type Logger = (message: string, tag?: string) => void

export const noteLogger: Logger = function (message, tag = 'NOTE') {
  console.log(` ${tag} `, message)
}

export const errorLogger: Logger = function (message, tag = 'ERROR') {
  console.log(` ${tag} `, message)
}

export const successLogger: Logger = function (message, tag = 'SUCCESS') {
  console.log(` ${tag} `, message)
}

export const warnLogger: Logger = function (message, tag = 'WARN') {
  console.log(` ${tag} `, message)
}
