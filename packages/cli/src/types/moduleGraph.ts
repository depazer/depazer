export interface ModuleInfo {
  name: string
  depth: number
  dependencies: string[]
  isDevDependency: boolean
}

export interface ModuleObject {
  name: string
  version: string
  dependencies: ModuleObject[]
}

export type ModuleGraph = ModuleInfo[]
