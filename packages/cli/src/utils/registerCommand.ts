import { Colors, colorful } from '@depazer/shared'

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
  return createAliasTip(alias) + colorful(description, { color: Colors.YELLOW })
}

export function createAliasTip(alias?: string): string {
  const space = '             '
  return colorful((alias ? `alias: ${alias + space}` : space).slice(0, 10), {
    color: Colors.MAGENTA
  })
}
