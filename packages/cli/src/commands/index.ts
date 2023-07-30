export { helpCallback } from './help'
import { createAnalyzeCommand } from './analyzer'
import { createDefaultCommand } from './default/index'

export const createCommandFunctions = [createAnalyzeCommand, createDefaultCommand]
