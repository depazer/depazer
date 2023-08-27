import { ServicePayload } from '../types'
import { graphTranslator, getLoopDependency, getModuleResolver } from '@depazer/core'

import type { DependencyNode } from '@depazer/core'

interface Params {
  depth: number
  includeDevDependency: boolean
}

interface Data {
  dependencyNodes: DependencyNode[]
  loopDependencies: string[][]
}

export async function graphService(
  { depth, includeDevDependency }: Params,
  root: string
): Promise<ServicePayload<Data | null>> {
  const resolver = await getModuleResolver(root, includeDevDependency)

  if (typeof resolver === 'string') {
    return { code: 200, message: resolver, data: null }
  }

  const dependencyTree = await resolver(depth)
  const flatDependencyTree = graphTranslator(dependencyTree)

  return {
    code: 200,
    message: 'OK',
    data: {
      dependencyNodes: flatDependencyTree,
      loopDependencies: getLoopDependency(flatDependencyTree)
    }
  }
}
