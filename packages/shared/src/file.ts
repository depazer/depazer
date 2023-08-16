import { resolve } from 'node:path'
import { copyFile, mkdir, readFile, readdir, stat } from 'node:fs/promises'

export async function hasFile(...filePath: string[]) {
  try {
    const stats = await stat(resolve(...filePath))
    return stats.isFile()
  } catch (error) {
    return false
  }
}

export async function hasFolder(...filePath: string[]) {
  try {
    const stats = await stat(resolve(...filePath))
    return stats.isDirectory()
  } catch (error) {
    return false
  }
}

export async function copyDir(from: string, to: string) {
  await mkdir(to).catch(() => void 0)
  const list = await readdir(from)
  for (const item of list) {
    const sourcePath = resolve(from, item)
    const targetPath = resolve(to, item)
    if (await hasFile(sourcePath)) {
      copyFile(sourcePath, targetPath)
    } else {
      copyDir(sourcePath, targetPath)
    }
  }
}

interface PackageJSON {
  name: string
  version: string
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  [key: string]: unknown
}

export async function readPackageJSON<T = PackageJSON>(filePath: string) {
  const content = await readFile(filePath, 'utf-8')
  return {
    name: 'root',
    version: '0.0.0',
    dependencies: {},
    devDependencies: {},
    ...JSON.parse(content)
  } as T
}
