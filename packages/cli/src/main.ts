import { cac } from 'cac'
import { errorLogger } from '@depazer/shared'
import { registerCommand } from './utils/registerCommand'
import { createCommandFunctions, helpCallback } from './commands'

import { version, bin } from '../package.json'

import type { CreateCommand } from '@/types/command'

export function createCli() {
  /** @todo 命令名未定 与package.bin字段第一个命令同步 */
  const cli = cac(Object.keys(bin)[0])

  registerCommand(cli, createCommandFunctions as CreateCommand[])
  cli.help(helpCallback).version(version)

  return cli
}

export function parseCommand() {
  const cli = createCli()

  try {
    cli.parse()
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'CACError') {
      errorLogger(error.message, 'COMMAND ERROR')
    } else {
      errorLogger(error + '', 'UNKNOWN ERROR')
      throw error
    }

    cli.outputHelp()
  }
}
