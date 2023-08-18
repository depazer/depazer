import { resolve } from 'node:path'

import { commonAdaptor } from './adaptors/commonAdaptor'
import { environmentScanner } from './environmentScanner'
import { readPackageJSON } from '@depazer/shared'

import type { ModuleObject } from '@/types/moduleGraph'

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

  const moduleObject = await initModuleObject(root, includeDeps)

  return (depth: number = Infinity) => commonAdaptor(packageManager, root, moduleObject, depth)
}

export async function initModuleObject(root: string, includeDeps: boolean) {
  const rootPackageJson = resolve(root, 'package.json')

  const { name, version, dependencies, devDependencies } = await readPackageJSON(rootPackageJson)
  return formatModuleObject(name, version, dependencies, includeDeps ? devDependencies : undefined)
}

function formatModuleObject(
  name: string,
  version: string,
  dependencies: Record<string, string>,
  devDependencies?: Record<string, string>
): ModuleObject {
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
