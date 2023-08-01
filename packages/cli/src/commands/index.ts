export { helpCallback } from './help'
import { createAnalyzeCommand } from './analyze'
import { createDefaultCommand } from './default/index'

export const createCommandFunctions = [createAnalyzeCommand, createDefaultCommand]
