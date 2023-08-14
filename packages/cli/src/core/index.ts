import { resolve } from 'path'

import { commonAdaptor } from './adaptors/commonAdaptor'
import { environmentScanner } from './environmentScanner'
import { readPackageJSON } from '@/utils/readPackageJSON'

import type { ModuleObject } from '@/types/moduleGraph'

/**
 *
 * @example
 *  const resolver = await getModuleResolver(resolve(), true)
 *  const res = await resolver?.(4)
 *
 *  writeFile(resolve('/.json'), JSON.stringify(res, null, 2))
 *  writeFile(resolve('/flat.json'), JSON.stringify(flatPipe(res), null, 2))
 */
export async function getModuleResolver(root: string, includeDeps: boolean) {
  const { packageManager, monorepo: _, error } = await environmentScanner(root)
  if (error) return

  const moduleObject = await initModuleObject(root, includeDeps)

  return moduleObject
    ? (depth: number = Infinity) => commonAdaptor(packageManager, root, moduleObject, depth)
    : undefined
}

async function initModuleObject(root: string, includeDeps: boolean) {
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
