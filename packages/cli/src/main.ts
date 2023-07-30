import { cac } from 'cac'
import { chalk, errorLogger } from './utils/logger'
import { registerCommand } from './utils/registerCommand'
import { createCommandFunctions, helpCallback } from './commands'

import { version, name as _ } from '../package.json'

import type { CreateCommand } from '@/types/command'

export function createCli() {
  const cli = cac('depazer')
  /** @todo 命令名未定 */
  // const cli = cac(name.split('/')[1])

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
      errorLogger(chalk.red(error), 'UNKNOWN ERROR')
      throw error
    }

    cli.outputHelp()
  }
}

parseCommand()
