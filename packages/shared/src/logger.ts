export const enum Colors {
  NULL,
  WHITE,
  CYAN,
  MAGENTA,
  BLUE,
  YELLOW,
  GREEN,
  RED,
  BLACK
}

interface ColorfulOption {
  color?: Colors
  bgColor?: Colors
  bold?: boolean
}
export function colorful(message: string, option: ColorfulOption = {}) {
  const { color, bgColor, bold } = {
    color: Colors.NULL,
    bgColor: Colors.NULL,
    bold: false,
    ...option
  }

  return `\x1b[${+bold};${color ? 38 - color : 39};${48 - bgColor}m${message}\x1b[0m`
}

type Logger = (message: string, tag?: string) => void

export const noteLogger: Logger = function (message, tag = 'NOTE') {
  console.log(
    colorful(` ${tag} `, { bgColor: Colors.BLUE, bold: true }),
    colorful(message, { color: Colors.BLUE })
  )
}

export const errorLogger: Logger = function (message, tag = 'ERROR') {
  console.log(
    colorful(` ${tag} `, { bgColor: Colors.RED, bold: true }),
    colorful(message, { color: Colors.RED })
  )
}

export const successLogger: Logger = function (message, tag = 'SUCCESS') {
  console.log(
    colorful(` ${tag} `, { bgColor: Colors.GREEN, bold: true }),
    colorful(message, { color: Colors.GREEN })
  )
}

export const warnLogger: Logger = function (message, tag = 'WARN') {
  console.log(
    colorful(` ${tag} `, { bgColor: Colors.YELLOW, bold: true }),
    colorful(message, { color: Colors.YELLOW })
  )
}
