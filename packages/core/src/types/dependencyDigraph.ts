export type SupportedPackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'

export interface DependencyTree {
  name: string
  version: string
  dependencies: DependencyTree[]
  devDependencies?: DependencyTree[]
}

export interface DependencyNode {
  name: string
  depth: number
  dependencies: string[]
  isDevDependency: boolean
}
