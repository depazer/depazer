import { environmentScanner } from '@depazer/core'

import type { ServicePayload } from '../types'

export async function environmentService(root: string): Promise<ServicePayload> {
  const { error, packageManager } = await environmentScanner(root)

  return error === false
    ? {
        code: 200,
        message: 'OK',
        data: {
          packageManager,
          nodeVersion: process.version
        }
      }
    : { code: 400, message: error, data: {} }
}
