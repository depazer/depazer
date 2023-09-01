import { DependencyNode } from '@depazer/core'

declare global {
  interface GlobalData {
    dependencyNodes: DependencyNode[]
    packedNodes: string[]
    loopLinks: string[]
    id: number
  }

  function generateNodeLink(
    source: string,
    dependencies: string[],
    globalData: GlobalData
  ): {
    source: string
    target: string
    linkColor: string
  }[]
  function generateDigraphWithLink(id: number, rootDependency: string, globalData: GlobalData): void
  function generateVirtualDependencyNodes(
    id: number,
    rootDependencyID: string,
    maxDepth: number,
    globalData: GlobalData,
    includeDevDependencies?: boolean
  ): Promise<void>
}
