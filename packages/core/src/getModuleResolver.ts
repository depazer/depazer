import { resolve } from 'node:path'
import { readPackageJSON } from '@depazer/shared'
import { commonAdaptor } from './adaptors/commonAdaptor'
import { environmentScanner } from './environmentScanner'

import type { DependencyTree } from './types/dependencyDigraph'

/**
 *
 * @example
 * const resolver = await getModuleResolver(resolve(), true)
 *
 * if (typeof resolver !== 'string') {
 *   const res = await resolver(4)
 *
 *   writeFile(resolve('/.json'), JSON.stringify(res, null, 2))
 *   writeFile(resolve('/flat.json'), JSON.stringify(flatPipe(res), null, 2))
 * }
 */
export async function getModuleResolver(root: string, includeDeps: boolean) {
  const { packageManager, monorepo: _, error } = await environmentScanner(root)
  if (typeof error === 'string') return error

  const dependencyTree = await initDependencyTree(root, includeDeps)

  return (depth: number = Infinity) => commonAdaptor(packageManager, root, dependencyTree, depth)
}

export async function initDependencyTree(root: string, includeDeps: boolean) {
  const rootPackageJson = resolve(root, 'package.json')

  const { name, version, dependencies, devDependencies } = await readPackageJSON(rootPackageJson)
  return formatDependencyTree(
    name,
    version,
    dependencies,
    includeDeps ? devDependencies : undefined
  )
}

function formatDependencyTree(
  name: string,
  version: string,
  dependencies: Record<string, string>,
  devDependencies?: Record<string, string>
): DependencyTree {
  return {
    name,
    version,
    dependencies: Object.entries(dependencies).map(([name, version]) => ({
      name,
      version,
      dependencies: []
    })),
    devDependencies: Object.entries(devDependencies ?? {}).map(([name, version]) => ({
      name,
      version,
      dependencies: []
    }))
  }
}
