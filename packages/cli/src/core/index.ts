import { hasFile } from '@/utils/hasFile'
import adaptors from './adaptors'
import { environmentScanner } from './environmentScanner'
import { resolve } from 'path'
import { errorLogger } from '@/utils/logger'
import { readPackageJSON } from '@/utils/readPackageJSON'

import type { MaybeUndefined } from '@/types'
import type { ModuleObject } from '@/types/moduleGraph'

export async function getModuleResolver(root: string, includeDeps: boolean) {
  const { packageManager, monorepo: _ } = await environmentScanner(root)

  const moduleObject = await initModuleObject(root, includeDeps)

  return moduleObject
    ? (depth: number = Infinity) => adaptors[packageManager](root, moduleObject, depth)
    : undefined
}

async function initModuleObject(root: string, includeDeps: boolean) {
  const rootPackageJson = resolve(root, 'package.json')

  const hasPackageFile = hasFile(rootPackageJson)
  if (!hasPackageFile) {
    return errorLogger('package.json not found: ' + root)
  }

  const { name, version, dependencies, devDependencies } = await readPackageJSON(rootPackageJson)
  return formatModuleObject(name, version, dependencies, includeDeps ? devDependencies : undefined)
}

export function formatModuleObject(
  name: MaybeUndefined<string>,
  version: MaybeUndefined<string>,
  dependencies: MaybeUndefined<Record<string, string>>,
  devDependencies: MaybeUndefined<Record<string, string>>
): ModuleObject {
  const mergedDependencies = { ...(devDependencies ?? {}), ...(dependencies ?? {}) }

  return {
    name: name ?? 'root',
    version: version ?? '0.0.0',
    dependencies: Object.entries(mergedDependencies).map(([name, version]) => ({
      name,
      version,
      dependencies: []
    }))
  }
}
