import action from './actions'

import type { AnalyzeOption } from './types'
import type { CreateCommand } from '@/types/command'

export const createAnalyzeCommand: CreateCommand<AnalyzeOption> = function () {
  return {
    action,
    alias: 'a',
    command: 'analyze',
    description: 'Analyze package dependencies',
    options: [
      {
        rawName: '-p, --port <number>',
        description: 'Port of analyzer server',
        config: {
          default: 4936
        }
      },
      {
        rawName: '-j, --jsonFile [file name]',
        description: 'Generate json file for analysis'
      }
    ]
  }
}
