import type { CreateCommand } from '@/types/command'

export const createDefaultCommand: CreateCommand = function (cli) {
  return {
    command: '',
    description: '',
    action() {
      cli.outputVersion()
      cli.outputHelp()
    }
  }
}
