import { graphService } from '../services/graph'
import { environmentService } from '../services/environment'

import type { ServicePayload } from '../types'

export async function apiController(
  url: URL,
  method: 'GET' | string,
  root: string,
  prefix: string = ''
): Promise<ServicePayload> {
  if (method !== 'GET') return defaultService()

  const { searchParams, pathname } = url
  const service =
    {
      [`${prefix}/graph`]: () => {
        const depth = +(searchParams.get('depth') ?? '') || Infinity
        const includeDevDependency = searchParams.get('includeDev') === 'true'

        return graphService({ depth, includeDevDependency }, root)
      },
      [`${prefix}/environment`]: () => environmentService(root)
    }[pathname] ?? defaultService

  return await service()
}

export function defaultService(): ServicePayload {
  return {
    code: 404,
    message: 'Not Found!',
    data: null
  }
}
