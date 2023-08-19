import { cac } from 'cac'
import { errorLogger } from '@depazer/shared'
import { registerCommand } from './utils/registerCommand'
import { createCommandFunctions, helpCallback } from './commands'

import { version, bin } from '../package.json'

import type { CreateCommand } from '@/types/command'

export function createCli() {
  const cli = cac(Object.keys(bin)[0])

  registerCommand(cli, createCommandFunctions as CreateCommand[])
  cli.help(helpCallback).version(version)

  return cli
}

export function parseCommand(run: boolean) {
  const cli = createCli()

  try {
    cli.parse(process.argv, { run })
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'CACError') {
      errorLogger(error.message, 'COMMAND ERROR')
      /* c8 ignore next 4 */
    } else {
      errorLogger(error + '', 'UNKNOWN ERROR')
      throw error
    }

    cli.outputHelp()
  }
}

parseCommand(process.env.NODE_ENV !== 'test')
