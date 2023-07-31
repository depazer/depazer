import { chalk } from '@/utils/logger'

import type { CAC } from 'cac'
import type { CreateCommand } from '@/types/command'

export function registerCommand(cli: CAC, createCommandFunctions: CreateCommand[]) {
  createCommandFunctions.forEach((createCommand) => {
    const { action, alias, command, description, options = [] } = createCommand(cli)

    const COMMAND = cli.command(command, createDescription(description, alias))
    options.forEach(({ rawName, description, config }) =>
      COMMAND.option(rawName, description, config)
    )
    alias && COMMAND.alias(alias)
    COMMAND.action(action)
  })
}

export function createDescription(description: string, alias?: string): string {
  return createAliasTip(alias) + chalk.yellow(description)
}

export function createAliasTip(alias?: string): string {
  const space = '             '
  return chalk.magenta((alias ? `alias: ${alias + space}` : space).slice(0, 10))
}
