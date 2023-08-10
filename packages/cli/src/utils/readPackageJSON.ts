import { readFile } from 'node:fs/promises'

interface PackageJSON {
  name?: string
  version?: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  [key: string]: unknown
}

export async function readPackageJSON<T = PackageJSON>(filePath: string) {
  const content = await readFile(filePath, 'utf-8')
  return JSON.parse(content) as T
}
