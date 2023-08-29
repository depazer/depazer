import { CACError } from '@/errors/CACError'
import { generateReport } from './generateReport'
import { startAnalyzer } from './startAnalyzer'

import type { AnalyzeOption } from '../types'
import { resolve } from 'path'
import { noteLogger } from '@depazer/shared'

export default function (
  root: string,
  { depth, dev, jsonFile, port, open, '--': args }: AnalyzeOption
) {
  root = resolve(process.cwd(), root ?? '.')
  jsonFile = jsonFile === true ? 'analyzer.json' : jsonFile
  noteLogger(root, 'BASE')

  if (args.length !== 0) {
    throw new CACError('Unknown option ' + JSON.stringify(args))
  }

  switch (true) {
    case !!jsonFile:
      /**
       * @example pnpm dev a -j  |  depazer analyze --jsonFile
       * @example pnpm dev a -j report.json  |  depazer a --jsonFile report.json
       */
      return generateReport(jsonFile as string, depth, dev, root)
    default:
      /**
       * @example pnpm dev a  |  pnpm dev analyzer
       * @example depazer a  |  depazer analyzer
       */
      return startAnalyzer(port, depth, dev, open, root)
  }
}
