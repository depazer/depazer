import { CACError } from '@/errors/CACError'
import { generateReport } from './generateReport'
import { startAnalyzer } from './startAnalyzer'

import type { AnalyzeOption } from '../types'

export default function ({ jsonFile, port, '--': args }: AnalyzeOption) {
  if (args.length !== 0) {
    throw new CACError('Unknown option ' + JSON.stringify(args))
  }

  switch (true) {
    case !!jsonFile:
      /**
       * @example pnpm dev a -j  |  depazer analyze --jsonFile
       * @example pnpm dev a -j report.json  |  depazer a --jsonFile report.json
       */
      return generateReport(typeof jsonFile === 'boolean' ? 'analyzer.json' : jsonFile)
    default:
      /**
       * @example pnpm dev a  |  pnpm dev analyzer
       * @example depazer a  |  depazer analyzer
       */
      return startAnalyzer(port)
  }
}
