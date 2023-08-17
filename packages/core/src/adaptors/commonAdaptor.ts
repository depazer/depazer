import { hasFile, readPackageJSON } from '@depazer/shared'
import { resolve } from 'node:path'

import type { ModuleObject } from '@/types/moduleGraph'

const defaultDependency = {
  version: 'unknown',
  dependencies: []
}

const _global = {
  markSet: new Set<string>(),
  maxDepth: Infinity,
  packageManager: 'npm'
}

/**
 * @desc 通用模块解析器
 * @test pnpm - 8.6.12 npm - 9.6.7 yarn - 1.22.19
 * @param packageManager
 * @param root
 * @param moduleObject
 * @param depth
 * @returns
 */
export async function commonAdaptor(
  packageManager: 'pnpm' | 'yarn' | 'npm',
  root: string,
  moduleObject: ModuleObject,
  depth: number
): Promise<ModuleObject> {
  if (depth <= 1) return moduleObject

  _global.markSet.clear()
  _global.maxDepth = depth
  _global.packageManager = packageManager

  moduleObject.dependencies = await Promise.all(
    moduleObject.dependencies.map(async ({ name }) => {
      return await resolveModule(root, root, name, 2)
    })
  )

  moduleObject.devDependencies = await Promise.all(
    moduleObject.devDependencies!.map(async ({ name }) => {
      return await resolveModule(root, root, name, 2)
    })
  )
  return moduleObject
}

/**
 * @desc 搜索模块的package.json文件
 * @param root 项目根目录 查找路径上限
 * @param currentPath 当前模块路径
 * @param dependency 模块名
 * @param depth 当前模块深度
 * @returns 模块信息
 */
async function resolveModule(
  root: string,
  currentPath: string,
  dependency: string,
  depth: number
): Promise<ModuleObject> {
  const dependencyPath = resolve(currentPath, 'node_modules', dependency)
  const packageJSONPath = resolve(dependencyPath, 'package.json')

  if ((await hasFile(packageJSONPath)) === false) {
    /** @desc 防止文件夹越界，超出根目录 */
    if (currentPath === root) {
      return depth === 3 && _global.packageManager === 'pnpm'
        ? resolveModule(root, resolve(root, 'node_modules/.pnpm'), dependency, depth)
        : { name: dependency, ...defaultDependency }
    }
    /** @desc 查找父级目录 */
    return resolveModule(root, resolve(currentPath, '..'), dependency, depth)
  }

  const { name, version, dependencies } = await readPackageJSON(packageJSONPath)

  if (_global.markSet.has(packageJSONPath)) {
    return { ...defaultDependency, name: dependency, version }
  } else {
    _global.markSet.add(packageJSONPath)
  }

  return {
    ...defaultDependency,
    name,
    version,
    dependencies: await generateModuleObject(root, dependencyPath, dependencies, depth)
  }
}

/**
 * @desc 生成模块依赖对象, 若超出最大深度则返回package.json依赖的书面版本, 不再递归
 * @param root 同上
 * @param currentPath 同上
 * @param dependencies 模块依赖
 * @param depth 同上
 * @returns 模块依赖对象
 */
async function generateModuleObject(
  root: string,
  currentPath: string,
  dependencies: Record<string, string>,
  depth: number
) {
  return depth >= _global.maxDepth
    ? Object.entries(dependencies).map(([name, version]) => ({
        ...defaultDependency,
        name,
        version
      }))
    : await Promise.all(
        Object.keys(dependencies).map(async (name) => {
          return await resolveModule(root, currentPath, name, depth + 1)
        })
      )
}
