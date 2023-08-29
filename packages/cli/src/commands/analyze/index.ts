import action from './actions'

import type { AnalyzeOption } from './types'
import type { CreateCommand } from '@/types/command'

export const createAnalyzeCommand: CreateCommand<AnalyzeOption, string> = function () {
  return {
    action,
    alias: 'a',
    command: 'analyze [root]',
    description: 'Analyze package dependencies (root default .)',
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
      },
      {
        rawName: '-d, --depth <number>',
        description: 'Depth of analysis',
        config: {
          default: Infinity
        }
      },
      {
        rawName: '--dev',
        description: 'Include devDependencies',
        config: {
          default: false
        }
      },
      {
        rawName: '--open',
        description: 'Auto open default browser',
        config: {
          default: false
        }
      }
    ]
  }
}
