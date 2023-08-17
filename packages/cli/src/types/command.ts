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

type ICommandAction<T extends CommandOption = CommandOption, U = undefined> = U extends undefined
  ? (option: T) => unknown
  : (commandArg: U, option: T) => unknown

interface ICommand<T extends CommandOption = CommandOption, U = undefined> {
  command: string
  action: ICommandAction<T, U>
  description: string
  alias?: string
  options?: Option[]
}

type CreateCommand<T extends CommandOption = CommandOption, U = undefined> = (
  cli: CAC
) => ICommand<T, U>

export type { CreateCommand, ICommandAction }
