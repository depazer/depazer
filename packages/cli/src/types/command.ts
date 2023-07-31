import type { CAC } from 'cac'

interface Option {
  rawName: string
  description: string
  config?: {
    default?: unknown
    type?: unknown[]
  }
}

type CommandOption = object

type ICommandAction<T extends CommandOption = CommandOption> = (option: T) => unknown

interface ICommand<T extends CommandOption = CommandOption> {
  command: string
  action: ICommandAction<T>
  description: string
  alias?: string
  options?: Option[]
}

type CreateCommand<T extends CommandOption = CommandOption> = (cli: CAC) => ICommand<T>

export type { CreateCommand, ICommandAction }
